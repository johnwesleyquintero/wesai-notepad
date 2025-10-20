import { Plus, Clock, Star, FileText, Settings, X } from "lucide-react";
import { NoteFilter, NoteFilters } from "../types/note";

interface SidebarProps {
  currentFilter: NoteFilter;
  onFilterChange: (filter: NoteFilter) => void;
  onNewNote: () => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({
  currentFilter,
  onFilterChange,
  onNewNote,
  onOpenSettings,
  isOpen,
  onClose,
}: SidebarProps) => {
  const navItems: { id: NoteFilter; label: string; icon: typeof Clock }[] = [
    { id: NoteFilters.RECENT, label: "Recent", icon: Clock },
    { id: NoteFilters.FAVORITES, label: "Favorites", icon: Star },
    { id: NoteFilters.ALL, label: "All Notes", icon: FileText },
  ];

  return (
    <aside
      className={`w-64 bg-stone-50 border-r border-stone-200 flex flex-col h-screen lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
    >
      <div className="p-6 border-b border-stone-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">WesAI Notepad</h1>
        <button onClick={onClose} className="lg:hidden text-stone-600">
          <X size={24} />
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={onNewNote}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Plus size={18} />
          <span className="font-medium">New Note</span>
        </button>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
              currentFilter === id
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-stone-100"
            }`}
          >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-200">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-700 hover:bg-stone-100 transition-colors"
        >
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
