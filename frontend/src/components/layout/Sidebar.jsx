import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layers, Sparkles, History, ShieldCheck, ChevronRight, Database, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navItems = [
    { to: '/', label: 'Hero Stage', icon: Sparkles, exact: true },
    { to: '/setup', label: 'Schema Setup', icon: Layers },
    { to: '/audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" aria-hidden="true" />
      )}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="glass-panel-elevated rounded-2xl p-4 flex flex-col gap-6 shadow-card-spatial border border-white/40 backdrop-blur-xl">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ruby to-ruby-dark flex items-center justify-center text-white font-bold shadow-sm">S</div>
              <div>
                <div className="font-semibold text-ink text-sm tracking-tight flex items-center gap-1.5">
                  Shiftbase
                  <span className="w-1.5 h-1.5 rounded-full bg-ruby animate-pulse" />
                </div>
                <div className="text-[10px] text-copy font-mono uppercase tracking-wider">Precision Engine</div>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-black/5 text-copy" aria-label="Close menu">
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive ? 'bg-ink text-white shadow-sm' : 'text-copy hover:text-ink hover:bg-white/60'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-ruby-light' : 'text-copy'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </NavLink>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-black/5 flex flex-col gap-2">
            <div className="text-[10px] uppercase font-mono text-copy/70 px-2 tracking-wider">Pipeline State</div>
            <div className="flex flex-col gap-1.5 text-xs text-copy px-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Database className="w-3 h-3 text-copy/60" /> SQLite WAL</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-copy/60" /> Guard Gate</span>
                <span className="text-[10px] text-ruby bg-ruby/10 px-1.5 py-0.5 rounded font-mono">BOUNDED</span>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-panel-elevated rounded-2xl p-3 text-[11px] text-copy/80 flex items-center justify-between border border-white/40 shadow-sm mt-3">
          <span>Engine v1.0.0</span>
          <span className="font-mono text-[10px] text-ink/70">100% Free Tier</span>
        </div>
      </aside>
    </>
  );
}
