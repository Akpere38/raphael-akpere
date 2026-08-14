import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    publishedCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
    experienceCount: 0,
    educationCount: 0,
    certificationsCount: 0,
    skillsCategoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verify auth
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          setLocation('/admin/login');
        }
      })
      .catch(() => setLocation('/admin/login'));

    // Fetch metrics across modules
    Promise.all([
      fetch('/api/admin/projects').then((res) => (res.ok ? res.json() : [])),
      fetch('/api/admin/messages').then((res) => (res.ok ? res.json() : [])),
      fetch('/api/admin/experience').then((res) => (res.ok ? res.json() : [])),
      fetch('/api/admin/education').then((res) => (res.ok ? res.json() : { education: [], certifications: [] })),
      fetch('/api/admin/skills').then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([projects, messages, exp, eduData, skills]) => {
        setStats({
          projectsCount: projects.length || 0,
          publishedCount: projects.filter((p: any) => p.published).length || 0,
          messagesCount: messages.length || 0,
          unreadMessagesCount: messages.filter((m: any) => m.status === 'NEW').length || 0,
          experienceCount: exp.length || 0,
          educationCount: (eduData.education || []).length,
          certificationsCount: (eduData.certifications || []).length,
          skillsCategoriesCount: skills.length || 0,
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
          <p className="text-sm text-on-surface-variant">Manage all sections of your portfolio from a unified dashboard.</p>
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
            <Link
              href="/admin/projects"
              className="inline-flex items-center text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer"
            >
              Manage projects <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>

          {/* Card 2: Work Experience */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#10B981] text-3xl">work</span>
              <span className="text-xs font-label-caps text-on-surface-variant uppercase">Work Experience</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{stats.experienceCount}</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Positions &amp; role history
              </p>
            </div>
            <Link
              href="/admin/experience"
              className="inline-flex items-center text-xs font-semibold text-[#10B981] hover:underline cursor-pointer"
            >
              Manage experience <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>

          {/* Card 3: Education & Certs */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#6366F1] text-3xl">school</span>
              <span className="text-xs font-label-caps text-on-surface-variant uppercase">Education &amp; Certs</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{stats.educationCount + stats.certificationsCount}</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {stats.educationCount} degrees, {stats.certificationsCount} certifications
              </p>
            </div>
            <Link
              href="/admin/education"
              className="inline-flex items-center text-xs font-semibold text-[#6366F1] hover:underline cursor-pointer"
            >
              Manage education <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>

          {/* Card 4: Technical Skills */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#F59E0B] text-3xl">monitoring</span>
              <span className="text-xs font-label-caps text-on-surface-variant uppercase">Technical Skills</span>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{stats.skillsCategoriesCount}</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Structured toolsets &amp; categories
              </p>
            </div>
            <Link
              href="/admin/skills"
              className="inline-flex items-center text-xs font-semibold text-[#F59E0B] hover:underline cursor-pointer"
            >
              Manage skills <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>

          {/* Card 5: Messages */}
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
            <Link
              href="/admin/messages"
              className="inline-flex items-center text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer"
            >
              View inquiries <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>

          {/* Card 6: CV Status */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <div className="flex justify-between items-center">
              <span className="material-symbols-outlined text-[#EC4899] text-3xl">file_present</span>
              <span className="text-xs font-label-caps text-on-surface-variant uppercase">CV Manager</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white truncate">Raphael-Akpere-CV</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Download &amp; update resume PDF
              </p>
            </div>
            <Link
              href="/admin/cv"
              className="inline-flex items-center text-xs font-semibold text-[#EC4899] hover:underline cursor-pointer"
            >
              CV management <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
