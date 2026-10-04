"""
Shiftbase - AI Agent & LLM Providers
Integrates Google Gemini (free tier), local Ollama, and a deterministic heuristic fallback.
"""

import json
import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

import httpx
from config import settings
from models.plan import FieldMapping, PlanProposalResponse
from models.schema import SchemaDefinition
from prompts.mapping_prompt import (
    MAPPING_SYSTEM_PROMPT,
    build_mapping_user_prompt,
    extract_json_from_llm_response,
)

logger = logging.getLogger("shiftbase.ai_agent")


class LLMProvider(ABC):
    """Abstract interface for LLM backends."""

    @abstractmethod
    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        """Query the LLM provider and return raw text output."""
        pass


class GeminiProvider(LLMProvider):
    """Google Gemini AI API (Free Tier: 60 RPM)."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        if not self.api_key:
            raise ValueError("Gemini API key is not configured. Set GEMINI_API_KEY in .env")

        import google.generativeai as genai

        genai.configure(api_key=self.api_key)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_prompt,
            generation_config={"temperature": 0.1, "response_mime_type": "application/json"},
        )
        response = await model.generate_content_async(user_prompt)
        return response.text


class OllamaProvider(LLMProvider):
    """Local Ollama instance (100% offline, zero-cost)."""

    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama3"):
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "stream": False,
            "format": "json",
            "options": {"temperature": 0.1},
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["message"]["content"]


class FallbackRuleAgent:
    """
    Deterministic rule-based mapping engine used when LLM is unavailable or offline.
    Ensures 100% functional zero-cost operation without API keys.
    """

    def propose_heuristic_mappings(
        self,
        source_schema: Dict[str, Any],
        target_schema: Dict[str, Any],
    ) -> Dict[str, Any]:
        source_fields = {f["name"]: f for f in source_schema.get("fields", [])}
        target_fields = target_schema.get("fields", [])

        mappings: List[Dict[str, Any]] = []
        unmapped_targets: List[str] = []
        mapped_sources = set()
        warnings: List[str] = []

        for tf in target_fields:
            tname = tf["name"]
            ttype = tf["type"]

            # Exact match
            if tname in source_fields:
                sf = source_fields[tname]
                mapped_sources.add(tname)
                mappings.append({
                    "target_field": tname,
                    "source_field": tname,
                    "transformation": "direct_copy",
                    "transformation_params": {},
                    "confidence": 1.0,
                    "risk_notes": "Exact field name match",
                })
                continue

            # Common aliases
            alias_match = None
            if tname == "id" and "user_id" in source_fields:
                alias_match = ("user_id", "direct_copy", {})
            elif tname == "first_name" and "full_name" in source_fields:
                alias_match = ("full_name", "split_string", {"delimiter": " ", "index": 0})
            elif tname == "last_name" and "full_name" in source_fields:
                alias_match = ("full_name", "split_string", {"delimiter": " ", "index": 1})
            elif tname in ("created_at", "signup_timestamp") and "signup_date" in source_fields:
                alias_match = ("signup_date", "format_date", {"to_format": "%Y-%m-%dT%H:%M:%SZ"})
            elif tname == "email_address" and "email" in source_fields:
                alias_match = ("email", "direct_copy", {})
            elif tname == "status" and "account_status" in source_fields:
                alias_match = ("account_status", "direct_copy", {})
            elif tname in ("total_logins", "login_count") and "login_count" in source_fields:
                alias_match = ("login_count", "to_integer", {})
            elif tname in ("profile_summary", "short_bio") and "bio" in source_fields:
                alias_match = ("bio", "truncate", {"max_length": tf.get("max_length", 200)})

            if alias_match:
                s_name, rule, params = alias_match
                mapped_sources.add(s_name)
                mappings.append({
                    "target_field": tname,
                    "source_field": s_name,
                    "transformation": rule,
                    "transformation_params": params,
                    "confidence": 0.88,
                    "risk_notes": f"Matched by heuristic rule to '{s_name}'",
                })
            else:
                unmapped_targets.append(tname)
                warnings.append(f"Target field '{tname}' could not be matched automatically.")

        unmapped_sources = [name for name in source_fields if name not in mapped_sources]
        for us in unmapped_sources:
            warnings.append(f"Source field '{us}' will be dropped (no matching target).")

        return {
            "mappings": mappings,
            "unmapped_source_fields": unmapped_sources,
            "unmapped_target_fields": unmapped_targets,
            "warnings": warnings,
            "overall_risk": "medium" if unmapped_sources or unmapped_targets else "low",
        }


class AIAgent:
    """AI Data Architect coordinating LLM inference and parsing."""

    def __init__(self, provider: Optional[LLMProvider] = None):
        self.provider = provider
        self.fallback = FallbackRuleAgent()

    async def propose_migration_plan(
        self,
        plan_id: str,
        version: int,
        source_schema: SchemaDefinition,
        target_schema: SchemaDefinition,
        sample_records: Optional[List[Dict[str, Any]]] = None,
        supported_rules: Optional[List[str]] = None,
    ) -> PlanProposalResponse:
        """Generates structured migration proposal using AI or fallback."""
        src_dict = source_schema.model_dump()
        tgt_dict = target_schema.model_dump()

        user_prompt = build_mapping_user_prompt(
            source_schema=src_dict,
            target_schema=tgt_dict,
            sample_records=sample_records,
            supported_rules=supported_rules,
        )

        proposal_data: Optional[Dict[str, Any]] = None

        if self.provider is not None:
            try:
                logger.info("Requesting migration proposal from AI provider...")
                raw_response = await self.provider.generate_response(
                    system_prompt=MAPPING_SYSTEM_PROMPT,
                    user_prompt=user_prompt,
                )
                proposal_data = extract_json_from_llm_response(raw_response)
                logger.info("Successfully parsed AI response.")
            except Exception as e:
                logger.warning(f"AI Provider error ({e}). Falling back to heuristic rule engine.")

        if proposal_data is None:
            logger.info("Executing Fallback Rule Agent...")
            proposal_data = self.fallback.propose_heuristic_mappings(src_dict, tgt_dict)

        mappings_list = [
            FieldMapping(
                target_field=m["target_field"],
                source_field=m.get("source_field"),
                source_fields=m.get("source_fields"),
                transformation=m.get("transformation", "direct_copy"),
                transformation_params=m.get("transformation_params", {}),
                confidence=float(m.get("confidence", 0.9)),
                risk_notes=m.get("risk_notes"),
            )
            for m in proposal_data.get("mappings", [])
        ]

        return PlanProposalResponse(
            plan_id=plan_id,
            version=version,
            mappings=mappings_list,
            unmapped_source_fields=proposal_data.get("unmapped_source_fields", []),
            unmapped_target_fields=proposal_data.get("unmapped_target_fields", []),
            warnings=proposal_data.get("warnings", []),
            overall_risk=proposal_data.get("overall_risk", "medium"),
        )