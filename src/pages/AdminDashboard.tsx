import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    publishedCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Basic verification of authentication on mount
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          setLocation('/admin/login');
        }
      })
      .catch(() => setLocation('/admin/login'));

    // Fetch projects and messages to compute stats
    Promise.all([
      fetch('/api/admin/projects').then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      fetch('/api/admin/messages').then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
    ])
      .then(([projects, messages]) => {
        setStats({
          projectsCount: projects.length,
          publishedCount: projects.filter((p: any) => p.published).length,
          messagesCount: messages.length,
          unreadMessagesCount: messages.filter((m: any) => m.status === 'NEW').length,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [setLocation]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3B82F6]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-display">Welcome Back, Raphael</h1>
          <p className="text-sm text-on-surface-variant">Here is a quick overview of your portfolio metrics and content.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Projects */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#3B82F6] text-3xl">code</span>
              <span className="text-xs font-label-caps text-on-surface-variant uppercase">Projects</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{stats.projectsCount}</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {stats.publishedCount} active / published online
              </p>
            </div>
            <Link href="/admin/projects">
              <a className="inline-flex items-center text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer">
                Manage projects <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
              </a>
            </Link>
          </div>

          {/* Card 2: Messages */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <div className="flex justify-between items-center">
              <span className={`material-symbols-outlined text-3xl ${stats.unreadMessagesCount > 0 ? 'text-[#10B981] animate-pulse' : 'text-[#94A3B8]'}`}>
                mail
              </span>
              <span className="text-xs font-label-caps text-on-surface-variant uppercase">Messages</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{stats.messagesCount}</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {stats.unreadMessagesCount} unread message inquiries
              </p>
            </div>
            <Link href="/admin/messages">
              <a className="inline-flex items-center text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer">
                View inquiries <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
              </a>
            </Link>
          </div>

          {/* Card 3: CV Status */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#6366F1] text-3xl">file_present</span>
              <span className="text-xs font-label-caps text-on-surface-variant uppercase">CV Status</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white truncate">Raphael-Akpere-CV</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Managed from CV Manager
              </p>
            </div>
            <Link href="/admin/cv">
              <a className="inline-flex items-center text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer">
                CV management <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
              </a>
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
