import React from 'react';

export const Hero: React.FC = () => {
  const stackChips = [
    { label: 'Python', icon: 'code' },
    { label: 'Django', icon: 'layers' },
    { label: 'React', icon: 'web' },
    { label: 'TypeScript', icon: 'code' },
    { label: 'PostgreSQL', icon: 'storage' },
    { label: 'SQL', icon: 'database' },
    { label: 'FastAPI', icon: 'api' },
    { label: 'REST APIs', icon: 'integration_instructions' },
    { label: 'Tailwind CSS', icon: 'palette' },
  ];

  return (
    <section
      className="relative min-h-[85vh] flex flex-col justify-center items-center text-center py-16 md:py-24 rounded-3xl overflow-hidden border border-white/10 bg-[#0F172A]/40 backdrop-blur-xl mt-6 cyber-grid"
      id="home"
    >
      {/* Ambient background glow mesh */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[350px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-4 md:px-6 space-y-8 animate-fade-in">
        
        {/* Available for Work Status Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#0F172A]/80 border border-emerald-500/30 text-emerald-400 text-xs font-code-sm shadow-lg shadow-emerald-950/40">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium tracking-wide">Software Engineer &amp; Data Solutions Developer</span>
        </div>

        {/* Profile Headshot Card with Neon Rim Lighting */}
        <div className="relative group my-2">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative p-1 rounded-3xl bg-[#090A0F] border border-white/15">
            <img
              alt="Raphael Akpere — Software Engineer & Data Solutions Developer"
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover object-top shadow-2xl"
              src="/assets/stitch/raphael-portrait.png"
              onError={(e) => {
                // Fallback to original image if portrait file has issue
                (e.target as HTMLImageElement).src = '/raphael-akpere-profile.png';
              }}
            />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-tight leading-[1.15]">
            Software Engineering &amp; <br />
            <span className="gradient-text-cyan-blue">Data Solutions</span>
          </h1>
          <p className="font-body-md text-slate-300 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-normal leading-relaxed">
            Building robust full-stack web platforms, scalable backend architectures (Python, Django, FastAPI), relational databases (PostgreSQL, SQL), and intelligent data solutions engineered for performance and reliability.
          </p>
        </div>

        {/* Live Tech Stack Monospace Ticker */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl pt-2">
          {stackChips.map((tech) => (
            <span
              key={tech.label}
              className="font-code-sm text-xs px-3.5 py-1.5 bg-[#0F172A]/80 border border-white/10 rounded-lg text-slate-300 font-medium hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-[#1E293B] transition-all duration-200"
            >
              {tech.label}
            </span>
          ))}
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          <a
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:to-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/25 glow-effect active:scale-95 transition-all"
            href="#projects"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">rocket_launch</span>
            Explore My Work
          </a>
          <a
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3.5 bg-[#0F172A]/80 hover:bg-[#1E293B] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white font-semibold text-sm rounded-xl transition-all active:scale-95"
            href="/api/cv"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[18px] mr-2 text-cyan-400">visibility</span>
            View CV
          </a>
          <a
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3.5 bg-[#0F172A]/80 hover:bg-[#1E293B] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white font-semibold text-sm rounded-xl transition-all active:scale-95"
            href="/api/cv?download=true"
          >
            <span className="material-symbols-outlined text-[18px] mr-2 text-emerald-400">download</span>
            Download CV
          </a>
        </div>

      </div>
    </section>
  );
};

