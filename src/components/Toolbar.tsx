import { useState } from "react";
import {
  Sparkles,
  Check,
  Loader2,
  Undo,
  Redo,
  ChevronLeft,
} from "lucide-react";
import { AIEnhanceModal } from "./AIEnhanceModal";

interface ToolbarProps {
  isSaving: boolean;
  content: string;
  onUpdateContent: (newContent: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onBack: () => void;
}

export const Toolbar = ({
  isSaving,
  content,
  onUpdateContent,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onBack,
}: ToolbarProps) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="lg:hidden p-2 rounded-lg text-zinc-700 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
        >
          <Sparkles size={18} />
          <span className="font-medium hidden sm:inline">AI Enhance</span>
        </button>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo
              ? "text-zinc-700 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
          }`}
        >
          <Undo size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo
              ? "text-zinc-700 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
          }`}
        >
          <Redo size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {isSaving ? (
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Loader2 size={16} className="animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Check size={16} />
            <span>Saved</span>
          </div>
        )}
      </div>

      <AIEnhanceModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        content={content}
        onApplyChanges={onUpdateContent}
      />
    </div>
  );
};
