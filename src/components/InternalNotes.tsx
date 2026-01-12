// Internal Notes Component - Private team communication
// Developer: Matheus Schumacher | 2026

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import './InternalNotes.css';

interface InternalNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface InternalNotesProps {
  emailId: string;
  notes: InternalNote[];
  onAddNote: (content: string) => void;
}

export const InternalNotes = ({ notes, onAddNote }: InternalNotesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleSubmit = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote('');
    toast.success('Nota interna adicionada', { 
      description: 'Visível apenas para a equipe' 
    });
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div className="internal-notes-container">
      <button 
        className={`internal-notes-toggle ${isOpen ? 'active' : ''} ${notes.length > 0 ? 'has-notes' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <StickyNote size={16} />
        <span>Notas Internas</span>
        {notes.length > 0 && (
          <span className="notes-count">{notes.length}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="internal-notes-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="notes-header">
              <span>🔒 Notas privadas da equipe</span>
              <button onClick={() => setIsOpen(false)}>
                <X size={14} />
              </button>
            </div>

            {notes.length > 0 && (
              <div className="notes-list">
                {notes.map((note) => (
                  <div key={note.id} className="note-item">
                    <div className="note-meta">
                      <span className="note-author">{note.authorName}</span>
                      <span className="note-time">{formatTime(note.createdAt)}</span>
                    </div>
                    <p className="note-content">{note.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="notes-input">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Adicionar nota interna..."
                rows={2}
              />
              <button 
                className="send-note-btn"
                onClick={handleSubmit}
                disabled={!newNote.trim()}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
