import { geminiApi } from "../geminiApi";
import { settingsUtils } from "../settings";

// Mock settingsUtils to control the API key
jest.mock("../settings", () => ({
  settingsUtils: {
    getSettings: jest.fn(),
  },
}));

describe("geminiApi", () => {
  const mockApiKey = "mock-api-key";

  beforeEach(() => {
    jest.clearAllMocks();
    (settingsUtils.getSettings as jest.Mock).mockReturnValue({
      geminiApiKey: mockApiKey,
    });
  });

  describe("enhanceText", () => {
    it("should return an error if no API key is found", async () => {
      (settingsUtils.getSettings as jest.Mock).mockReturnValue({
        geminiApiKey: "",
      });

      const result = await geminiApi.enhanceText("test text");
      expect(result).toEqual({
        success: false,
        error: "No API key found. Please add your Gemini API key in settings.",
      });
    });

    it("should successfully enhance text with a valid API key and response", async () => {
      const mockEnhancedText = "Enhanced test text.";
      const mockResponse = {
        candidates: [{ content: { parts: [{ text: mockEnhancedText }] } }],
      };

      jest.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await geminiApi.enhanceText("test text", "creative");
      expect(result).toEqual({ success: true, content: mockEnhancedText });
      expect(window.fetch).toHaveBeenCalledTimes(1);
      expect(window.fetch).toHaveBeenCalledWith(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" +
          mockApiKey,
        expect.any(Object),
      );
    });

    it("should return an error if the API response is not ok", async () => {
      const mockErrorMessage = "API error message";
      const mockErrorResponse = { error: { message: mockErrorMessage } };

      jest.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        json: async () => mockErrorResponse,
      } as Response);

      const result = await geminiApi.enhanceText("test text");
      expect(result).toEqual({ success: false, error: mockErrorMessage });
    });

    it("should return a generic error if API response is not ok and no message is provided", async () => {
      jest.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as Response);

      const result = await geminiApi.enhanceText("test text");
      expect(result).toEqual({
        success: false,
        error: "Failed to enhance text. Please try again.",
      });
    });

    it("should return an error if no enhanced text is generated", async () => {
      const mockResponse = { candidates: [{ content: { parts: [] } }] }; // Missing text part

      jest.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await geminiApi.enhanceText("test text");
      expect(result).toEqual({
        success: false,
        error: "No enhanced text was generated. Please try again.",
      });
    });

    it("should handle network errors gracefully", async () => {
      const mockError = new Error("Network error");
      jest.spyOn(window, "fetch").mockRejectedValueOnce(mockError);
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await geminiApi.enhanceText("test text");
      expect(result).toEqual({
        success: false,
        error: "An error occurred while enhancing the text. Please try again.",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error enhancing text:",
        mockError,
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
