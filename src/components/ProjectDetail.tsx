import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Header } from './Header';
import { Footer } from './Footer';

interface Project {
  title: string;
  technologies: string[];
  description: string;
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
        <div className="pt-32 pb-16 px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6]"></div>
          <p className="mt-4 text-on-surface-variant font-medium">Loading project details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Header />
        <div className="pt-32 pb-16 px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
          <span className="material-symbols-outlined text-error text-6xl">error</span>
          <h2 className="text-2xl font-bold text-white">Oops! Project Details Unavailable</h2>
          <p className="text-on-surface-variant max-w-md">{error || 'This project might not exist or has been unpublished.'}</p>
          <Link
            href="/"
            className="inline-flex justify-center items-center px-6 py-2.5 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Portfolio
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-margin-mobile md:px-gutter max-w-container-max mx-auto space-y-8 animate-fade-in">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-[#3B82F6] font-semibold hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          Back to Portfolio
        </Link>

        <div className="glass-panel p-8 rounded-2xl border border-outline-variant bg-[#1E293B] space-y-8">
          
          {/* Project Title and badging */}
          <div className="space-y-4">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{project.title}</h1>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-code-sm text-xs px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Image */}
          {project.image_url && (
            <div className="w-full max-h-[450px] overflow-hidden rounded-xl border border-outline-variant">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-4 border-t border-[#334155] pt-6">
            <h2 className="text-xl font-bold text-white">Project Case Details</h2>
            <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">{project.description}</p>
          </div>

          {/* Demos & Code Links */}
          {(project.github_url || project.demo_url) && (
            <div className="flex flex-col sm:flex-row gap-4 border-t border-[#334155] pt-6 w-full sm:w-auto">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-6 py-3 bg-transparent border border-[#334155] text-white font-semibold rounded-lg hover:bg-[#0F172A] hover:border-[#475569] transition-colors"
                >
                  <span className="material-symbols-outlined mr-2">code</span>
                  View GitHub Repository
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors glow-effect"
                >
                  <span className="material-symbols-outlined mr-2">launch</span>
                  View Live Demo
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
