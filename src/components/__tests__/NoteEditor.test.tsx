import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NoteEditor } from "../NoteEditor";
import { Note } from "../../types/note";

const mockNote: Note = {
  id: "1",
  title: "Test Note",
  content: "This is a test note.",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isFavorite: false,
  categories: ["test", "jest"],
};

describe("NoteEditor", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the note title and content", () => {
    render(
      <NoteEditor
        note={mockNote}
        onUpdate={() => {}}
        onSaveStateChange={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
        onBack={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText("Note title...")).toHaveValue(
      "Test Note",
    );
    expect(screen.getByPlaceholderText("Start writing...")).toHaveValue(
      "This is a test note.",
    );
  });

  it("calls onUpdate when the title is changed", () => {
    const handleUpdate = jest.fn();
    render(
      <NoteEditor
        note={mockNote}
        onUpdate={handleUpdate}
        onSaveStateChange={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
        onBack={() => {}}
      />,
    );

    const titleInput = screen.getByPlaceholderText("Note title...");
    fireEvent.change(titleInput, { target: { value: "New Title" } });

    act(() => {
      jest.runAllTimers();
    });

    expect(handleUpdate).toHaveBeenCalledWith("1", {
      title: "New Title",
      content: "This is a test note.",
    });
  });

  it("calls onUpdate when the content is changed", () => {
    const handleUpdate = jest.fn();
    render(
      <NoteEditor
        note={mockNote}
        onUpdate={handleUpdate}
        onSaveStateChange={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
        onBack={() => {}}
      />,
    );

    const contentTextarea = screen.getByPlaceholderText("Start writing...");
    fireEvent.change(contentTextarea, {
      target: { value: "New Content" },
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(handleUpdate).toHaveBeenCalledWith("1", {
      title: "Test Note",
      content: "New Content",
    });
  });

  it("calls onSaveStateChange with true and false", () => {
    const handleSaveStateChange = jest.fn();
    render(
      <NoteEditor
        note={mockNote}
        onUpdate={() => {}}
        onSaveStateChange={handleSaveStateChange}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
        onBack={() => {}}
      />,
    );
    const titleInput = screen.getByPlaceholderText("Note title...");
    fireEvent.change(titleInput, { target: { value: "New Title" } });

    expect(handleSaveStateChange).toHaveBeenCalledWith(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(handleSaveStateChange).toHaveBeenCalledWith(false);
  });
});
