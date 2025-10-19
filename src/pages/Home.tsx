import { useState, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { useLocalNotes } from '../hooks/useLocalNotes';
import { Sidebar } from '../components/Sidebar';
import { NoteCard } from '../components/NoteCard';
import { NoteEditor } from '../components/NoteEditor';
import { Toolbar } from '../components/Toolbar';
import { DeleteModal } from '../components/DeleteModal';
import { SettingsModal } from '../components/SettingsModal';
import { Note, NoteFilter } from '../types/note';

export const Home = () => {
  const { notes, saveNote, updateNote, deleteNote, toggleFavorite } = useLocalNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<NoteFilter>('recent');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    if (currentFilter === 'favorites') {
      filtered = filtered.filter(note => note.isFavorite);
    } else if (currentFilter === 'recent') {
      filtered = filtered.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 10);
    } else {
      filtered = filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    return filtered;
  }, [notes, currentFilter]);

  const selectedNote = useMemo(
    () => notes.find(note => note.id === selectedNoteId),
    [notes, selectedNoteId]
  );

  const handleNewNote = () => {
    const newNote = saveNote('Untitled', '');
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (noteToDelete) {
      if (selectedNoteId === noteToDelete.id) {
        setSelectedNoteId(null);
      }
      deleteNote(noteToDelete.id);
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        onNewNote={handleNewNote}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      <div className="flex-1 flex">
        <div className="w-80 border-r border-stone-200 bg-white overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
              {currentFilter === 'recent' ? 'Recent Notes' : currentFilter === 'favorites' ? 'Favorites' : 'All Notes'}
            </h2>
            <div className="space-y-2">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <FileText size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs mt-1">Create your first note to get started</p>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={note.id === selectedNoteId}
                    onClick={() => setSelectedNoteId(note.id)}
                    onDelete={() => handleDeleteClick(note)}
                    onToggleFavorite={() => toggleFavorite(note.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          {selectedNote ? (
            <>
              <Toolbar isSaving={isSaving} />
              <NoteEditor
                note={selectedNote}
                onUpdate={updateNote}
                onSaveStateChange={setIsSaving}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-400">
              <div className="text-center">
                <FileText size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg">Select a note to start editing</p>
                <p className="text-sm mt-2">or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        noteTitle={noteToDelete?.title || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
};
