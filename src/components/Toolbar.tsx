import {
  Sparkles,
  Check,
  Loader2,
  Undo,
  Redo,
  ChevronLeft,
} from "lucide-react";

interface ToolbarProps {
  isSaving: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onBack: () => void;
  onOpenAIEnhanceModal: () => void;
}

export const Toolbar = ({
  isSaving,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onBack,
  onOpenAIEnhanceModal,
}: ToolbarProps) => {
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
          onClick={onOpenAIEnhanceModal}
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

      <div className="flex items-center gap-3">
        {isSaving && (
          <Loader2
            size={18}
            className="animate-spin text-zinc-500 dark:text-zinc-400"
          />
        )}
        {!isSaving && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <Check size={18} /> Saved
          </span>
        )}
      </div>
    </div>
  );
};
