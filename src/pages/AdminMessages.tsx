import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminLayout } from '../components/AdminLayout';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
  created_at: string;
}

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
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

    fetchMessages();
  }, [setLocation]);

  const fetchMessages = () => {
    setLoading(true);
    fetch('/api/admin/messages')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleOpenMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === 'NEW') {
      try {
        const res = await fetch(`/api/admin/messages/${msg.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'READ' }),
        });
        if (res.ok) {
          // Update status in local list
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, status: 'READ' } : m))
          );
        }
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleUpdateStatus = async (id: number, status: 'READ' | 'ARCHIVED') => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchMessages();
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to update message status:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        
        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-display">Client Inquiries</h1>
          <p className="text-sm text-on-surface-variant">Review message inquiries submitted by public visitors.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Messages List Area */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-[30vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B82F6]"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="glass-panel p-10 rounded-xl border border-outline-variant bg-[#1E293B] text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">inbox</span>
                <p className="text-on-surface-variant font-medium">Inbox is empty. No inquiries found.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {messages.map((msg) => {
                  const isNew = msg.status === 'NEW';
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`glass-panel p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-start ${
                        isSelected
                          ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                          : 'border-outline-variant hover:border-[#475569] bg-[#1E293B]'
                      }`}
                    >
                      <div className="space-y-1.5 flex-grow pr-4">
                        <div className="flex items-center space-x-2">
                          {isNew && (
                            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                          )}
                          <span className={`text-sm ${isNew ? 'font-bold text-white' : 'text-on-surface-variant'}`}>
                            {msg.name}
                          </span>
                          <span className="text-[11px] text-on-surface-variant opacity-60 font-code-sm">
                            &bull; {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className={`text-sm ${isNew ? 'font-semibold text-[#3B82F6]' : 'text-on-surface'}`}>
                          {msg.subject}
                        </h4>
                        <p className="text-xs text-on-surface-variant truncate max-w-sm md:max-w-md">
                          {msg.message}
                        </p>
                      </div>
                      
                      {msg.status !== 'ARCHIVED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(msg.id, 'ARCHIVED');
                          }}
                          className="text-on-surface-variant hover:text-error p-1 rounded-md"
                          title="Archive Inquiry"
                        >
                          <span className="material-symbols-outlined text-[20px]">archive</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Message Details Pane */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-[#1E293B] space-y-6 animate-fade-in">
                
                <div className="flex justify-between items-start border-b border-[#334155] pb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedMessage.name}</h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs text-[#3B82F6] hover:underline flex items-center mt-1"
                    >
                      <span className="material-symbols-outlined text-[14px] mr-1">mail</span>
                      {selectedMessage.email}
                    </a>
                  </div>
                  <span className="text-xs font-code-sm text-on-surface-variant">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-label-caps text-on-surface-variant uppercase">Subject</span>
                    <h4 className="font-semibold text-white mt-1">{selectedMessage.subject}</h4>
                  </div>

                  <div>
                    <span className="text-xs font-label-caps text-on-surface-variant uppercase">Message Content</span>
                    <p className="text-sm text-on-surface-variant leading-relaxed mt-2 whitespace-pre-wrap bg-[#0F172A] p-4 rounded-lg border border-[#334155]">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-[#334155]">
                  {selectedMessage.status === 'ARCHIVED' ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'READ')}
                      className="flex-grow inline-flex justify-center items-center px-4 py-2 border border-[#334155] text-white text-xs font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
                    >
                      Restore Inbox
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, 'ARCHIVED')}
                      className="flex-grow inline-flex justify-center items-center px-4 py-2 bg-red-950/20 border border-red-500/30 text-error text-xs font-semibold rounded-lg hover:bg-red-900/30 transition-colors"
                    >
                      Archive Inquiry
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="glass-panel p-8 rounded-xl border border-outline-variant bg-[#1E293B]/50 text-center text-on-surface-variant text-sm">
                Select an inquiry from the list to view its complete details.
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
