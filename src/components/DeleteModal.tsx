import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({
  isOpen,
  noteTitle,
  onConfirm,
  onCancel,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
            <AlertTriangle
              size={24}
              className="text-red-600 dark:text-red-400"
              aria-hidden="true"
              role="img"
            />
          </div>
          <h2
            id="delete-modal-title"
            className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Delete Note?
          </h2>
        </div>

        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Are you sure you want to delete "
          <span className="font-medium">{noteTitle || "Untitled"}</span>"? This
          action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
