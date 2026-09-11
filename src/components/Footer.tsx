import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-14 border-t border-white/10 mt-20 bg-[#090A0F]">
      <div className="flex flex-col items-center justify-center space-y-6 max-w-[1180px] mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-code-sm text-xs">
          <a
            className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-2"
            href="https://linkedin.com/in/raphael-akpere-0a4120287"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[18px]">link</span>
            <span className="tracking-wider uppercase">LinkedIn</span>
          </a>
          <a
            className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-2"
            href="https://github.com/Akpere38"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            <span className="tracking-wider uppercase">GitHub</span>
          </a>
          <a
            className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-2"
            href="mailto:akpereraphael@gmail.com"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span className="tracking-wider uppercase">Email</span>
          </a>
          <a
            className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-2"
            href="https://akpereraphael.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            <span className="tracking-wider uppercase">Portfolio</span>
          </a>
        </div>

        <div className="text-center space-y-1">
          <p className="text-slate-400 text-xs font-code-sm tracking-wide">
            &copy; {new Date().getFullYear()} Raphael Akpere. All rights reserved.
          </p>
          <p className="text-slate-600 text-[11px] font-code-sm">
            Architected with modern data &amp; software engineering principles.
          </p>
        </div>
      </div>
    </footer>
  );
};

