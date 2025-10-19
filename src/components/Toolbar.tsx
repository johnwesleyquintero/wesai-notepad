import { useState } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { AIEnhanceModal } from "./AIEnhanceModal";

interface ToolbarProps {
  isSaving: boolean;
  content: string;
  onUpdateContent: (newContent: string) => void;
}

export const Toolbar = ({
  isSaving,
  content,
  onUpdateContent,
}: ToolbarProps) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
        >
          <Sparkles size={18} />
          <span className="font-medium">AI Enhance</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {isSaving ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 size={16} className="animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600">
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
