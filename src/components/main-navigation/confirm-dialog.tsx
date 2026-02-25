interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div 
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4 animate-[fadeInUp_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dialog-title" className="font-bold text-xl text-(--primary-color)">{title}</h3>
        <p id="confirm-dialog-message" className="text-sm text-gray-500 mt-3">{message}</p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium cursor-pointer focus-visible:ring-2 focus-visible:ring-(--secondary-color)"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors font-medium cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;