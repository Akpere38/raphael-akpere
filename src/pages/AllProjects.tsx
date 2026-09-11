import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  featured?: boolean;
  published?: boolean;
  overview?: string;
  metrics?: string;
}

const CATEGORY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Full-Stack / Web', value: 'fullstack' },
  { label: 'Python / Backend', value: 'backend' },
  { label: 'SQL & Databases', value: 'sql' },
  { label: 'Data Solutions', value: 'data' },
];

export const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching catalog projects:', err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Search filter (title, description, technologies)
      const matchesSearch =
        searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      // 2. Category filter
      if (activeCategory === 'all') return true;
      if (activeCategory === 'fullstack') {
        return project.technologies.some(
          (t) =>
            t.toLowerCase().includes('react') ||
            t.toLowerCase().includes('full-stack') ||
            t.toLowerCase().includes('fullstack') ||
            t.toLowerCase().includes('typescript') ||
            t.toLowerCase().includes('web') ||
            t.toLowerCase().includes('tailwind') ||
            t.toLowerCase().includes('javascript')
        );
      }
      if (activeCategory === 'backend') {
        return project.technologies.some(
          (t) =>
            t.toLowerCase().includes('python') ||
            t.toLowerCase().includes('django') ||
            t.toLowerCase().includes('fastapi') ||
            t.toLowerCase().includes('backend') ||
            t.toLowerCase().includes('api') ||
            t.toLowerCase().includes('node')
        );
      }
      if (activeCategory === 'sql') {
        return project.technologies.some(
          (t) =>
            t.toLowerCase().includes('sql') ||
            t.toLowerCase().includes('postgresql') ||
            t.toLowerCase().includes('database') ||
            t.toLowerCase().includes('bi') ||
            t.toLowerCase().includes('power bi')
        );
      }
      if (activeCategory === 'data') {
        return project.technologies.some(
          (t) =>
            t.toLowerCase().includes('data') ||
            t.toLowerCase().includes('pipeline') ||
            t.toLowerCase().includes('etl') ||
            t.toLowerCase().includes('analytics') ||
            t.toLowerCase().includes('statistical') ||
            t.toLowerCase().includes('pandas') ||
            t.toLowerCase().includes('validation')
        );
      }

      return true;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 px-4 md:px-8 max-w-[1180px] mx-auto space-y-12 animate-fade-in">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-code-sm text-xs font-semibold cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[16px] mr-1.5 group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>Back to Home</span>
          </Link>

          <span className="inline-flex items-center space-x-2 text-xs font-code-sm text-slate-400 bg-slate-900/80 border border-white/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{projects.length} Published Initiatives</span>
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-code-sm uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Complete Repository &amp; Project Index</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineering &amp; <br />
            <span className="gradient-text-cyan-blue">Data Solutions Catalog</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Browse all published full-stack applications, backend services, automation scripts, and analytical platforms.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-6 rounded-3xl bg-[#0F172A]/70 backdrop-blur-xl border border-white/10 space-y-5 shadow-xl">
          
          {/* Search Box */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project title, keyword, or tech stack (e.g. Python, SQL, Power BI)..."
              className="w-full pl-12 pr-4 py-3 bg-[#090A0F]/80 border border-white/10 rounded-2xl text-white text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-slate-500 font-body-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-code-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-code-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-950/40'
                      : 'bg-[#090A0F]/60 text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid Section */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="text-slate-400 font-code-sm text-sm">Loading project catalog...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="py-20 px-6 rounded-3xl bg-[#0F172A]/40 border border-white/10 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
              <span className="material-symbols-outlined text-3xl">folder_off</span>
            </div>
            <h3 className="text-lg font-bold text-white">No Matching Projects Found</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No projects matched your search for <span className="text-cyan-300">"{searchQuery}"</span> under the selected category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-white/10 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Responsive 3-Column Catalog Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project.slug}
                className="group relative p-7 rounded-3xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/30"
              >
                <div className="space-y-4">
                  
                  {/* Top Badging */}
                  <div className="flex items-center justify-between gap-2">
                    {project.featured ? (
                      <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">
                        ★ Featured Case
                      </span>
                    ) : (
                      <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-400">
                        Production Project
                      </span>
                    )}

                    {project.metrics && (
                      <span className="font-code-sm text-[11px] text-emerald-400 font-medium truncate max-w-[150px]">
                        {project.metrics.split(',')[0]}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {project.description || project.overview}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="font-code-sm text-[11px] px-2.5 py-1 bg-[#090A0F]/80 border border-white/10 rounded-lg text-slate-300 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="font-code-sm text-[11px] px-2 py-1 text-slate-500">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer & Action Links */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                  >
                    <span>Explore Case Study</span>
                    <span className="material-symbols-outlined text-[15px] ml-1 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
                        title="View GitHub Repository"
                      >
                        <span className="material-symbols-outlined text-[16px]">code</span>
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white transition-colors"
                        title="View Live Demo"
                      >
                        <span className="material-symbols-outlined text-[16px]">launch</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
      <Footer />
    </>
  );
};

export default AllProjects;
