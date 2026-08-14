import React, { useState } from 'react';
import { useLocation } from 'wouter';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setLocation('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-outline-variant bg-[#1E293B] space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F172A] border border-[#334155] text-[#3B82F6] mb-2">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Secure Administrator Access</h1>
          <p className="text-xs text-on-surface-variant">Please authenticate to manage portfolio content</p>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="p-3 bg-red-950/30 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center space-x-2">
            <span className="material-symbols-outlined text-red-500 text-lg">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              placeholder="akpereraphael@gmail.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex justify-center items-center px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-effect"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
};
