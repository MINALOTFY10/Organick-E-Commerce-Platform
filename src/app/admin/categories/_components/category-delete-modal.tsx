import type { Category } from "./categories-view";

interface CategoryDeleteModalProps {
  category: Category;
  loading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CategoryDeleteModal({
  category,
  loading,
  error,
  onClose,
  onConfirm,
}: CategoryDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] w-full max-w-md p-6">
        <h3 className="text-white font-bold mb-4">Delete Category</h3>

        {error && <p className="text-red-400">{error}</p>}

        <p className="text-gray-300 mb-6">
          Delete <span className="text-white">{category.name}</span>?
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-[#0f2920] py-2 text-white">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 bg-red-500 py-2 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
