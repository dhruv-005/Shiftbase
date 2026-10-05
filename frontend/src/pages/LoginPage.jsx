import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8"
         style={{ background: 'linear-gradient(135deg, #ececeb 0%, #e0e0df 50%, #d8d8d6 100%)' }}>
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-copy hover:text-ink mb-6 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shiftbase
        </Link>

        {/* Login Card */}
        <div className="rounded-2xl p-6 sm:p-8 border border-white/50 shadow-card-spatial"
             style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px) saturate(180%)' }}>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ruby to-ruby-dark flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-ink">Welcome Back</h1>
              <p className="text-xs text-copy">Sign in to your Shiftbase workspace</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-copy mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-sm text-ink bg-white/80 focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby transition"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-copy mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-black/10 text-sm text-ink bg-white/80 focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby transition"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-2.5 text-copy/50 hover:text-ink transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-ink hover:bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 mt-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-copy text-center mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-ruby font-semibold hover:underline">Create one</Link>
          </p>
        </div>

        {/* Branding */}
        <p className="text-center text-[10px] font-mono text-copy/50 mt-6 uppercase tracking-widest">
          Shiftbase Precision Engine v1.0
        </p>
      </div>
    </div>
  );
}