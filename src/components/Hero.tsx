import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      className="relative min-h-[80vh] flex flex-col justify-center items-center text-center py-20 rounded-2xl overflow-hidden border border-outline-variant bg-[#1E293B] mt-6"
      id="home"
    >
      {/* Abstract Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center max-w-3xl px-4 space-y-8 animate-fade-in">
        <div className="relative group mb-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <img
            alt="Raphael Akpere, Data Analyst and Software Developer"
            className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-[#334155] object-cover object-top shadow-xl"
            src="/raphael-akpere-profile.png"
          />
        </div>
        <h1 className="font-display text-4xl md:text-[56px] text-white leading-tight font-bold">
          Data, Software &amp; <br />
          <span className="text-[#3B82F6]">Digital Solutions</span>
        </h1>
        <p className="font-body-md text-on-surface-variant max-w-2xl text-lg">
          Turning data, business requirements and technology into practical digital solutions.
        </p>
        
        {/* Core skills keywords */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <span className="font-code-sm text-sm px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]">
            Data Analytics
          </span>
          <span className="font-code-sm text-sm px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]">
            Python
          </span>
          <span className="font-code-sm text-sm px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]">
            SQL
          </span>
          <span className="font-code-sm text-sm px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]">
            Business Intelligence
          </span>
          <span className="font-code-sm text-sm px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]">
            Software Development
          </span>
        </div>

        {/* Call to actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <a
            className="inline-flex justify-center items-center px-8 py-3 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto glow-effect active:scale-98 transition-transform"
            href="#projects"
          >
            Explore My Work
          </a>
          <a
            className="inline-flex justify-center items-center px-8 py-3 bg-transparent border border-[#334155] text-white font-semibold rounded-lg hover:bg-[#1E293B] hover:border-[#475569] transition-colors w-full sm:w-auto active:scale-98 transition-transform"
            href="/api/cv"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined mr-2">visibility</span>
            View CV
          </a>
          <a
            className="inline-flex justify-center items-center px-8 py-3 bg-transparent border border-[#334155] text-white font-semibold rounded-lg hover:bg-[#1E293B] hover:border-[#475569] transition-colors w-full sm:w-auto active:scale-98 transition-transform"
            href="/api/cv?download=true"
          >
            <span className="material-symbols-outlined mr-2">download</span>
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
};
