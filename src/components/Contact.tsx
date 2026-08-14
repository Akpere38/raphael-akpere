import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      setSuccess('Thank you! Your message has been successfully sent.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative flex flex-col justify-center items-center py-16 px-6 rounded-2xl overflow-hidden border border-outline-variant bg-[#1E293B]"
      id="contact"
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl space-y-8">
        
        {/* Title Area */}
        <div className="text-center space-y-3">
          <h2 className="font-headline-lg text-3xl font-bold text-white">
            Have a problem that needs data or technology?
          </h2>
          <p className="text-[#3B82F6] text-xl font-semibold">Let's build a practical solution.</p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="w-full p-4 bg-red-950/30 border border-red-500/50 rounded-lg text-sm text-red-200 flex items-center space-x-2">
            <span className="material-symbols-outlined text-red-500">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-lg text-sm text-emerald-200 flex items-center space-x-2">
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            <span>{success}</span>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none transition-colors"
              placeholder="Inquiry about data analysis / dashboard design"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none resize-none transition-colors"
              placeholder="Hi Raphael, I have a dataset that needs cleaning and a dashboard to build..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="flex gap-4 self-start sm:self-auto">
              <a
                className="inline-flex justify-center items-center px-4 py-2 bg-transparent border border-[#334155] text-white font-semibold rounded-lg hover:bg-[#0F172A] hover:border-[#475569] transition-colors"
                href="/api/cv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined mr-2">visibility</span>
                View CV
              </a>
              <a
                className="inline-flex justify-center items-center px-4 py-2 bg-transparent border border-[#334155] text-white font-semibold rounded-lg hover:bg-[#0F172A] hover:border-[#475569] transition-colors"
                href="/api/cv?download=true"
              >
                <span className="material-symbols-outlined mr-2">download</span>
                Download CV
              </a>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center items-center px-8 py-3 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed glow-effect active:scale-98 transition-transform"
            >
              {submitting ? 'Sending Message...' : 'Send Message'}
            </button>
          </div>

        </form>

        {/* Contact Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 w-full max-w-lg border-t border-[#334155]">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Email</span>
            <a
              href="mailto:akpereraphael@gmail.com"
              className="text-sm font-semibold text-white hover:text-[#3B82F6] transition-colors"
            >
              akpereraphael@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">LinkedIn</span>
            <a
              href="https://linkedin.com/in/raphael-akpere-0a4120287"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white hover:text-[#3B82F6] transition-colors"
            >
              linkedin.com/in/akpere
            </a>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">GitHub</span>
            <a
              href="https://github.com/Akpere38"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white hover:text-[#3B82F6] transition-colors"
            >
              github.com/Akpere38
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
