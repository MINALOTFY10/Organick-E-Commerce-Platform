interface BlogDeleteModalProps {
  blog: { title: string };
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BlogDeleteModal({
  blog,
  loading,
  error,
  onClose,
  onConfirm,
}: BlogDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] w-full max-w-md p-6">
        <h3 className="text-white font-bold mb-4">Delete Blog Post</h3>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <p className="text-gray-300 mb-2">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">&ldquo;{blog.title}&rdquo;</span>?
        </p>
        <p className="text-gray-400 text-sm mb-6">
          This action cannot be undone. All comments and views will be lost.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-[#0f2920] hover:bg-[#1a3d32] py-2.5 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 py-2.5 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}