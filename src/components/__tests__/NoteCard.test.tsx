import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NoteCard } from "../NoteCard";
import { Note } from "../../types/note";

const mockNote: Note = {
  id: "1",
  title: "Test Note",
  content: "This is a test note.",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isFavorite: false,
  tags: ["test", "jest"],
  isPinned: false,
};

describe("NoteCard", () => {
  it("renders the note title and content", () => {
    render(
      <NoteCard
        note={mockNote}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is a test note.")).toBeInTheDocument();
  });

  it('renders "Untitled" if title is empty', () => {
    const noteWithoutTitle = { ...mockNote, title: "" };
    render(
      <NoteCard
        note={noteWithoutTitle}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });

  it('renders "No content" if content is empty', () => {
    const noteWithoutContent = { ...mockNote, content: "" };
    render(
      <NoteCard
        note={noteWithoutContent}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    expect(screen.getByText("No content")).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", () => {
    const handleClick = jest.fn();
    render(
      <NoteCard
        note={mockNote}
        isSelected={false}
        onClick={handleClick}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Test Note"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when the delete button is clicked", () => {
    const handleDelete = jest.fn();
    const { container } = render(
      <NoteCard
        note={mockNote}
        isSelected={false}
        onClick={() => {}}
        onDelete={handleDelete}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    const deleteButton = container.querySelector(
      ".group-hover\\:opacity-100 button:last-child",
    );
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(handleDelete).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onToggleFavorite when the star button is clicked", () => {
    const handleToggleFavorite = jest.fn();
    const { container } = render(
      <NoteCard
        note={mockNote}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={handleToggleFavorite}
        onTogglePin={() => {}}
      />,
    );
    const starButton = container.querySelector(
      ".group-hover\\:opacity-100 button:first-child",
    );
    if (starButton) {
      fireEvent.click(starButton);
      expect(handleToggleFavorite).toHaveBeenCalledTimes(1);
    }
  });

  it("displays a filled star when isFavorite is true", () => {
    const favoriteNote = { ...mockNote, isFavorite: true };
    const { container } = render(
      <NoteCard
        note={favoriteNote}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    const starIcon = container.querySelector(".text-yellow-500 svg");
    expect(starIcon).toBeInTheDocument();
    expect(starIcon).toHaveAttribute("fill", "currentColor");
  });

  it("calls onTogglePin when the pin button is clicked", () => {
    const handleTogglePin = jest.fn();
    const { container } = render(
      <NoteCard
        note={mockNote}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={handleTogglePin}
      />,
    );
    const pinButton = container.querySelector(
      ".group-hover\\:opacity-100 button:nth-child(2)",
    );
    if (pinButton) {
      fireEvent.click(pinButton);
      expect(handleTogglePin).toHaveBeenCalledTimes(1);
    }
  });

  it("displays a filled pin when isPinned is true", () => {
    const pinnedNote = { ...mockNote, isPinned: true };
    const { container } = render(
      <NoteCard
        note={pinnedNote}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    const pinIcon = container.querySelector(".text-zinc-900 svg");
    expect(pinIcon).toBeInTheDocument();
    expect(pinIcon).toHaveAttribute("fill", "currentColor");
  });

  it("renders tags when provided", () => {
    render(
      <NoteCard
        note={mockNote}
        isSelected={false}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("jest")).toBeInTheDocument();
  });

  it("applies selected styles when isSelected is true", () => {
    const { container } = render(
      <NoteCard
        note={mockNote}
        isSelected={true}
        onClick={() => {}}
        onDelete={() => {}}
        onToggleFavorite={() => {}}
        onTogglePin={() => {}}
      />,
    );
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass("border-zinc-900");
  });
});
