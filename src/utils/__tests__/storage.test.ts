import { storageUtils } from "../storage";
import { Note } from "../../types/note";

describe("storageUtils", () => {
  const MOCK_NOTES_KEY = "wesai_notes";
  let mockNotes: Note[];

  beforeEach(() => {
    localStorage.clear();
    mockNotes = [
      {
        id: "1",
        title: "Test Note 1",
        content: "Content 1",
        createdAt: 1,
        updatedAt: 1,
        isFavorite: false,
        tags: [],
        isPinned: false,
      },
      {
        id: "2",
        title: "Test Note 2",
        content: "Content 2",
        createdAt: 2,
        updatedAt: 2,
        isFavorite: true,
        tags: ["work"],
        isPinned: false,
      },
    ];
  });

  describe("getNotes", () => {
    it("should return an empty array if no notes are in localStorage", () => {
      expect(storageUtils.getNotes()).toEqual([]);
    });

    it("should return parsed notes if they exist in localStorage", () => {
      localStorage.setItem(MOCK_NOTES_KEY, JSON.stringify(mockNotes));
      expect(storageUtils.getNotes()).toEqual(mockNotes);
    });

    it("should handle invalid JSON in localStorage gracefully", () => {
      localStorage.setItem(MOCK_NOTES_KEY, "invalid json");
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      expect(storageUtils.getNotes()).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error loading notes from localStorage:",
        expect.any(Error),
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("saveNotes", () => {
    it("should save notes to localStorage", () => {
      storageUtils.saveNotes(mockNotes);
      expect(localStorage.getItem(MOCK_NOTES_KEY)).toEqual(
        JSON.stringify(mockNotes),
      );
    });

    it("should handle errors during saving gracefully", () => {
      const setItemSpy = jest
        .spyOn(localStorage, "setItem")
        .mockImplementation(() => {
          throw new Error("Quota exceeded");
        });
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      storageUtils.saveNotes(mockNotes);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error saving notes to localStorage:",
        expect.any(Error),
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("generateId", () => {
    it("should generate a unique ID", () => {
      const id1 = storageUtils.generateId();
      const id2 = storageUtils.generateId();
      expect(id1).not.toEqual(id2);
      expect(typeof id1).toBe("string");
      expect(id1).toMatch(/^\d{13}-[a-z0-9]{9}$/); // Basic format check
    });
  });
});
