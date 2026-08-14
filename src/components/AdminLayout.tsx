import React from 'react';
import { Link, useLocation } from 'wouter';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setLocation('/admin/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navLinks = [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Projects', href: '/admin/projects', icon: 'code' },
    { label: 'CV Manager', href: '/admin/cv', icon: 'file_present' },
    { label: 'Messages', href: '/admin/messages', icon: 'mail' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-on-surface flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1E293B] border-r border-[#334155] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Title Area */}
          <div className="h-16 px-6 border-b border-[#334155] flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#3B82F6] text-[28px]">admin_panel_settings</span>
            <span className="text-white font-bold tracking-wide">Portfolio Admin</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-on-surface-variant hover:bg-[#0F172A] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area / Logout */}
        <div className="p-4 border-t border-[#334155] space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-2.5 text-xs text-on-surface-variant hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Back to Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-error hover:bg-red-950/20 rounded-lg transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Logout / Exit</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>

    </div>
  );
};
