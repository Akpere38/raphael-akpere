import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  github_url: string;
  demo_url: string;
  image_url: string;
  featured: boolean;
  published: boolean;
  display_order: number;
}

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Form Editor State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    technologies: [] as string[],
    github_url: '',
    demo_url: '',
    image_url: '',
    featured: false,
    published: false,
    display_order: 0,
  });
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    // Validate auth status
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          setLocation('/admin/login');
        }
      })
      .catch(() => setLocation('/admin/login'));

    fetchProjects();
  }, [setLocation]);

  const fetchProjects = () => {
    setLoading(true);
    fetch('/api/admin/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to retrieve projects');
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
  };

  const handleOpenAddForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      technologies: [],
      github_url: '',
      demo_url: '',
      image_url: '',
      featured: false,
      published: true,
      display_order: projects.length > 0 ? Math.max(...projects.map(p => p.display_order)) + 1 : 1,
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      technologies: [...project.technologies],
      github_url: project.github_url,
      demo_url: project.demo_url,
      image_url: project.image_url,
      featured: project.featured,
      published: project.published,
      display_order: project.display_order,
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto-generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTech.trim()) return;
    if (formData.technologies.includes(newTech.trim())) {
      setNewTech('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      technologies: [...prev.technologies, newTech.trim()],
    }));
    setNewTech('');
  };

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate URLs if provided
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (formData.github_url && !urlPattern.test(formData.github_url)) {
      setError('Please provide a valid GitHub repository URL.');
      return;
    }
    if (formData.demo_url && !urlPattern.test(formData.demo_url)) {
      setError('Please provide a valid live demo URL.');
      return;
    }

    try {
      const isEdit = !!editingProject;
      const url = isEdit ? `/api/admin/projects/${editingProject!.id}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      setIsFormOpen(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete project');
      }
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        
        {/* Header Title & Add Button */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white font-display">Manage Portfolio Projects</h1>
            <p className="text-sm text-on-surface-variant">Create, edit, or adjust display priorities of your projects.</p>
          </div>
          <button
            onClick={handleOpenAddForm}
            className="inline-flex justify-center items-center px-4 py-2.5 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer glow-effect"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Add Project
          </button>
        </div>

        {/* Form Modal / Pane */}
        {isFormOpen && (
          <div className="glass-panel p-6 rounded-2xl border border-outline-variant bg-[#1E293B] space-y-6">
            <div className="flex justify-between items-center border-b border-[#334155] pb-4">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project Details' : 'Add New Portfolio Project'}
              </h2>
              <button onClick={handleCloseForm} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center space-x-2">
                <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none"
                    placeholder="e.g. Transaction Analysis System"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">URL Slug (Auto-generated)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none resize-none"
                    placeholder="Describe the problem, technologies, and achievements..."
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Order</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 bg-[#0F172A] border-[#334155] rounded"
                    />
                    <label htmlFor="featured" className="text-sm text-white cursor-pointer select-none">Featured</label>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                      className="w-4 h-4 bg-[#0F172A] border-[#334155] rounded"
                    />
                    <label htmlFor="published" className="text-sm text-white cursor-pointer select-none">Published</label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">GitHub Repository URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.github_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Live Demo URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.demo_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, demo_url: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Thumbnail / Image URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                {/* Technologies List Editor */}
                <div className="space-y-2">
                  <label className="text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">Technologies</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      className="flex-grow px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm focus:border-[#3B82F6] focus:outline-none"
                      placeholder="e.g. FastAPI"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-4 py-2 bg-[#1E293B] border border-[#334155] text-white rounded-lg hover:bg-[#0F172A] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="ml-2 text-[#ffb4ab] hover:text-red-500 font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              <div className="md:col-span-2 border-t border-[#334155] pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-2 border border-[#334155] text-white rounded-lg hover:bg-[#0F172A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors glow-effect"
                >
                  Save Project
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Projects List Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-[30vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B82F6]"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-10 rounded-xl border border-outline-variant bg-[#1E293B] text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">grid_view</span>
            <p className="text-on-surface-variant font-medium">No projects found. Create one to get started.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-xl border border-outline-variant bg-[#1E293B] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#334155] text-xs font-label-caps text-on-surface-variant tracking-wider uppercase">
                  <th className="p-4 pl-6">Order</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Technologies</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#0F172A]/40 transition-colors text-sm">
                    <td className="p-4 pl-6 font-code-sm text-xs">{project.display_order}</td>
                    <td className="p-4 font-bold text-white">
                      <div>
                        {project.title}
                        {project.featured && (
                          <span className="ml-2 text-[10px] bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] px-1.5 py-0.5 rounded uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-normal text-on-surface-variant truncate max-w-xs md:max-w-md">
                        {project.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="font-code-sm text-[10px] px-1.5 py-0.5 bg-[#0F172A] border border-[#334155] rounded text-[#94A3B8]">
                            {t}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[10px] text-on-surface-variant font-bold">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {project.published ? (
                        <span className="inline-flex items-center text-xs text-[#10B981] font-semibold bg-emerald-950/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs text-on-surface-variant font-semibold bg-[#0F172A] border border-[#334155] px-2.5 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditForm(project)}
                        className="inline-flex items-center justify-center p-1.5 bg-transparent border border-[#334155] text-white rounded-lg hover:bg-[#0F172A] transition-colors"
                        title="Edit Project"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="inline-flex items-center justify-center p-1.5 bg-transparent border border-[#334155] text-error rounded-lg hover:bg-red-950/20 transition-colors"
                        title="Delete Project"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
