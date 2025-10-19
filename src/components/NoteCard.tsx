import { Star, Trash2 } from 'lucide-react';
import { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export const NoteCard = ({
  note,
  isSelected,
  onClick,
  onDelete,
  onToggleFavorite
}: NoteCardProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPreview = (content: string) => {
    const cleanContent = content.trim();
    return cleanContent.length > 120 ? cleanContent.slice(0, 120) + '...' : cleanContent;
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all group ${
        isSelected
          ? 'border-zinc-900 bg-white shadow-md'
          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-zinc-900 flex-1 truncate">
          {note.title || 'Untitled'}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-1.5 rounded hover:bg-stone-100 transition-colors ${
              note.isFavorite ? 'text-yellow-500' : 'text-zinc-400'
            }`}
          >
            <Star size={16} fill={note.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-sm text-zinc-600 mb-3 line-clamp-2">
        {getPreview(note.content) || 'No content'}
      </p>

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{formatDate(note.updatedAt)}</span>
        {note.isFavorite && (
          <Star size={12} fill="currentColor" className="text-yellow-500" />
        )}
      </div>
    </div>
  );
};
