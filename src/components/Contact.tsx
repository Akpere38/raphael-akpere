import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('akpereraphael@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess('Thank you! Your message has been sent successfully. I will get back to you shortly.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to deliver message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative flex flex-col justify-center items-center py-16 px-6 sm:px-10 rounded-3xl overflow-hidden border border-white/10 bg-[#0F172A]/50 backdrop-blur-2xl cyber-grid"
      id="contact"
    >
      {/* Background radial glow accents */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl space-y-8">
        
        {/* Title Area */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-code-sm uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Initiate Collaboration</span>
          </div>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Have a problem that needs data or technology?
          </h2>
          <p className="gradient-text-cyan-blue text-lg sm:text-xl font-semibold">
            Let's engineer a practical, scalable solution.
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="w-full p-4 bg-red-950/40 border border-red-500/50 rounded-2xl text-sm text-red-200 flex items-center space-x-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-sm text-emerald-200 flex items-center space-x-3">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span>{success}</span>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-code-sm text-slate-300 tracking-wider uppercase">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#090A0F]/80 border border-white/10 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-600"
                placeholder="e.g. Alex Morgan"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-code-sm text-slate-300 tracking-wider uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#090A0F]/80 border border-white/10 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-600"
                placeholder="alex@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-code-sm text-slate-300 tracking-wider uppercase">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-[#090A0F]/80 border border-white/10 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-600"
              placeholder="Inquiry regarding data pipeline / dashboard architecture"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-code-sm text-slate-300 tracking-wider uppercase">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-[#090A0F]/80 border border-white/10 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 resize-none transition-all placeholder:text-slate-600"
              placeholder="Hi Raphael, I have a dataset that needs cleaning, predictive analysis, and an executive dashboard..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="flex gap-3 self-start sm:self-auto">
              <a
                className="inline-flex items-center px-4 py-2.5 bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                href="/api/cv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-sm mr-1.5 text-cyan-400">visibility</span>
                View CV
              </a>
              <a
                className="inline-flex items-center px-4 py-2.5 bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                href="/api/cv?download=true"
              >
                <span className="material-symbols-outlined text-sm mr-1.5 text-emerald-400">download</span>
                Download CV
              </a>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 glow-effect active:scale-95 transition-all"
            >
              {submitting ? 'Sending Message...' : 'Send Inquiry'}
            </button>
          </div>
        </form>

        {/* Quick Contact & Social Handles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 w-full border-t border-white/10 font-code-sm">
          <div className="p-4 rounded-2xl bg-[#090A0F]/60 border border-white/5 flex flex-col items-center text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase">Direct Email</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
              title="Click to copy"
            >
              <span>akpereraphael@gmail.com</span>
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#090A0F]/60 border border-white/5 flex flex-col items-center text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase">Professional Network</span>
            <a
              href="https://linkedin.com/in/raphael-akpere-0a4120287"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-200 hover:text-cyan-400 transition-colors flex items-center space-x-1"
            >
              <span>linkedin.com/in/akpere</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#090A0F]/60 border border-white/5 flex flex-col items-center text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase">Open Source</span>
            <a
              href="https://github.com/Akpere38"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-200 hover:text-cyan-400 transition-colors flex items-center space-x-1"
            >
              <span>github.com/Akpere38</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

