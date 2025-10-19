import { useState, useEffect } from "react";
import { Note } from "../types/note";
import { storageUtils } from "../utils/storage";

export const useLocalNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadedNotes = storageUtils.getNotes();
    setNotes(loadedNotes);
  }, []);

  const saveNote = (title: string, content: string): Note => {
    const newNote: Note = {
      id: storageUtils.generateId(),
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
      categories: [],
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    storageUtils.saveNotes(updatedNotes);
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
    storageUtils.saveNotes(updatedNotes);
  };

  const deleteNote = (id: string): void => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    storageUtils.saveNotes(updatedNotes);
  };

  const toggleFavorite = (id: string): void => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote(id, { isFavorite: !note.isFavorite });
    }
  };

  return {
    notes,
    saveNote,
    updateNote,
    deleteNote,
    toggleFavorite,
  };
};
