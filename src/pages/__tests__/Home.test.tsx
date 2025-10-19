import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Home } from "../Home";
import { ThemeProvider } from "../../contexts/ThemeContext";

describe("Home", () => {
  it("renders the Home page with the sidebar and note editor", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>,
    );
    expect(screen.getByText("WesAI Notepad")).toBeInTheDocument();
    expect(
      screen.getByText("Select a note to start editing"),
    ).toBeInTheDocument();
  });

  it("creates a new note when the 'New Note' button is clicked", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText("New Note"));
    expect(screen.getByPlaceholderText("Note title...")).toHaveValue(
      "Untitled",
    );
  });

  it("selects a note when a note card is clicked", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText("New Note"));
    fireEvent.click(screen.getByText("Untitled"));
    expect(screen.getByPlaceholderText("Note title...")).toHaveValue(
      "Untitled",
    );
  });

  it("opens the delete modal when the delete button on a note card is clicked", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText("New Note"));
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Delete Note?")).toBeInTheDocument();
  });

  it("opens the settings modal when the settings button is clicked", () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>,
    );
    const settingsButton = screen.getAllByText("Settings")[0];
    fireEvent.click(settingsButton);
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
  });
});
