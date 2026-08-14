import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface Project {
  id: number;
  title: string;
  slug: string;
  technologies: string[];
  description: string;
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to retrieve projects');
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="space-y-12" id="projects">
      <div className="space-y-4 max-w-2xl">
        <h2 className="font-headline-lg text-3xl font-bold text-white">Featured Projects</h2>
        <p className="text-on-surface-variant leading-relaxed">
          A selection of projects demonstrating analytical, automation, and dashboard building skills to address
          practical business requirements.
        </p>
      </div>

      {loading ? (
        /* Loading skeleton grids */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4 animate-pulse"
            >
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-[#0F172A] rounded"></div>
                <div className="h-6 w-20 bg-[#0F172A] rounded"></div>
              </div>
              <div className="h-7 w-3/4 bg-[#0F172A] rounded"></div>
              <div className="h-4 w-full bg-[#0F172A] rounded"></div>
              <div className="h-4 w-5/6 bg-[#0F172A] rounded"></div>
            </div>
          ))}
        </div>
      ) : error || projects.length === 0 ? (
        /* Empty / Error state */
        <div className="glass-panel p-10 rounded-xl border border-outline-variant bg-[#1E293B] text-center space-y-2">
          <span className="material-symbols-outlined text-4xl text-[#ffb4ab]">grid_view</span>
          <p className="text-on-surface-variant font-medium">No published projects are currently available.</p>
        </div>
      ) : (
        /* Projects Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] hover:border-[#475569] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-code-sm text-[11px] px-2 py-0.5 bg-[#0F172A] border border-[#334155] rounded text-[#94A3B8]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="font-headline-lg text-xl font-semibold text-white group-hover:text-[#3B82F6] transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{project.description}</p>
              </div>
              <div className="mt-6">
                <Link href={`/projects/${project.slug}`}>
                  <a className="inline-flex items-center text-xs text-[#3B82F6] font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
                    <span>Learn more</span>
                    <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
