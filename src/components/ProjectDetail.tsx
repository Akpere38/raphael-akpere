import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Header } from './Header';
import { Footer } from './Footer';

interface Project {
  title: string;
  technologies: string[];
  description: string;
  overview?: string;
  problem?: string;
  architecture?: string;
  metrics?: string;
  key_results?: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
}

export const ProjectDetail: React.FC = () => {
  const [, params] = useRoute('/projects/:slug');
  const slug = params?.slug;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/projects/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Project not found or server error');
        }
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="pt-36 pb-20 px-4 max-w-[1180px] mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400 font-code-sm text-sm">Loading project architecture...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Header />
        <div className="pt-36 pb-20 px-4 max-w-[1180px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-headline-lg">Project Details Unavailable</h2>
          <p className="text-slate-400 max-w-md text-sm">{error || 'This project might not exist or has been relocated.'}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 glow-effect"
          >
            Return to Portfolio
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const hasStructuredDetails = Boolean(
    project.overview || project.problem || project.architecture || project.metrics || (project.key_results && project.key_results.length > 0)
  );

  return (
    <>
      <Header />
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-[1180px] mx-auto space-y-8 animate-fade-in">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-code-sm text-xs font-semibold cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[16px] mr-1.5 group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span>Back to Portfolio</span>
        </Link>

        <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A]/60 backdrop-blur-2xl border border-white/10 space-y-8 cyber-grid shadow-2xl">
          
          {/* Project Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-code-sm uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Engineering Case Study</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-code-sm text-xs px-3.5 py-1.5 bg-[#090A0F]/80 border border-white/10 rounded-lg text-slate-300 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Hero Image */}
          {project.image_url && (
            <div className="w-full max-h-[480px] overflow-hidden rounded-2xl border border-white/10">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Structured Case Study Sections */}
          {hasStructuredDetails ? (
            <div className="space-y-6 border-t border-white/10 pt-8">
              
              {/* 1. Context & Executive Overview */}
              {project.overview && (
                <div className="p-6 rounded-2xl bg-[#090A0F]/60 border border-white/5 space-y-3">
                  <div className="flex items-center space-x-2.5 text-cyan-400">
                    <span className="material-symbols-outlined text-xl">info</span>
                    <h3 className="font-bold text-white text-base">Executive Overview &amp; Context</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                    {project.overview}
                  </p>
                </div>
              )}

              {/* 2. Problem Statement */}
              {project.problem && (
                <div className="p-6 rounded-2xl bg-[#090A0F]/60 border border-white/5 space-y-3">
                  <div className="flex items-center space-x-2.5 text-amber-400">
                    <span className="material-symbols-outlined text-xl">warning</span>
                    <h3 className="font-bold text-white text-base">The Core Problem &amp; Bottlenecks</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                    {project.problem}
                  </p>
                </div>
              )}

              {/* 3. Architecture & Technical Approach */}
              {project.architecture && (
                <div className="p-6 rounded-2xl bg-[#090A0F]/60 border border-white/5 space-y-3">
                  <div className="flex items-center space-x-2.5 text-blue-400">
                    <span className="material-symbols-outlined text-xl">account_tree</span>
                    <h3 className="font-bold text-white text-base">Architecture &amp; Technical Approach</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                    {project.architecture}
                  </p>
                </div>
              )}

              {/* 4. Results & Quantifiable Metrics */}
              {project.metrics && (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2.5 text-emerald-400">
                    <span className="material-symbols-outlined text-xl">trending_up</span>
                    <h3 className="font-bold text-emerald-300 text-base">Business Impact &amp; Metrics</h3>
                  </div>
                  <p className="text-emerald-100 leading-relaxed text-sm sm:text-base font-medium">
                    {project.metrics}
                  </p>
                </div>
              )}

              {/* 5. Key Deliverable Highlights */}
              {project.key_results && project.key_results.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#090A0F]/60 border border-white/5 space-y-3">
                  <div className="flex items-center space-x-2.5 text-cyan-400">
                    <span className="material-symbols-outlined text-xl">verified</span>
                    <h3 className="font-bold text-white text-base">Key Technical Deliverables</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-300">
                    {project.key_results.map((result, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 leading-relaxed">
                        <span className="text-cyan-400 text-base leading-tight">&rsaquo;</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ) : (
            /* Fallback to simple description if structured sections are not populated */
            <div className="space-y-4 border-t border-white/10 pt-8">
              <h2 className="text-xl font-bold text-white font-headline-lg flex items-center space-x-2">
                <span className="material-symbols-outlined text-cyan-400">subject</span>
                <span>Project Case Breakdown</span>
              </h2>
              <div className="text-slate-300 leading-relaxed text-base whitespace-pre-line bg-[#090A0F]/40 p-6 rounded-2xl border border-white/5">
                {project.description}
              </div>
            </div>
          )}

          {/* Demos & Code Links */}
          {(project.github_url || project.demo_url) && (
            <div className="flex flex-col sm:flex-row gap-4 border-t border-white/10 pt-8 w-full sm:w-auto">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-6 py-3.5 bg-[#090A0F]/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 text-white font-semibold text-xs rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2 text-cyan-400">code</span>
                  View GitHub Repository
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 glow-effect"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">launch</span>
                  View Live Deployment
                </a>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
};


