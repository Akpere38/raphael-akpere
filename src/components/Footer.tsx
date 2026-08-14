import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background text-primary w-full py-16 border-t border-outline-variant mt-20">
      <div className="flex flex-col items-center justify-center space-y-6 max-w-container-max mx-auto px-margin-mobile">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-4">
          <a
            className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 flex items-center space-x-2"
            href="https://linkedin.com/in/raphael-akpere-0a4120287"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[20px]">link</span>
            <span className="font-label-caps text-xs tracking-widest uppercase">LinkedIn</span>
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 flex items-center space-x-2"
            href="https://github.com/Akpere38"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
            <span className="font-label-caps text-xs tracking-widest uppercase">GitHub</span>
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 flex items-center space-x-2"
            href="mailto:akpereraphael@gmail.com"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span className="font-label-caps text-xs tracking-widest uppercase">Email</span>
          </a>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 flex items-center space-x-2"
            href="https://akpereraphael.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[20px]">language</span>
            <span className="font-label-caps text-xs tracking-widest uppercase">Portfolio</span>
          </a>
        </div>
        <p className="text-on-surface-variant text-sm font-label-caps tracking-widest opacity-60">
          &copy; {new Date().getFullYear()} Raphael Akpere. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
