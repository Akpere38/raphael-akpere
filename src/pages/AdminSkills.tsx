import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

interface SkillCategory {
  id: number;
  title: string;
  icon: string;
  skills: string[];
  display_order: number;
}

export const AdminSkills: React.FC = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<SkillCategory> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillTagInput, setSkillTagInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [, setLocation] = useLocation();

  const fetchSkills = () => {
    setLoading(true);
    fetch('/api/admin/skills')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setSkillCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setLocation('/admin/login');
      });
  };

  useEffect(() => {
    fetchSkills();
  }, [setLocation]);

  const handleOpenAddModal = () => {
    setEditingCategory({
      title: '',
      icon: 'code',
      skills: [],
      display_order: skillCategories.length + 1,
    });
    setSkillTagInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: SkillCategory) => {
    setEditingCategory({ ...item });
    setSkillTagInput('');
    setIsModalOpen(true);
  };

  const handleAddSkillTag = () => {
    if (!skillTagInput.trim() || !editingCategory) return;
    const currentSkills = editingCategory.skills || [];
    if (currentSkills.includes(skillTagInput.trim())) return;
    setEditingCategory({ ...editingCategory, skills: [...currentSkills, skillTagInput.trim()] });
    setSkillTagInput('');
  };

  const handleRemoveSkillTag = (tag: string) => {
    if (!editingCategory) return;
    const updatedSkills = (editingCategory.skills || []).filter((s) => s !== tag);
    setEditingCategory({ ...editingCategory, skills: updatedSkills });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.title || !editingCategory?.icon) {
      setStatusMessage({ type: 'error', text: 'Category title and icon are required.' });
      return;
    }

    try {
      const isNew = !editingCategory.id;
      const url = isNew ? '/api/admin/skills' : `/api/admin/skills/${editingCategory.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });

      if (!res.ok) throw new Error('Failed to save skill category');

      setStatusMessage({ type: 'success', text: `Skill category ${isNew ? 'added' : 'updated'} successfully!` });
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchSkills();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this skill category?')) return;
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete skill category');
      setStatusMessage({ type: 'success', text: 'Skill category deleted.' });
      fetchSkills();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred.' });
    }
  };

  const materialIcons = [
    'code',
    'query_stats',
    'build',
    'database',
    'terminal',
    'api',
    'integration_instructions',
    'insights',
    'smart_toy',
    'settings',
    'language',
    'cloud',
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#334155] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Technical Capabilities</h1>
            <p className="text-xs text-on-surface-variant">Manage your technical skill categories and toolsets.</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Skill Category</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-lg text-sm flex justify-between items-center ${
              statusMessage.type === 'success' ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'bg-red-950/60 border border-red-500/30 text-red-300'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-xs opacity-70 hover:opacity-100">
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B82F6]"></div>
          </div>
        ) : skillCategories.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">monitoring</span>
            <p className="text-on-surface-variant text-sm">No skill categories found.</p>
            <button onClick={handleOpenAddModal} className="px-4 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg">
              Add First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="material-symbols-outlined text-[#3B82F6] text-2xl">{cat.icon}</span>
                      <h3 className="text-base font-bold text-white">{cat.title}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-1.5 text-on-surface-variant hover:text-white hover:bg-[#0F172A] rounded transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-error hover:bg-red-950/30 rounded transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#334155]">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-on-surface-variant/60 font-code-sm pt-2">
                  Display order: {cat.display_order}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && editingCategory && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-lg p-6 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-[#334155] pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editingCategory.id ? 'Edit Skill Category' : 'Add Skill Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Category Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.title || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                    placeholder="e.g. Software Development"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Icon Name (Material Symbols) *</label>
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[#3B82F6]">{editingCategory.icon}</span>
                      <input
                        type="text"
                        required
                        value={editingCategory.icon || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                        placeholder="e.g. code"
                        className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingCategory.display_order ?? 0}
                      onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>

                {/* Quick Icon Selector */}
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Quick Select Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {materialIcons.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, icon: ic })}
                        className={`p-2 rounded-lg border flex items-center justify-center ${
                          editingCategory.icon === ic ? 'border-[#3B82F6] bg-[#3B82F6]/20 text-[#3B82F6]' : 'border-[#334155] bg-[#0F172A] text-on-surface-variant hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{ic}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Tags Manager */}
                <div className="space-y-2 pt-2 border-t border-[#334155]">
                  <label className="block text-xs font-medium text-on-surface-variant">Skill Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillTagInput}
                      onChange={(e) => setSkillTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkillTag();
                        }
                      }}
                      placeholder="Type a skill (e.g. Python) and press Add..."
                      className="flex-grow px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkillTag}
                      className="px-4 py-2 bg-[#334155] text-white text-xs font-semibold rounded-lg hover:bg-[#475569] transition-colors"
                    >
                      Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(editingCategory.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1 font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded-md text-[#94A3B8]"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillTag(skill)}
                          className="text-error hover:text-red-400 ml-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#334155]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-transparent border border-[#334155] text-white text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg">
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
