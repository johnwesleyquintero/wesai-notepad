import { useState, useEffect, useRef } from "react";
import { Note } from "../types/note";
import { Toolbar as NoteToolbar } from "./Toolbar";
import { DEBOUNCE_DELAY_NOTE_EDITOR } from "../utils/constants";
import Slite, { Toolbar, Editor } from "react-slite";
import { AIEnhanceModal } from "./AIEnhanceModal";

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onSaveStateChange: (isSaving: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onBack: () => void;
  onOpenAIEnhanceModal: () => void;
  isAIEnhanceModalOpen: boolean;
  onCloseAIEnhanceModal: () => void;
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
  onOpenAIEnhanceModal,
  isAIEnhanceModalOpen,
  onCloseAIEnhanceModal,
}: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [currentTagInput, setCurrentTagInput] = useState(""); // New state for current tag input
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number>();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setCurrentTagInput(""); // Clear current tag input when note changes
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

  const handleContentChange = (currentMarkdown: string) => {
    setContent(currentMarkdown);
    handleUpdate(title, currentMarkdown, tags);
  };

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      handleUpdate(title, content, newTags);
    }
    setCurrentTagInput(""); // Clear input after adding tag
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentTagInput(value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTagInput.trim() !== "") {
      e.preventDefault(); // Prevent form submission
      addTag(currentTagInput);
    }
    // Handle backspace to remove last tag if input is empty
    if (e.key === "Backspace" && currentTagInput === "" && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      handleUpdate(title, content, newTags);
    }
  };

  const handleTagInputBlur = () => {
    addTag(currentTagInput); // Add tag when input loses focus
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    handleUpdate(title, content, newTags);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleApplyEnhancedContent = (enhancedMarkdown: string) => {
    setContent(enhancedMarkdown);
    handleUpdate(title, enhancedMarkdown, tags);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <NoteToolbar
        isSaving={isSaving}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onBack={onBack}
        onOpenAIEnhanceModal={onOpenAIEnhanceModal}
      />

      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title..."
        className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none px-4 sm:px-8 py-6 placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
      />

      <div className="flex flex-wrap gap-2 px-4 sm:px-8 pb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs px-2 py-1 rounded-full flex items-center"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={currentTagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
          onBlur={handleTagInputBlur}
          placeholder="Add tags..."
          className="flex-grow text-sm text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
          style={{ minWidth: "80px" }} // Ensure input is visible
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Slite
          initialValue={content}
          onChange={handleContentChange}
          readOnly={false}
        >
          <Toolbar />
          <Editor />
        </Slite>
      </div>

      <AIEnhanceModal
        isOpen={isAIEnhanceModalOpen}
        onClose={onCloseAIEnhanceModal}
        content={content}
        onApplyChanges={handleApplyEnhancedContent}
      />
    </div>
  );
};
