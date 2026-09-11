import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isDrawerOpen]);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090A0F]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/50'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="flex justify-between items-center px-4 md:px-8 max-w-[1180px] mx-auto">
          {/* Logo & Identity */}
          <a href="#home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-all duration-300 shadow-md">
              <img
                src="/assets/stitch/terminal-logo.svg"
                alt="Terminal Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to text icon if SVG error
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-cyan-400 text-xl hidden">terminal</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-headline-lg font-bold text-white tracking-wide text-base group-hover:text-cyan-400 transition-colors">
                  Raphael Akpere
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Available for work"></span>
              </div>
              <p className="font-code-sm text-[11px] text-slate-400 tracking-wider uppercase">
                Data Analyst × Dev
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 px-4 py-1.5 rounded-full bg-[#0F172A]/70 backdrop-blur-md border border-white/10 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="text-slate-300 hover:text-white hover:bg-white/5 px-3.5 py-1.5 rounded-full transition-all text-xs font-medium tracking-wide"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              className="inline-flex items-center justify-center px-4 py-2 bg-transparent text-slate-300 hover:text-white text-xs font-semibold rounded-lg hover:bg-white/5 border border-white/10 transition-all active:scale-95"
              href="/api/cv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[16px] mr-1.5 text-cyan-400">visibility</span>
              View CV
            </a>
            <a
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-500/20 glow-effect transition-all active:scale-95"
              href="#contact"
            >
              Let's Connect
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-300 p-2 hover:bg-white/5 border border-white/10 transition-all rounded-lg"
            onClick={toggleDrawer}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`bg-[#0F172A]/95 backdrop-blur-2xl text-white h-full w-72 border-r border-white/10 shadow-2xl fixed inset-y-0 left-0 z-[60] flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-lg">terminal</span>
            </div>
            <span className="font-headline-lg font-bold text-white text-sm">Navigation</span>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors" onClick={toggleDrawer} aria-label="Close menu">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <nav className="flex flex-col mt-4 space-y-1 px-3 flex-grow overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="text-slate-300 hover:text-white hover:bg-white/5 rounded-lg px-4 py-3 flex items-center space-x-3 text-sm font-medium transition-colors"
              href={link.href}
              onClick={() => setIsDrawerOpen(false)}
            >
              <span className="material-symbols-outlined text-cyan-400 text-lg">
                {link.href === '#about' && 'person'}
                {link.href === '#skills' && 'monitoring'}
                {link.href === '#projects' && 'code'}
                {link.href === '#experience' && 'work'}
                {link.href === '#education' && 'school'}
                {link.href === '#contact' && 'mail'}
              </span>
              <span>{link.label}</span>
            </a>
          ))}
          <div className="pt-6 mt-6 border-t border-white/10 space-y-3 px-1">
            <a
              href="/api/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-slate-800 border border-white/10 text-xs font-semibold text-white"
            >
              <span className="material-symbols-outlined text-sm mr-2 text-cyan-400">visibility</span>
              View CV
            </a>
            <a
              href="#contact"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white"
            >
              Let's Connect
            </a>
          </div>
        </nav>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300"
          onClick={toggleDrawer}
        />
      )}
    </>
  );
};

