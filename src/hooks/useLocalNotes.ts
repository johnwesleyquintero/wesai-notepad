import { useEffect, useRef } from "react";
import { Note } from "../types/note";
import { storageUtils } from "../utils/storage";
import { debounce } from "../utils/debounce";
import { DEBOUNCE_DELAY_SAVE_NOTES } from "../utils/constants";
import { useUndoRedo } from "./useUndoRedo";

export const useLocalNotes = () => {
  const {
    state: notes,
    setState: setNotes,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<Note[]>([]);

  const debouncedSaveNotes = useRef(
    debounce((updatedNotes: Note[]) => {
      storageUtils.saveNotes(updatedNotes);
    }, DEBOUNCE_DELAY_SAVE_NOTES),
  ).current;

  useEffect(() => {
    const loadedNotes = storageUtils.getNotes();
    setNotes(loadedNotes, { skipHistory: true }); // Load initial notes without adding to undo history
  }, [setNotes]);

  useEffect(() => {
    debouncedSaveNotes(notes);
  }, [notes, debouncedSaveNotes]);

  const saveNote = (title: string, content: string): Note => {
    const newNote: Note = {
      id: storageUtils.generateId(),
      title,
      content,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
      isPinned: false,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    return newNote;
  };

  const updateNote = (
    id: string,
    updates: Partial<Omit<Note, "id" | "createdAt">>,
  ): void => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
    );
    setNotes(updatedNotes);
  };

  const deleteNote = (id: string): void => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  const toggleFavorite = (id: string): void => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote(id, { isFavorite: !note.isFavorite });
    }
  };

  const togglePin = (id: string): void => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote(id, { isPinned: !note.isPinned });
    }
  };

  return {
    notes,
    saveNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    togglePin,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
