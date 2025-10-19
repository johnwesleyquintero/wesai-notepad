import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AIEnhanceModal } from "../AIEnhanceModal";
import { geminiApi } from "../../utils/geminiApi";

jest.mock("../../utils/geminiApi");

describe("AIEnhanceModal", () => {
  const mockGeminiApi = geminiApi as jest.Mocked<typeof geminiApi>;

  it("renders the modal when isOpen is true", () => {
    render(
      <AIEnhanceModal
        isOpen={true}
        onClose={() => {}}
        content="Test content"
        onApplyChanges={() => {}}
      />,
    );
    expect(screen.getByText("Enhance with AI")).toBeInTheDocument();
  });

  it("does not render the modal when isOpen is false", () => {
    render(
      <AIEnhanceModal
        isOpen={false}
        onClose={() => {}}
        content="Test content"
        onApplyChanges={() => {}}
      />,
    );
    expect(screen.queryByText("Enhance with AI")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const handleClose = jest.fn();
    render(
      <AIEnhanceModal
        isOpen={true}
        onClose={handleClose}
        content="Test content"
        onApplyChanges={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls geminiApi.enhanceText when the enhance button is clicked", async () => {
    mockGeminiApi.enhanceText.mockResolvedValue({
      success: true,
      content: "Enhanced content",
    });
    render(
      <AIEnhanceModal
        isOpen={true}
        onClose={() => {}}
        content="Test content"
        onApplyChanges={() => {}}
      />,
    );

    fireEvent.click(screen.getByText("Enhance"));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockGeminiApi.enhanceText).toHaveBeenCalledWith(
      "Test content",
      "professional",
    );
  });

  it("calls onApplyChanges with the enhanced text when the apply button is clicked", async () => {
    mockGeminiApi.enhanceText.mockResolvedValue({
      success: true,
      content: "Enhanced content",
    });
    const handleApplyChanges = jest.fn();
    render(
      <AIEnhanceModal
        isOpen={true}
        onClose={() => {}}
        content="Test content"
        onApplyChanges={handleApplyChanges}
      />,
    );

    fireEvent.click(screen.getByText("Enhance"));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    fireEvent.click(screen.getByText("Apply Changes"));
    expect(handleApplyChanges).toHaveBeenCalledWith("Enhanced content");
  });
});
