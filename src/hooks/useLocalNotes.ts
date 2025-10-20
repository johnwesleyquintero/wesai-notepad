import { useEffect, useRef, useState } from "react";
import { Note } from "../types/note";
import { storageUtils } from "../utils/storage";
import { debounce } from "../utils/debounce";
import { DEBOUNCE_DELAY_SAVE_NOTES } from "../utils/constants";
import { useUndoRedo } from "./useUndoRedo";
import { supabase } from "../utils/supabaseClient";
import { settingsUtils } from "../utils/settings";

export const useLocalNotes = () => {
  const [useSupabase, setUseSupabase] = useState(settingsUtils.getSettings().useSupabase);

  const {
    state: notes,
    setState: setNotes,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (useSupabase) {
        const { data, error } = await supabase.from('notes').select('*');
        if (error) {
          console.error('Error fetching notes from Supabase:', error);
          setNotes(storageUtils.getNotes()); // Fallback to local storage
        } else {
          setNotes(data || []);
        }
      } else {
        setNotes(storageUtils.getNotes());
      }
    };
    fetchNotes();
  }, [useSupabase]);

  const debouncedSaveNotes = useRef(
    debounce(async (updatedNotes: Note[]) => {
      if (useSupabase) {
        // Supabase handles real-time updates, so we might not need to explicitly save all notes here
        // This will be refined as we implement individual CRUD operations for Supabase
      } else {
        storageUtils.saveNotes(updatedNotes);
      }
    }, DEBOUNCE_DELAY_SAVE_NOTES),
  ).current;

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (notes) {
      debouncedSaveNotes(notes);
    }
  }, [notes, useSupabase]);

  const saveNote = async (title: string, content: string): Promise<Note> => {
    let newNote: Note;
    if (useSupabase) {
      const { data, error } = await supabase.from('notes').insert({
        title,
        content,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
        isPinned: false,
      }).select();

      if (error) {
        console.error('Error saving note to Supabase:', error);
        throw error; // Or handle more gracefully
      } else {
        newNote = data[0];
      }
    } else {
      newNote = {
        id: storageUtils.generateId(),
        title,
        content,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
        isPinned: false,
      };
    }

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    return newNote;
  };

  const updateNote = async (
    id: string,
    updates: Partial<Omit<Note, "id" | "createdAt">>,
  ): Promise<void> => {
    if (useSupabase) {
      const { error } = await supabase.from('notes').update({
        ...updates,
        updatedAt: Date.now(),
      }).eq('id', id);

      if (error) {
        console.error('Error updating note in Supabase:', error);
        throw error; // Or handle more gracefully
      }
    }

    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
    );
    setNotes(updatedNotes);
  };

  const deleteNote = async (id: string): Promise<void> => {
    if (useSupabase) {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) {
        console.error('Error deleting note from Supabase:', error);
        throw error; // Or handle more gracefully
      }
    }

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
    setUseSupabase: (value: boolean) => {
      setUseSupabase(value);
      const currentSettings = settingsUtils.getSettings();
      settingsUtils.saveSettings({ ...currentSettings, useSupabase: value });
    },
  };
};
