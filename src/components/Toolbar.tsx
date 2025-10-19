import { Sparkles, Check, Loader2 } from 'lucide-react';

interface ToolbarProps {
  isSaving: boolean;
}

export const Toolbar = ({ isSaving }: ToolbarProps) => {
  return (
    <div className="border-b border-stone-200 bg-white px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed"
          title="AI features coming soon"
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
    </div>
  );
};
