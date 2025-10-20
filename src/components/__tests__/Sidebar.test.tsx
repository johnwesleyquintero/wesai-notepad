import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Sidebar } from "../Sidebar";
import { NoteFilters } from "../../types/note";

describe("Sidebar", () => {
  it("renders the sidebar with navigation items", () => {
    render(
      <Sidebar
        currentFilter={NoteFilters.RECENT}
        onFilterChange={() => {}}
        onNewNote={() => {}}
        onOpenSettings={() => {}}
        isOpen={true}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText("WesAI Notepad")).toBeInTheDocument();
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("All Notes")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("calls onNewNote when the 'New Note' button is clicked", () => {
    const handleNewNote = jest.fn();
    render(
      <Sidebar
        currentFilter={NoteFilters.RECENT}
        onFilterChange={() => {}}
        onNewNote={handleNewNote}
        onOpenSettings={() => {}}
        isOpen={true}
        onClose={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("New Note"));
    expect(handleNewNote).toHaveBeenCalledTimes(1);
  });

  it("calls onFilterChange when a navigation item is clicked", () => {
    const handleFilterChange = jest.fn();
    render(
      <Sidebar
        currentFilter={NoteFilters.RECENT}
        onFilterChange={handleFilterChange}
        onNewNote={() => {}}
        onOpenSettings={() => {}}
        isOpen={true}
        onClose={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Favorites"));
    expect(handleFilterChange).toHaveBeenCalledWith(NoteFilters.FAVORITES);
  });

  it("calls onOpenSettings when the 'Settings' button is clicked", () => {
    const handleOpenSettings = jest.fn();
    render(
      <Sidebar
        currentFilter={NoteFilters.RECENT}
        onFilterChange={() => {}}
        onNewNote={() => {}}
        onOpenSettings={handleOpenSettings}
        isOpen={true}
        onClose={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Settings"));
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("applies the active style to the current filter", () => {
    render(
      <Sidebar
        currentFilter={NoteFilters.ALL}
        onFilterChange={() => {}}
        onNewNote={() => {}}
        onOpenSettings={() => {}}
        isOpen={true}
        onClose={() => {}}
      />,
    );
    const allNotesButton = screen.getByText("All Notes");
    expect(allNotesButton.parentElement).toHaveClass("bg-zinc-900");
  });
});
