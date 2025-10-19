import { renderHook, act } from "@testing-library/react";
import { useLocalNotes } from "../useLocalNotes";
import { storageUtils } from "../../utils/storage";
import { Note } from "../../types/note";

// Mock storageUtils
jest.mock("../../utils/storage", () => ({
  storageUtils: {
    getNotes: jest.fn(),
    saveNotes: jest.fn(),
    generateId: jest.fn(() => "mock-id"),
  },
}));

// Mock debounce to execute immediately for testing purposes
jest.mock("../../utils/debounce", () => ({
  debounce: jest.fn((fn) => fn),
}));

describe("useLocalNotes", () => {
  let mockInitialNotes: Note[];

  beforeEach(() => {
    mockInitialNotes = [
      {
        id: "1",
        title: "Note 1",
        content: "Content 1",
        createdAt: 1,
        updatedAt: 1,
        isFavorite: false,
        categories: [],
      },
      {
        id: "2",
        title: "Note 2",
        content: "Content 2",
        createdAt: 2,
        updatedAt: 2,
        isFavorite: true,
        categories: ["work"],
      },
    ];
    (storageUtils.getNotes as jest.Mock).mockReturnValue(mockInitialNotes);
    (storageUtils.saveNotes as jest.Mock).mockClear();
    (storageUtils.generateId as jest.Mock).mockReturnValue("mock-id");
  });

  it("should load notes from storage on initial render", () => {
    const { result } = renderHook(() => useLocalNotes());
    expect(result.current.notes).toEqual(mockInitialNotes);
    expect(storageUtils.getNotes).toHaveBeenCalledTimes(1);
  });

  it("should save a new note", () => {
    const { result } = renderHook(() => useLocalNotes());
    const newNoteTitle = "New Note";
    const newNoteContent = "New Content";

    act(() => {
      result.current.saveNote(newNoteTitle, newNoteContent);
    });

    const savedNote = result.current.notes.find(
      (note) => note.id === "mock-id",
    );
    expect(result.current.notes.length).toBe(mockInitialNotes.length + 1);
    expect(savedNote?.title).toBe(newNoteTitle);
    expect(savedNote?.content).toBe(newNoteContent);
    expect(storageUtils.saveNotes).toHaveBeenCalledTimes(1);
    expect(storageUtils.saveNotes).toHaveBeenCalledWith(result.current.notes);
  });

  it("should update an existing note", () => {
    const { result } = renderHook(() => useLocalNotes());
    const updatedTitle = "Updated Note 1";

    act(() => {
      result.current.updateNote("1", { title: updatedTitle });
    });

    const updatedNote = result.current.notes.find((note) => note.id === "1");
    expect(updatedNote?.title).toBe(updatedTitle);
    expect(updatedNote?.updatedAt).toBeGreaterThan(1);
    expect(storageUtils.saveNotes).toHaveBeenCalledTimes(1);
    expect(storageUtils.saveNotes).toHaveBeenCalledWith(result.current.notes);
  });

  it("should delete a note", () => {
    const { result } = renderHook(() => useLocalNotes());

    act(() => {
      result.current.deleteNote("1");
    });

    expect(result.current.notes.length).toBe(mockInitialNotes.length - 1);
    expect(
      result.current.notes.find((note) => note.id === "1"),
    ).toBeUndefined();
    expect(storageUtils.saveNotes).toHaveBeenCalledTimes(1);
    expect(storageUtils.saveNotes).toHaveBeenCalledWith(result.current.notes);
  });

  it("should toggle favorite status of a note", () => {
    const { result } = renderHook(() => useLocalNotes());

    act(() => {
      result.current.toggleFavorite("1");
    });
    expect(
      result.current.notes.find((note) => note.id === "1")?.isFavorite,
    ).toBe(true);
    expect(storageUtils.saveNotes).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.toggleFavorite("1");
    });
    expect(
      result.current.notes.find((note) => note.id === "1")?.isFavorite,
    ).toBe(false);
    expect(storageUtils.saveNotes).toHaveBeenCalledTimes(2);
  });

  it("should not toggle favorite if note not found", () => {
    const { result } = renderHook(() => useLocalNotes());
    act(() => {
      result.current.toggleFavorite("non-existent-id");
    });
    expect(storageUtils.saveNotes).not.toHaveBeenCalled();
  });

  it("should provide undo and redo functionality", () => {
    const { result } = renderHook(() => useLocalNotes());

    act(() => {
      result.current.saveNote("Note 3", "Content 3");
    });
    expect(result.current.notes.length).toBe(3);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => {
      result.current.undo();
    });
    expect(result.current.notes.length).toBe(2);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });
    expect(result.current.notes.length).toBe(3);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });
});
