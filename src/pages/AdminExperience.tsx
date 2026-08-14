import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  location: string;
  duration: string;
  highlights: string[];
  display_order: number;
}

export const AdminExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<ExperienceItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [, setLocation] = useLocation();

  const fetchExperiences = () => {
    setLoading(true);
    fetch('/api/admin/experience')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => {
        setLocation('/admin/login');
      });
  };

  useEffect(() => {
    fetchExperiences();
  }, [setLocation]);

  const handleOpenAddModal = () => {
    setEditingItem({
      role: '',
      company: '',
      location: '',
      duration: '',
      highlights: [],
      display_order: experiences.length + 1,
    });
    setHighlightInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ExperienceItem) => {
    setEditingItem({ ...item });
    setHighlightInput('');
    setIsModalOpen(true);
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim() || !editingItem) return;
    const updatedHighlights = [...(editingItem.highlights || []), highlightInput.trim()];
    setEditingItem({ ...editingItem, highlights: updatedHighlights });
    setHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    if (!editingItem) return;
    const updatedHighlights = (editingItem.highlights || []).filter((_, i) => i !== index);
    setEditingItem({ ...editingItem, highlights: updatedHighlights });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.role || !editingItem?.company || !editingItem?.location || !editingItem?.duration) {
      setStatusMessage({ type: 'error', text: 'Role, company, location, and duration are required.' });
      return;
    }

    try {
      const isNew = !editingItem.id;
      const url = isNew ? '/api/admin/experience' : `/api/admin/experience/${editingItem.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) throw new Error('Failed to save experience record');

      setStatusMessage({ type: 'success', text: `Experience ${isNew ? 'added' : 'updated'} successfully!` });
      setIsModalOpen(false);
      setEditingItem(null);
      fetchExperiences();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience record?')) return;
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience');
      setStatusMessage({ type: 'success', text: 'Experience deleted successfully.' });
      fetchExperiences();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred.' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#334155] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Professional Experience</h1>
            <p className="text-xs text-on-surface-variant">Manage your work history, positions, and operational highlights.</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Position</span>
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
        ) : experiences.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">work</span>
            <p className="text-on-surface-variant text-sm">No professional experience records found.</p>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add First Position
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-white">{exp.role}</h2>
                    <p className="text-xs text-[#3B82F6] font-semibold">
                      {exp.company} &bull; <span className="text-on-surface-variant font-normal">{exp.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 self-start">
                    <span className="font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded text-[#94A3B8]">
                      {exp.duration}
                    </span>
                    <button
                      onClick={() => handleOpenEditModal(exp)}
                      className="p-1.5 text-on-surface-variant hover:text-white hover:bg-[#0F172A] rounded transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-1.5 text-error hover:bg-red-950/30 rounded transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                <ul className="list-disc pl-5 space-y-1 text-xs text-on-surface-variant">
                  {exp.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Edit / Add Modal */}
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 custom-scrollbar animate-fade-in">
              <div className="flex justify-between items-center border-b border-[#334155] pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editingItem.id ? 'Edit Work Experience' : 'Add Work Experience'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Job Role / Title *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.role || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                      placeholder="e.g. Data Analyst"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.company || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      placeholder="e.g. Big Data Consult"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.location || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                      placeholder="e.g. Nigeria"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Duration *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.duration || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                      placeholder="e.g. Jan 2024 – Present"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order ?? 0}
                    onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full md:w-32 px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                {/* Highlights list builder */}
                <div className="space-y-2 pt-2 border-t border-[#334155]">
                  <label className="block text-xs font-medium text-on-surface-variant">Key Highlights / Bullet Points</label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      placeholder="Type a highlight point and press Add..."
                      className="flex-grow px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-4 py-2 bg-[#334155] text-white text-xs font-semibold rounded-lg hover:bg-[#475569] transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <ul className="space-y-2 mt-3">
                    {(editingItem.highlights || []).map((hl, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-[#0F172A] px-3 py-2 rounded border border-[#334155] text-xs text-white">
                        <span>{hl}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-error hover:text-red-400 ml-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#334155]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-transparent border border-[#334155] text-white text-xs font-semibold rounded-lg hover:bg-[#0F172A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Experience
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
