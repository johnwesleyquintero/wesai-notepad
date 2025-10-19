import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SettingsModal } from "../SettingsModal";
import { ThemeProvider } from "../../contexts/ThemeContext";

describe("SettingsModal", () => {
  it("renders the modal when isOpen is true", () => {
    render(
      <ThemeProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </ThemeProvider>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("does not render the modal when isOpen is false", () => {
    render(
      <ThemeProvider>
        <SettingsModal isOpen={false} onClose={() => {}} />
      </ThemeProvider>,
    );
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const handleClose = jest.fn();
    render(
      <ThemeProvider>
        <SettingsModal isOpen={true} onClose={handleClose} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("updates the API key input field", () => {
    render(
      <ThemeProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </ThemeProvider>,
    );
    const apiKeyInput = screen.getByPlaceholderText(
      "Enter your Gemini API key...",
    ) as HTMLInputElement;
    fireEvent.change(apiKeyInput, { target: { value: "test-api-key" } });
    expect(apiKeyInput.value).toBe("test-api-key");
  });

  it("toggles the API key visibility", () => {
    render(
      <ThemeProvider>
        <SettingsModal isOpen={true} onClose={() => {}} />
      </ThemeProvider>,
    );
    const apiKeyInput = screen.getByPlaceholderText(
      "Enter your Gemini API key...",
    ) as HTMLInputElement;
    expect(apiKeyInput.type).toBe("password");
    const toggleButton = screen.getByTestId("toggle-api-key-visibility");
    fireEvent.click(toggleButton);
    expect(apiKeyInput.type).toBe("text");
  });
});
