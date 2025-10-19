import { useState, useRef, useEffect } from "react";
import { Tag, Plus, X } from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  onChange: (categories: string[]) => void;
}

export const CategorySelector = ({
  categories = [],
  onChange,
}: CategorySelectorProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      onChange(updatedCategories);
      setNewCategory("");
      setIsAdding(false);
    }
  };

  const handleRemoveCategory = (category: string) => {
    const updatedCategories = categories.filter((c) => c !== category);
    onChange(updatedCategories);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewCategory("");
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Tag size={16} className="mr-2 text-zinc-500 dark:text-zinc-400" />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Categories
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-md text-xs"
          >
            <span>{category}</span>
            <button
              onClick={() => handleRemoveCategory(category)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddCategory}
              className="px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-200"
              placeholder="Add category..."
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-md text-xs text-zinc-700 dark:text-zinc-300"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
