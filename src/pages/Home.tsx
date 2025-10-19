import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import { useLocalNotes } from "../hooks/useLocalNotes";
import { Sidebar } from "../components/Sidebar";
import { NoteCard } from "../components/NoteCard";
import { NoteEditor } from "../components/NoteEditor";
import { DeleteModal } from "../components/DeleteModal";
import { SettingsModal } from "../components/SettingsModal";
import { SearchBar } from "../components/SearchBar";
import { Note, NoteFilter, NoteFilters } from "../types/note";
import {
  EMPTY_NOTES_MESSAGE,
  EMPTY_NOTES_SUB_MESSAGE,
  EMPTY_SEARCH_MESSAGE,
  SELECT_NOTE_MESSAGE,
  SELECT_NOTE_SUB_MESSAGE,
} from "../utils/constants";

export const Home = () => {
  const {
    notes,
    saveNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useLocalNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<NoteFilter>(
    NoteFilters.RECENT,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    // Apply filter
    if (currentFilter === NoteFilters.FAVORITES) {
      filtered = filtered.filter((note) => note.isFavorite);
    } else if (currentFilter === NoteFilters.RECENT) {
      filtered = filtered
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 10);
    } else {
      filtered = filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [notes, currentFilter, searchQuery]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId),
    [notes, selectedNoteId],
  );

  const handleNewNote = () => {
    const newNote = saveNote("Untitled", "");
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
            <div className="mb-4">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
              {currentFilter === NoteFilters.RECENT
                ? "Recent Notes"
                : currentFilter === NoteFilters.FAVORITES
                  ? "Favorites"
                  : "All Notes"}
            </h2>
            <div className="space-y-2">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <FileText
                    size={48}
                    className="mx-auto mb-3 opacity-30"
                    aria-hidden="true"
                    role="img"
                  />
                  <p className="text-sm">
                    {searchQuery.trim()
                      ? EMPTY_SEARCH_MESSAGE.replace("{query}", searchQuery)
                      : EMPTY_NOTES_MESSAGE}
                  </p>
                  {!searchQuery.trim() && (
                    <p className="text-xs mt-1">{EMPTY_NOTES_SUB_MESSAGE}</p>
                  )}
                </div>
              ) : (
                filteredNotes.map((note) => (
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

        <div
          className="flex-1 flex flex-col bg-white dark:bg-zinc-900"
          role="main"
        >
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={updateNote}
              onSaveStateChange={() => {}}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-400">
              <div className="text-center">
                <FileText
                  size={64}
                  className="mx-auto mb-4 opacity-20"
                  aria-hidden="true"
                  role="img"
                />
                <p className="text-lg">{SELECT_NOTE_MESSAGE}</p>
                <p className="text-sm mt-2">{SELECT_NOTE_SUB_MESSAGE}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        noteTitle={noteToDelete?.title || ""}
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
