import { settingsUtils } from "../settings";
import { AppSettings } from "../../types/settings";

describe("settingsUtils", () => {
  const MOCK_SETTINGS_KEY = "wesai_settings";
  const mockSettings: AppSettings = {
    geminiApiKey: "test-api-key",
    useSupabase: false,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("getSettings", () => {
    it("should return default settings if no settings are in localStorage", () => {
      expect(settingsUtils.getSettings()).toEqual({ geminiApiKey: "" });
    });

    it("should return parsed settings if they exist in localStorage", () => {
      localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(mockSettings));
      expect(settingsUtils.getSettings()).toEqual(mockSettings);
    });

    it("should handle invalid JSON in localStorage gracefully", () => {
      localStorage.setItem(MOCK_SETTINGS_KEY, "invalid json");
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      expect(settingsUtils.getSettings()).toEqual({ geminiApiKey: "" });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to load settings:",
        expect.any(Error),
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("saveSettings", () => {
    it("should save settings to localStorage", () => {
      settingsUtils.saveSettings(mockSettings);
      expect(localStorage.getItem(MOCK_SETTINGS_KEY)).toEqual(
        JSON.stringify(mockSettings),
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

      settingsUtils.saveSettings(mockSettings);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to save settings:",
        expect.any(Error),
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("hasApiKey", () => {
    it("should return true if an API key is present", () => {
      localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(mockSettings));
      expect(settingsUtils.hasApiKey()).toBe(true);
    });

    it("should return false if API key is empty", () => {
      localStorage.setItem(
        MOCK_SETTINGS_KEY,
        JSON.stringify({ geminiApiKey: "" }),
      );
      expect(settingsUtils.hasApiKey()).toBe(false);
    });

    it("should return false if API key is only whitespace", () => {
      localStorage.setItem(
        MOCK_SETTINGS_KEY,
        JSON.stringify({ geminiApiKey: "   " }),
      );
      expect(settingsUtils.hasApiKey()).toBe(false);
    });

    it("should return false if no settings are present", () => {
      expect(settingsUtils.hasApiKey()).toBe(false);
    });
  });
});
