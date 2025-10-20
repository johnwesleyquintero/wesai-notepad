import { useState, useEffect } from "react";
import { Sparkles, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { geminiApi } from "../utils/geminiApi";
import useMobile from "../hooks/useMobile";

interface AIEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string; // This will be markdown content
  onApplyChanges: (enhancedMarkdown: string) => void;
}

type ToneOption = {
  id: string;
  label: string;
  description: string;
};

const toneOptions: ToneOption[] = [
  {
    id: "professional",
    label: "Professional",
    description: "Clear, concise, and business-appropriate",
  },
  {
    id: "casual",
    label: "Casual",
    description: "Relaxed, conversational, and friendly",
  },
  {
    id: "academic",
    label: "Academic",
    description: "Formal, precise, and well-structured",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Expressive, vivid, and engaging",
  },
  {
    id: "persuasive",
    label: "Persuasive",
    description: "Compelling, convincing, and action-oriented",
  },
  {
    id: "custom",
    label: "Custom",
    description: "Define your own tone",
  },
];

export const AIEnhanceModal = ({
  isOpen,
  onClose,
  content,
  onApplyChanges,
}: AIEnhanceModalProps) => {
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [customToneInput, setCustomToneInput] = useState<string>("");
  const [enhancedText, setEnhancedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnhanced, setIsEnhanced] = useState<boolean>(false);
  const isMobile = useMobile();

  useEffect(() => {
    if (isOpen) {
      setEnhancedText("");
      setError(null);
      setIsEnhanced(false);
      setCustomToneInput(""); // Clear custom tone input on modal open
    }
  }, [isOpen]);

  const currentTone =
    selectedTone === "custom" ? customToneInput : selectedTone;

  const handleEnhance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await geminiApi.enhanceText(content, currentTone);

      if (result.success && result.content) {
        setEnhancedText(result.content);
        setIsEnhanced(true);
      } else {
        setError(result.error || "Failed to enhance text");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    onApplyChanges(enhancedText);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-2xl ${isMobile ? "max-w-full w-full h-full mx-0 rounded-none flex flex-col" : "max-w-3xl w-full mx-4"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
              <Sparkles
                size={24}
                className="text-zinc-700 dark:text-zinc-300"
              />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Enhance with AI
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 dark:text-zinc-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Select Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {toneOptions.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedTone === tone.id
                      ? "bg-zinc-900 dark:bg-zinc-700 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  <div className="font-medium">{tone.label}</div>
                  <div className="text-xs mt-1 opacity-80">
                    {tone.description}
                  </div>
                </button>
              ))}
            </div>
            {selectedTone === "custom" && (
              <div className="mt-4">
                <label
                  htmlFor="custom-tone-input"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Custom Tone Description
                </label>
                <input
                  id="custom-tone-input"
                  type="text"
                  value={customToneInput}
                  onChange={(e) => setCustomToneInput(e.target.value)}
                  placeholder="e.g., 'witty and sarcastic', 'formal and direct'"
                  className="w-full p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Original Text
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg h-60 overflow-y-auto text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {content || "No content to enhance"}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Enhanced Text
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg h-60 overflow-y-auto text-sm relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2
                      size={24}
                      className="animate-spin text-zinc-500 dark:text-zinc-400"
                    />
                  </div>
                ) : error ? (
                  <div className="text-red-500 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : enhancedText ? (
                  <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {enhancedText}
                  </div>
                ) : (
                  <div className="text-zinc-400 italic">
                    Enhanced text will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEnhance}
            disabled={
              isLoading ||
              !content.trim() ||
              (selectedTone === "custom" && !customToneInput.trim())
            }
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Enhance
          </button>
          <button
            onClick={handleApply}
            disabled={!isEnhanced}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Check size={16} />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
