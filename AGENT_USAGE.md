# AGENT_USAGE.md — AI Agent Development Log

## 1. Tools Used

| Tool | Purpose | Usage |
|------|---------|-------|
| **Google Gemini 1.5 Flash** | Primary AI mapping engine | Schema field matching, transformation proposals, risk assessment |
| **Custom Heuristic Engine** | Fallback AI (4-pass matching) | Exact -> Alias -> Fuzzy -> Type-compatible field matching |
| **Cursor / VS Code** | Code generation & editing | Full-stack development, debugging, refactoring |
| **GitHub Copilot** | Inline code suggestions | Autocomplete for React components, Python services |
| **Vercel AI** | Deployment configuration | Vercel SPA rewrites, environment setup |

---

## 2. Representative Prompts

### Prompt 1: Schema Mapping Proposal
You are a data migration architect. Given a source schema with fields
[user_id, full_name, signup_date, email] and a target schema with fields
[id, first_name, last_name, created_at, email_address], propose field
mappings with transformation rules from this authorized list ONLY:
[direct_copy, split_string, format_date, to_integer, truncate].
Return structured JSON with confidence scores and risk notes.

### Prompt 2: Error Handling Architecture
Design a quarantine system for a schema migration pipeline where:

Records with failed type casts are isolated
Missing required fields trigger validation errors
Each quarantined record stores the original source data and per-field errors
The system must maintain count integrity: source == target + quarantine

### Prompt 3: Frontend Component Generation

### Prompt 3: Frontend Component Generation
Create a React component for a spatial glass-morphism card with:

Ruby gradient background (#bd4468 to #8c1320)
SVG radar gauge with animated sweep
LED-dot typography for metric numbers
Responsive scaling using CSS container queries (--u units)
Hover elevation micro-interaction

---

## 3. Delegated Work

### What the AI Agent Built:
1. **Complete backend service layer** — FastAPI routes, Pydantic models, repository pattern
2. **Transformation engine** — 12 deterministic transformation functions with edge case handling
3. **React component library** — 30+ components including glass panels, SVG gauges, LED-dot text
4. **CSS design system** — 600+ lines of responsive CSS with Tailwind integration
5. **Test suite** — 9 comprehensive tests covering all migration scenarios
6. **Deployment configuration** — Docker, Render, Vercel configs

### What the AI Agent Did NOT Build (Human-Authored):
1. **Core architecture decisions** — Bounded AI constraint, human approval gate, quarantine model
2. **Security model** — Cookie sessions, CORS policies, approval workflow
3. **Business logic constraints** — 12-rule transformation sandbox, deduplication guards
4. **Theme specification** — "Built for Intelligent Performance" design system parameters

---

## 4. Important Agent Mistakes & Rejected Suggestions

### Mistake 1: Unbounded AI Execution
- **Agent suggested:** Letting the LLM generate and execute arbitrary SQL transformations
- **Why rejected:** Violates the core "bounded execution" constraint. AI must only PROPOSE, never EXECUTE
- **Fix applied:** AI output is parsed into structured JSON, validated against 12 allowed rules, then executed by deterministic Python functions

### Mistake 2: Wildcard CORS with Credentials
- **Agent suggested:** `allow_origins=["*"]` with `allow_credentials=True`
- **Why rejected:** Browsers reject `Access-Control-Allow-Origin: *` when `withCredentials: true`
- **Fix applied:** Used `allow_origin_regex=r"https://.*\.vercel\.app"` for dynamic origin matching

### Mistake 3: Missing max_length Detection
- **Agent suggested:** Using `direct_copy` for all string-to-string mappings
- **Why rejected:** Target fields with `max_length` constraints (e.g., `bio_summary: 80 chars`) would fail validation on long source values
- **Fix applied:** Added `_apply_max_length_check()` that auto-switches to `truncate` when target has `max_length`

### Mistake 4: Tailwind CDN in Production
- **Agent suggested:** Using `<script src="https://cdn.tailwindcss.com">` for styling
- **Why rejected:** Tailwind CDN is development-only and shows console warnings in production
- **Fix applied:** Configured proper PostCSS + Tailwind build pipeline via Vite

### Mistake 5: Hardcoded Port Binding
- **Agent suggested:** `uvicorn main:app --port 8000` for Render deployment
- **Why rejected:** Render assigns dynamic ports via `$PORT` environment variable
- **Fix applied:** Changed to `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 5. Output Verification Methods

### Automated Verification:
1. **Pytest test suite:** `pytest tests/test_all_scenarios.py -v -s` -> 9/9 passed
2. **Vite production build:** `npm run build` -> 0 errors, 1694 modules transformed
3. **API health check:** `GET /api/health` -> `{"status": "healthy"}`
4. **Swagger UI validation:** All 22 endpoints documented and testable at `/docs`

### Manual Verification:
1. **End-to-end workflow:** Signup -> Setup -> Propose -> Approve -> Dry-Run -> Execute -> Quarantine -> Rollback -> Audit
2. **Cross-browser testing:** Chrome, Firefox, Edge on desktop and mobile
3. **Responsive testing:** iPhone SE (375px), iPad (768px), Laptop (1366px), Desktop (1920px)
4. **Scenario testing:** Best, Medium, Worst, Failure, and Complex stress cases
5. **Security testing:** Unapproved execution blocked (403), duplicate execution blocked (403/409)

### AI Output Verification:
1. Every AI-generated mapping is displayed to the human with confidence scores
2. Human can edit any mapping in the Interactive Editor before approval
3. AI warnings and risk assessments are shown in the Warnings Panel
4. Fallback heuristic engine produces identical structure to Gemini output
5. All transformation parameters are validated against the 12-rule sandbox before execution
