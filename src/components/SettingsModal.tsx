import { useState, useEffect } from "react";
import { Settings, X, Eye, EyeOff, Save, Moon, Sun } from "lucide-react";
import { AppSettings } from "../types/settings";
import { settingsUtils } from "../utils/settings";
import { useTheme } from "../contexts/useTheme";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const settings = settingsUtils.getSettings();
      setApiKey(settings.geminiApiKey);
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    const settings: AppSettings = {
      geminiApiKey: apiKey.trim(),
    };
    settingsUtils.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-full">
              <Settings size={24} className="text-zinc-700" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-zinc-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-stone-100 dark:bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon size={20} className="text-zinc-700 dark:text-zinc-300" />
              ) : (
                <Sun size={20} className="text-zinc-700 dark:text-zinc-300" />
              )}
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 bg-zinc-900 dark:bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
            >
              {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-2.5 pr-10 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Get your API key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 hover:underline font-medium"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-stone-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-zinc-700 hover:bg-stone-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Save size={18} />
              {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
