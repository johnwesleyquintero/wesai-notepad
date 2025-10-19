import { Note } from "../types/note";

const NOTES_KEY = "wesai_notes";

export const storageUtils = {
  getNotes(): Note[] {
    try {
      const notes = localStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
      // Optionally, notify user or use a default empty state
      return [];
    }
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
      // Optionally, notify user about save failure
    }
  },

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};
