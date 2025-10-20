import { useState, useMemo } from "react";
import { FileText, Menu, Plus } from "lucide-react";
import { useLocalNotes } from "../hooks/useLocalNotes";
import { Sidebar } from "../components/Sidebar";
import { NoteCard } from "../components/NoteCard";
import { NoteEditor } from "../components/NoteEditor";
import { DeleteModal } from "../components/DeleteModal";
import { SettingsModal } from "../components/SettingsModal";
import { SearchBar } from "../components/SearchBar";
import { Note, NoteFilter, NoteFilters } from "../types/note";
import useMobile from "../hooks/useMobile";
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
  const [showSidebar, setShowSidebar] = useState(false);

  const isMobile = useMobile();

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
      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-30 w-80 bg-white border-r border-stone-200 transform" : "static inset-auto w-80 border-r border-stone-200 bg-white"}
          ${isMobile ? (showSidebar ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          transition-transform duration-300 ease-in-out
        `}
      >
        <Sidebar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          onNewNote={handleNewNote}
          onOpenSettings={() => setSettingsModalOpen(true)}
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
        />
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Top bar for mobile with menu button */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 bg-white border-b border-stone-200">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-stone-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold">Notes</h1>
            <div></div> {/* Placeholder for potential right-side elements */}
          </div>
        )}

        <div
          className={`flex-1 flex ${isMobile && showSidebar ? "hidden" : "flex"}`}
        >
          {/* Note List Section */}
          {(!isMobile || !selectedNoteId) && (
            <div
              className={`${isMobile ? "w-full" : "w-80"} border-r border-stone-200 bg-white overflow-y-auto`}
            >
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
                        <p className="text-xs mt-1">
                          {EMPTY_NOTES_SUB_MESSAGE}
                        </p>
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
          )}

          {/* Note Editor Section */}
          <div
            className={`flex-1 flex flex-col bg-white dark:bg-zinc-900 ${isMobile && !selectedNoteId ? "hidden" : ""}`}
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
                onBack={() => setSelectedNoteId(null)}
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
      </div>

      {/* Floating Action Button for New Note on mobile */}
      {isMobile && (
        <button
          onClick={handleNewNote}
          className="fixed bottom-6 right-6 bg-zinc-900 text-white p-4 rounded-full shadow-lg hover:bg-zinc-800 transition-colors z-40"
          aria-label="New Note"
        >
          <Plus size={24} />
        </button>
      )}

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
