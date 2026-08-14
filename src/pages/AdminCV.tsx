import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

export const AdminCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cvExists, setCvExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [, setLocation] = useLocation();

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

    checkCvStatus();
  }, [setLocation]);

  const checkCvStatus = () => {
    setLoading(true);
    fetch('/api/cv')
      .then((res) => {
        if (res.ok) {
          setCvExists(true);
        } else {
          setCvExists(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setCvExists(false);
        setLoading(false);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF documents are supported.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const res = await fetch('/api/admin/cv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload CV');
      }

      setSuccess('Your CV PDF has been uploaded and published successfully!');
      setFile(null);
      checkCvStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        
        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-display">CV / Resume Manager</h1>
          <p className="text-sm text-on-surface-variant">Upload, verify, or update your professional CV document.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Upload Console */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-6">
            <h3 className="text-lg font-bold text-white">Upload CV Document</h3>
            
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center space-x-2">
                <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/50 rounded-lg text-xs text-emerald-200 flex items-center space-x-2">
                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-[#334155] rounded-xl p-8 text-center hover:border-[#475569] transition-colors relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-3">
                  <span className="material-symbols-outlined text-[#3B82F6] text-4xl">cloud_upload</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {file ? file.name : 'Choose a CV PDF file'}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Limit 5MB. PDF format only.'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full inline-flex justify-center items-center px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-effect"
              >
                {uploading ? 'Publishing CV...' : 'Publish CV Document'}
              </button>
            </form>
          </div>

          {/* Current CV Status */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Current Published Document</h3>
              
              {loading ? (
                <div className="animate-pulse h-16 bg-[#0F172A] rounded-lg border border-[#334155]"></div>
              ) : cvExists ? (
                <div className="p-4 bg-[#0F172A] border border-[#334155] rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-3xl">picture_as_pdf</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Raphael-Akpere-CV.pdf</p>
                      <p className="text-xs text-on-surface-variant">Active public document</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-xs text-[#10B981] font-semibold bg-emerald-950/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Published
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-[#0F172A] border border-dashed border-red-500/30 rounded-lg text-center py-6">
                  <p className="text-sm text-[#ffb4ab]">No CV document has been uploaded yet.</p>
                  <p className="text-xs text-on-surface-variant mt-1">Please use the upload console to add your PDF.</p>
                </div>
              )}
            </div>

            {cvExists && (
              <div className="flex gap-4 mt-6">
                <a
                  href="/api/cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow inline-flex justify-center items-center px-4 py-2.5 bg-transparent border border-[#334155] text-white text-sm font-semibold rounded-lg hover:bg-[#0F172A] transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">visibility</span>
                  View PDF
                </a>
                <a
                  href="/api/cv?download=true"
                  className="flex-grow inline-flex justify-center items-center px-4 py-2.5 bg-[#3B82F6] text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors text-center glow-effect"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">download</span>
                  Download
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
