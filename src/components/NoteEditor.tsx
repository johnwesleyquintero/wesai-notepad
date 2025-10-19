import { useState, useEffect, useRef } from 'react';
import { Note } from '../types/note';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onSaveStateChange: (isSaving: boolean) => void;
}

export const NoteEditor = ({ note, onUpdate, onSaveStateChange }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  const handleUpdate = (newTitle: string, newContent: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    onSaveStateChange(true);

    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(note.id, { title: newTitle, content: newContent });
      onSaveStateChange(false);
    }, 3000);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    handleUpdate(newTitle, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    handleUpdate(title, newContent);
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
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title..."
        className="text-3xl font-bold text-zinc-900 bg-transparent border-none outline-none px-8 py-6 placeholder:text-zinc-300"
      />

      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 text-base text-zinc-700 bg-transparent border-none outline-none px-8 py-4 resize-none placeholder:text-zinc-300 leading-relaxed"
      />
    </div>
  );
};
