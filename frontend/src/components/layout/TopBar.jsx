import React, { useEffect, useState } from 'react';
import { Menu, Cpu } from 'lucide-react';
import axios from 'axios';

export default function TopBar({ onToggleSidebar }) {
  const [healthy, setHealthy] = useState(false);
  const [aiProvider, setAiProvider] = useState('gemini');

  useEffect(() => {
    async function checkHealth() {
      try {
        const resp = await axios.get('/api/health');
        if (resp.data.status === 'healthy') {
          setHealthy(true);
          setAiProvider(resp.data.ai_provider || 'gemini');
        }
      } catch {
        setHealthy(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-20 w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between max-w-[var(--content-max)] mx-auto">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          type="button"
          className="lg:hidden p-2 rounded-xl bg-white/75 hover:bg-white border border-white/50 text-ink shadow-sm transition active:scale-95"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-copy">Shiftbase</span>
          <span className="text-xs text-ink/30">/</span>
          <span className="text-[10px] sm:text-xs font-semibold text-ink truncate max-w-[150px] sm:max-w-none">
            Migration Stage
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="glass-panel-elevated px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] sm:text-xs border border-white/60 shadow-sm">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${healthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-copy font-medium font-mono text-[10px] sm:text-[11px]">
            {healthy ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="hidden sm:flex glass-panel-elevated px-2.5 py-1 rounded-full items-center gap-1 text-[10px] sm:text-[11px] font-mono text-copy border border-white/60 shadow-sm">
          <Cpu className="w-3 h-3 text-ruby" />
          <span className="uppercase">{aiProvider}</span>
        </div>
      </div>
    </header>
  );
}
