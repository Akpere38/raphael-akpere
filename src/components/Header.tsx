import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education & Certifications', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="bg-background text-primary fixed top-0 w-full z-50 border-b border-outline-variant">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[28px]">terminal</span>
            <span className="text-body-md font-label-caps tracking-widest text-primary font-semibold">Raphael Akpere</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors text-[14px] font-medium"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-primary-container text-primary text-[14px] font-semibold rounded-lg hover:bg-surface-container transition-all duration-200 border border-outline-variant active:scale-95 transition-transform"
            href="#projects"
          >
            View My Work
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-on-surface p-2 hover:bg-surface-container transition-all duration-200 rounded-lg"
            onClick={toggleDrawer}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`bg-surface-container text-primary h-full w-64 rounded-r-xl shadow-xl fixed inset-y-0 left-0 z-[60] flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <span className="font-headline-lg text-headline-lg text-primary">Menu</span>
          <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={toggleDrawer} aria-label="Close menu">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col mt-4 space-y-2 px-2 flex-grow overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="text-on-surface-variant hover:bg-surface-variant rounded-lg mx-2 my-1 px-4 py-3 flex items-center space-x-3 transition-colors tap-highlight-transparent"
              href={link.href}
              onClick={() => setIsDrawerOpen(false)}
            >
              <span className="material-symbols-outlined">
                {link.href === '#home' && 'home'}
                {link.href === '#about' && 'person'}
                {link.href === '#skills' && 'monitoring'}
                {link.href === '#experience' && 'work'}
                {link.href === '#projects' && 'code'}
                {link.href === '#education' && 'school'}
                {link.href === '#contact' && 'mail'}
              </span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] md:hidden transition-opacity duration-300"
          onClick={toggleDrawer}
        />
      )}
    </>
  );
};
