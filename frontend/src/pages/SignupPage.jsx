import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPw) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const ok = await signup(username, email, password);
    setLoading(false);
    if (ok) navigate('/');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8"
         style={{ background: 'linear-gradient(135deg, #ececeb 0%, #e0e0df 50%, #d8d8d6 100%)' }}>
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-copy hover:text-ink mb-6 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shiftbase
        </Link>

        {/* Signup Card */}
        <div className="rounded-2xl p-6 sm:p-8 border border-white/50 shadow-card-spatial"
             style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px) saturate(180%)' }}>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amethyst to-amethyst-dark flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-ink">Create Account</h1>
              <p className="text-xs text-copy">Join Shiftbase migration workspace</p>
            </div>
          </div>

          {/* Error */}
          {displayError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-800">
              {displayError}
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
                minLength={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-sm text-ink bg-white/80 focus:outline-none focus:ring-2 focus:ring-amethyst/30 focus:border-amethyst transition"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-copy mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-sm text-ink bg-white/80 focus:outline-none focus:ring-2 focus:ring-amethyst/30 focus:border-amethyst transition"
                placeholder="your@email.com"
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
                  minLength={6}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-black/10 text-sm text-ink bg-white/80 focus:outline-none focus:ring-2 focus:ring-amethyst/30 focus:border-amethyst transition"
                  placeholder="Min 6 characters"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-2.5 text-copy/50 hover:text-ink transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-copy mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-sm text-ink bg-white/80 focus:outline-none focus:ring-2 focus:ring-amethyst/30 focus:border-amethyst transition"
                placeholder="Re-enter password"
              />
              {confirmPw && password === confirmPw && (
                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Passwords match
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-ink hover:bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-copy text-center mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-ruby font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-[10px] font-mono text-copy/50 mt-6 uppercase tracking-widest">
          Shiftbase Precision Engine v1.0
        </p>
      </div>
    </div>
  );
}