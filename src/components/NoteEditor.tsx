import { useState, useEffect, useRef } from "react";
import { Note } from "../types/note";
import { Toolbar } from "./Toolbar";
import { DEBOUNCE_DELAY_NOTE_EDITOR } from "../utils/constants";

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onSaveStateChange: (isSaving: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onBack: () => void;
}

export const NoteEditor = ({
  note,
  onUpdate,
  onSaveStateChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onBack,
}: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number>();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
  }, [note.id, note.title, note.content, note.tags]);

  const handleUpdate = (
    newTitle: string,
    newContent: string,
    newTags: string[],
  ) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    onSaveStateChange(true);

    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(note.id, {
        title: newTitle,
        content: newContent,
        tags: newTags,
        isPinned: note.isPinned,
      });
      setIsSaving(false);
      onSaveStateChange(false);
    }, DEBOUNCE_DELAY_NOTE_EDITOR);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    handleUpdate(newTitle, content, tags);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    handleUpdate(title, newContent, tags);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTags = e.target.value
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    setTags(newTags);
    handleUpdate(title, content, newTags);
  };

  const handleUpdateContent = (newContent: string) => {
    setContent(newContent);
    handleUpdate(title, newContent, tags);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full">
      <Toolbar
        isSaving={isSaving}
        content={content}
        onUpdateContent={handleUpdateContent}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onBack={onBack}
      />

      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title..."
        className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none px-4 sm:px-8 py-6 placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
      />

      <input
        type="text"
        value={tags.join(", ")}
        onChange={handleTagsChange}
        placeholder="Tags (comma separated)"
        className="text-sm text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none px-4 sm:px-8 pb-2 placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
      />

      <div className="flex flex-wrap gap-2 px-4 sm:px-8 pb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 text-base text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none px-4 sm:px-8 py-4 resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600 leading-relaxed"
      />
    </div>
  );
};
