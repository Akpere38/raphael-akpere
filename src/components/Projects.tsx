import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface Project {
  id: number;
  title: string;
  slug: string;
  technologies: string[];
  description: string;
  github_url?: string;
  demo_url?: string;
  metric?: string;
  featured?: boolean;
  published?: boolean;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 2,
    title: 'Customer Behavior & Transaction Analysis',
    slug: 'customer-behavior-transaction-analysis',
    description: 'Analyzed 100K+ transaction records to identify customer behavior, purchasing patterns, and operational trends with actionable segmentation.',
    technologies: ['Python', 'SQL', 'Excel', 'Data Visualization', 'Pandas'],
    github_url: 'https://github.com/Akpere38',
    metric: '100K+ Records Analyzed',
    featured: true,
    published: true,
  },
  {
    id: 1,
    title: 'Automated Workflow & KPI Tracking Dashboard',
    slug: 'automated-workflow-kpi-tracking-dashboard',
    description: 'Built an end-to-end tracking system for project progress, delivery deadlines, workload distribution, and operational performance.',
    technologies: ['Power BI', 'Python', 'Automated Pipelines'],
    github_url: 'https://github.com/Akpere38',
    metric: 'Real-time KPI Engine',
    featured: true,
    published: true,
  },
  {
    id: 3,
    title: 'Healthcare Appointment Analysis System',
    slug: 'healthcare-appointment-analysis-system',
    description: 'Analyzed 1,000+ appointment records and developed predictive modeling focused on appointment no-show patterns and scheduling optimization.',
    technologies: ['Python', 'Statistical Analysis', 'Predictive Modeling'],
    github_url: 'https://github.com/Akpere38',
    metric: '1,000+ Patient Cohorts',
    featured: true,
    published: true,
  },
  {
    id: 4,
    title: 'Business Risk & Performance Monitoring Dashboard',
    slug: 'business-risk-performance-monitoring-dashboard',
    description: 'Designed an interactive intelligence dashboard for monitoring operational KPIs and proactively identifying emerging business risks.',
    technologies: ['Power BI', 'Risk Analytics', 'KPI Monitoring'],
    github_url: 'https://github.com/Akpere38',
    metric: 'Executive Risk Matrix',
    featured: true,
    published: true,
  },
  {
    id: 5,
    title: 'Data Quality & Compliance Initiative',
    slug: 'data-quality-compliance-initiative',
    description: 'Implemented data validation and automated consistency rules ensuring high integrity reporting across business workflows.',
    technologies: ['Data Quality', 'Validation Pipelines', 'Reporting'],
    github_url: 'https://github.com/Akpere38',
    metric: 'Zero-Error Pipelines',
    featured: true,
    published: true,
  },
];

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Filter to featured projects for the Bento Grid layout, capping at 5
          const featuredList = data.filter((p) => p.featured);
          const activeList = featuredList.length >= 3 ? featuredList : data;
          const merged = activeList.slice(0, 5).map((p) => {
            const match = DEFAULT_PROJECTS.find((d) => d.slug === p.slug || d.title === p.title);
            return {
              ...p,
              metric: match?.metric || 'Production Project',
              github_url: p.github_url || match?.github_url,
            };
          });
          setProjects(merged);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_PROJECTS
      });
  }, []);

  const card1 = projects[0] || DEFAULT_PROJECTS[0];
  const card2 = projects[1] || DEFAULT_PROJECTS[1];
  const card3 = projects[2] || DEFAULT_PROJECTS[2];
  const card4 = projects[3] || DEFAULT_PROJECTS[3];
  const card5 = projects[4] || DEFAULT_PROJECTS[4];

  return (
    <section className="space-y-10" id="projects">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-code-sm uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Featured Systems &amp; Engineering</span>
          </div>
          <h2 className="font-headline-lg text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Flagship Projects &amp; Data Solutions
          </h2>
          <p className="text-slate-400 leading-relaxed text-base">
            A curated selection of production applications, distributed backend services, data pipelines, and full-stack software built for performance and reliability.
          </p>
        </div>
        
        {/* Actions: View All Catalog & GitHub Links */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-cyan-500/20 border border-cyan-500/40 text-xs font-code-sm font-semibold text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/30 transition-all glow-effect shadow-md"
          >
            <span>View All Projects</span>
            <span className="material-symbols-outlined text-[16px] text-cyan-400">arrow_forward</span>
          </Link>
          <a
            href="https://github.com/Akpere38"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-code-sm text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-cyan-400">code</span>
            <span>GitHub (@Akpere38)</span>
          </a>
        </div>
      </div>

      {/* 12-Column Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BENTO CARD 1: Span 7 Cols (Flagship Analytics) */}
        <div className="lg:col-span-7 group relative p-7 sm:p-8 rounded-3xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-950/40">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-code-sm text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold tracking-wide">
                ★ Flagship Analytics
              </span>
              <span className="font-code-sm text-xs px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-emerald-400 font-bold">
                {card1.metric || '100K+ Records Analyzed'}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {card1.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {card1.description}
              </p>
            </div>

            {/* Visual Metric Simulation / Mini Bar Matrix */}
            <div className="p-4 rounded-2xl bg-[#090A0F]/80 border border-white/5 space-y-2 font-code-sm text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Data Processed</span>
                <span className="text-cyan-400 font-semibold">100,000+ Transactions</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-full rounded-full"></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Accuracy: 99.8%</span>
                <span>Clustering: Behavioral Cohorts</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {card1.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-code-sm text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            <Link
              href={`/projects/${card1.slug}`}
              className="inline-flex items-center text-xs text-cyan-400 font-semibold group-hover:text-cyan-300 hover:underline"
            >
              <span>Explore Case Study</span>
              <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            {card1.github_url && (
              <a
                href={card1.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
                title="View Source on GitHub"
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
              </a>
            )}
          </div>
        </div>

        {/* BENTO CARD 2: Span 5 Cols (Flagship BI) */}
        <div className="lg:col-span-5 group relative p-7 sm:p-8 rounded-3xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-950/40">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-code-sm text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold tracking-wide">
                ★ Executive BI
              </span>
              <span className="font-code-sm text-xs px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-cyan-400 font-bold">
                {card2.metric || 'Real-time KPI Engine'}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                {card2.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {card2.description}
              </p>
            </div>

            {/* Live KPI Widget Preview */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#090A0F]/80 border border-white/5 font-code-sm">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase">Workload Balance</p>
                <p className="text-emerald-400 font-bold text-sm">94.2%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase">Throughput Gain</p>
                <p className="text-cyan-400 font-bold text-sm">+38%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {card2.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-code-sm text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            <Link
              href={`/projects/${card2.slug}`}
              className="inline-flex items-center text-xs text-emerald-400 font-semibold group-hover:text-emerald-300 hover:underline"
            >
              <span>Explore Dashboard</span>
              <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            {card2.github_url && (
              <a
                href={card2.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
                title="View Source on GitHub"
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
              </a>
            )}
          </div>
        </div>

        {/* BENTO CARD 3: Span 4 Cols (Healthcare Predictive) */}
        <div className="lg:col-span-4 group relative p-6 rounded-3xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-950/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300">
                Predictive Analytics
              </span>
              <span className="font-code-sm text-[11px] text-cyan-400 font-bold">1,000+ Records</span>
            </div>
            <h4 className="font-display text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              {card3.title}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {card3.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {card3.technologies.map((tech) => (
                <span key={tech} className="font-code-sm text-[11px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
            <Link href={`/projects/${card3.slug}`} className="text-xs text-blue-400 font-semibold inline-flex items-center">
              <span>View Case</span>
              <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* BENTO CARD 4: Span 4 Cols (Risk Monitoring) */}
        <div className="lg:col-span-4 group relative p-6 rounded-3xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-950/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Risk Intelligence
              </span>
              <span className="font-code-sm text-[11px] text-emerald-400 font-bold">Power BI</span>
            </div>
            <h4 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              {card4.title}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {card4.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {card4.technologies.map((tech) => (
                <span key={tech} className="font-code-sm text-[11px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
            <Link href={`/projects/${card4.slug}`} className="text-xs text-cyan-400 font-semibold inline-flex items-center">
              <span>View Dashboard</span>
              <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* BENTO CARD 5: Span 4 Cols (Data QA & Compliance) */}
        <div className="lg:col-span-4 group relative p-6 rounded-3xl bg-[#0F172A]/50 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                QA &amp; Governance
              </span>
              <span className="font-code-sm text-[11px] text-cyan-400 font-bold">Data Quality</span>
            </div>
            <h4 className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              {card5.title}
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {card5.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {card5.technologies.map((tech) => (
                <span key={tech} className="font-code-sm text-[11px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
            <Link href={`/projects/${card5.slug}`} className="text-xs text-emerald-400 font-semibold inline-flex items-center">
              <span>View QA Strategy</span>
              <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
export default Projects;

