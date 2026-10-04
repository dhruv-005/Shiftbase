import React from 'react';
import { ArrowRight, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import ConfidenceIndicator from './ConfidenceIndicator';
import StatusBadge from '../common/StatusBadge';

/**
 * PlanProposal Component
 * Displays the AI-generated schema migration proposal with confidence ratings,
 * field mapping cards, and data loss risks.
 */
export default function PlanProposal({
  proposal,
  planStatus = 'proposed',
  version = 1,
}) {
  if (!proposal) {
    return (
      <div className="glass-panel-elevated rounded-2xl p-8 text-center text-copy font-mono text-xs">
        No migration proposal generated yet.
      </div>
    );
  }

  const { mappings = [], unmapped_source_fields = [], unmapped_target_fields = [], overall_risk = 'medium' } = proposal;

  return (
    <div className="flex flex-col gap-6">
      {/* Proposal Summary Bar */}
      <div className="glass-panel-elevated rounded-2xl p-5 border border-white/50 shadow-card-spatial flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amethyst to-amethyst-dark flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
              AI Architecture Proposal
              <StatusBadge status={planStatus} />
            </h2>
            <p className="text-xs text-copy">
              Version {version} • {mappings.length} Fields Mapped
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-copy/60 block text-[10px] uppercase">Overall Risk</span>
            <span
              className={`font-semibold uppercase tracking-wider ${
                overall_risk === 'low'
                  ? 'text-emerald-700'
                  : overall_risk === 'high'
                  ? 'text-rose-700'
                  : 'text-amber-700'
              }`}
            >
              {overall_risk}
            </span>
          </div>
        </div>
      </div>

      {/* Mappings Table / Card Grid */}
      <div className="glass-panel-elevated rounded-2xl p-5 border border-white/50 shadow-card-spatial flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-black/5 text-xs font-mono text-copy uppercase tracking-wider">
          <span>Target Field</span>
          <span className="hidden sm:inline">Rule & Confidence</span>
          <span>Source Field</span>
        </div>

        <div className="divide-y divide-black/5">
          {mappings.map((m, idx) => (
            <div
              key={idx}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              {/* Target Destination */}
              <div className="flex items-center gap-2 min-w-[140px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-ink font-mono">{m.target_field}</span>
              </div>

              {/* Transformation & Confidence Badge */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/5 text-copy border border-black/5">
                  {m.transformation}
                </span>
                <ConfidenceIndicator confidence={m.confidence} />
              </div>

              {/* Source Origin */}
              <div className="flex items-center gap-2 min-w-[140px] justify-start sm:justify-end text-right">
                <span className="font-mono text-copy">
                  {m.source_field || (m.source_fields ? m.source_fields.join(' + ') : 'None')}
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </div>

              {/* Risk Notes (if any) */}
              {m.risk_notes && (
                <div className="w-full text-[11px] text-amber-800 bg-amber-500/10 px-3 py-1.5 rounded-lg font-mono mt-1">
                  ⚠️ {m.risk_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}