import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

interface Degree {
  id: number;
  degree: string;
  institution: string;
  year: string;
  display_order: number;
}

interface Certification {
  id: number;
  name: string;
  year: string;
  display_order: number;
}

export const AdminEducation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'education' | 'certifications'>('education');
  const [educationList, setEducationList] = useState<Degree[]>([]);
  const [certificationsList, setCertificationsList] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Partial<Degree> | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [, setLocation] = useLocation();

  const fetchData = () => {
    setLoading(true);
    fetch('/api/admin/education')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setEducationList(data.education || []);
        setCertificationsList(data.certifications || []);
        setLoading(false);
      })
      .catch(() => {
        setLocation('/admin/login');
      });
  };

  useEffect(() => {
    fetchData();
  }, [setLocation]);

  // Education Handlers
  const handleOpenAddEdu = () => {
    setEditingEdu({ degree: '', institution: '', year: '', display_order: educationList.length + 1 });
    setIsEduModalOpen(true);
  };

  const handleOpenEditEdu = (item: Degree) => {
    setEditingEdu({ ...item });
    setIsEduModalOpen(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu?.degree || !editingEdu?.institution || !editingEdu?.year) {
      setStatusMessage({ type: 'error', text: 'Degree, institution, and year are required.' });
      return;
    }
    try {
      const isNew = !editingEdu.id;
      const url = isNew ? '/api/admin/education' : `/api/admin/education/${editingEdu.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEdu),
      });

      if (!res.ok) throw new Error('Failed to save education entry');

      setStatusMessage({ type: 'success', text: `Degree ${isNew ? 'added' : 'updated'} successfully!` });
      setIsEduModalOpen(false);
      setEditingEdu(null);
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred.' });
    }
  };

  const handleDeleteEdu = async (id: number) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete education entry');
      setStatusMessage({ type: 'success', text: 'Education entry deleted.' });
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error deleting entry.' });
    }
  };

  // Certifications Handlers
  const handleOpenAddCert = () => {
    setEditingCert({ name: '', year: '', display_order: certificationsList.length + 1 });
    setIsCertModalOpen(true);
  };

  const handleOpenEditCert = (item: Certification) => {
    setEditingCert({ ...item });
    setIsCertModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.name || !editingCert?.year) {
      setStatusMessage({ type: 'error', text: 'Certification name and year are required.' });
      return;
    }
    try {
      const isNew = !editingCert.id;
      const url = isNew ? '/api/admin/certifications' : `/api/admin/certifications/${editingCert.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCert),
      });

      if (!res.ok) throw new Error('Failed to save certification');

      setStatusMessage({ type: 'success', text: `Certification ${isNew ? 'added' : 'updated'} successfully!` });
      setIsCertModalOpen(false);
      setEditingCert(null);
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred.' });
    }
  };

  const handleDeleteCert = async (id: number) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete certification');
      setStatusMessage({ type: 'success', text: 'Certification deleted.' });
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error deleting certification.' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#334155] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Education &amp; Certifications</h1>
            <p className="text-xs text-on-surface-variant">Manage your academic qualifications and professional certifications.</p>
          </div>
          <div className="flex items-center space-x-3">
            {activeTab === 'education' ? (
              <button
                onClick={handleOpenAddEdu}
                className="px-4 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Add Degree / Education</span>
              </button>
            ) : (
              <button
                onClick={handleOpenAddCert}
                className="px-4 py-2 bg-[#10B981] text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Add Certification</span>
              </button>
            )}
          </div>
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

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-[#334155]">
          <button
            onClick={() => setActiveTab('education')}
            className={`pb-3 px-2 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'education' ? 'border-[#3B82F6] text-[#3B82F6]' : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">school</span>
            <span>Education Degrees ({educationList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`pb-3 px-2 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'certifications' ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            <span>Certifications ({certificationsList.length})</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B82F6]"></div>
          </div>
        ) : activeTab === 'education' ? (
          /* Education List */
          educationList.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">school</span>
              <p className="text-on-surface-variant text-sm">No education degrees found.</p>
              <button onClick={handleOpenAddEdu} className="px-4 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg">
                Add First Degree
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationList.map((edu) => (
                <div key={edu.id} className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">{edu.degree}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{edu.institution}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#334155]">
                    <span className="font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded text-[#94A3B8]">
                      {edu.year}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditEdu(edu)}
                        className="p-1.5 text-on-surface-variant hover:text-white hover:bg-[#0F172A] rounded transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEdu(edu.id)}
                        className="p-1.5 text-error hover:bg-red-950/30 rounded transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Certifications List */
          certificationsList.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-xl border border-outline-variant bg-[#1E293B] space-y-4">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">workspace_premium</span>
              <p className="text-on-surface-variant text-sm">No certifications found.</p>
              <button onClick={handleOpenAddCert} className="px-4 py-2 bg-[#10B981] text-white text-xs font-semibold rounded-lg">
                Add First Certification
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificationsList.map((cert) => (
                <div key={cert.id} className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">{cert.name}</h3>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#334155]">
                    <span className="font-code-sm text-xs px-2.5 py-1 bg-[#0F172A] border border-[#334155] rounded text-[#94A3B8]">
                      {cert.year}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditCert(cert)}
                        className="p-1.5 text-on-surface-variant hover:text-white hover:bg-[#0F172A] rounded transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 text-error hover:bg-red-950/30 rounded transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Education Modal */}
        {isEduModalOpen && editingEdu && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-lg p-6 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-[#334155] pb-3">
                <h3 className="text-lg font-bold text-white">{editingEdu.id ? 'Edit Degree' : 'Add Degree'}</h3>
                <button onClick={() => setIsEduModalOpen(false)} className="text-on-surface-variant hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveEdu} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Degree Title *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.degree || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.institution || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                    placeholder="e.g. National Open University of Nigeria"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Year / Timeline *</label>
                    <input
                      type="text"
                      required
                      value={editingEdu.year || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, year: e.target.value })}
                      placeholder="e.g. Expected 2027"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingEdu.display_order ?? 0}
                      onChange={(e) => setEditingEdu({ ...editingEdu, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#334155]">
                  <button
                    type="button"
                    onClick={() => setIsEduModalOpen(false)}
                    className="px-4 py-2 bg-transparent border border-[#334155] text-white text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg">
                    Save Degree
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Certification Modal */}
        {isCertModalOpen && editingCert && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-lg p-6 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-[#334155] pb-3">
                <h3 className="text-lg font-bold text-white">{editingCert.id ? 'Edit Certification' : 'Add Certification'}</h3>
                <button onClick={() => setIsCertModalOpen(false)} className="text-on-surface-variant hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveCert} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Certification Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.name || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    placeholder="e.g. Google Advanced Data Analytics Professional Certificate"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Year *</label>
                    <input
                      type="text"
                      required
                      value={editingCert.year || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingCert.display_order ?? 0}
                      onChange={(e) => setEditingCert({ ...editingCert, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#334155]">
                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(false)}
                    className="px-4 py-2 bg-transparent border border-[#334155] text-white text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#10B981] text-white text-xs font-semibold rounded-lg">
                    Save Certification
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
