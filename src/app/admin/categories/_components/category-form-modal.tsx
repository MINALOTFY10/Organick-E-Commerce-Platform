import { X, Check } from "lucide-react";

interface CategoryFormData {
  name: string;
  description: string;
}

interface CategoryFormModalProps {
  open: boolean;
  loading: boolean;
  error: string;
  isEdit: boolean;
  formData: CategoryFormData;
  onChange: (next: CategoryFormData) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CategoryFormModal({
  open,
  loading,
  error,
  isEdit,
  formData,
  onChange,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] w-full max-w-md">
        <div className="p-6 flex justify-between border-b border-[#2a4d42]">
          <h3 className="text-white font-bold">{isEdit ? "Edit" : "Create"} Category</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && <p className="text-red-400">{error}</p>}

          <input
            value={formData.name}
            placeholder="name"
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className="w-full p-2 bg-[#0f2920] border border-[#2a4d42] text-white"
          />

          <textarea
            value={formData.description}
            placeholder="description"
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            className="w-full p-2 bg-[#0f2920] border border-[#2a4d42] text-white"
          />

          <button
            disabled={loading}
            onClick={onSubmit}
            className="w-full bg-[#00ff7f] py-2 rounded-lg"
          >
            {loading ? "Saving..." : <><Check className="w-4 h-4 inline" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}
