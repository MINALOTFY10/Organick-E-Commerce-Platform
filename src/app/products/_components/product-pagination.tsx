interface Props {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export default function ProductPagination({
  page,
  totalPages,
  onChange,
}: Props) {
  return (
    <div className="flex justify-center gap-2 items-center">
      {/* Previous Button */}
      <button
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        className={`p-2 rounded-lg font-semibold transition-all duration-300 group ${
          page === 1
            ? "bg-gray-100 65476text-gray-400 cursor-not-allowed"
            : "bg-white border-2 border-[#2D5356] text-[#2D5356] hover:bg-[#2D5356] hover:text-white active:scale-95"
        }`}
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${page > 1 ? 'group-hover:-translate-x-1' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group ${
            page === i + 1
              ? "bg-(--primary-color) text-white shadow-lg scale-110"
              : "bg-gray-100 hover:bg-gray-200 hover:scale-105 active:scale-95"
          }`}
        >
          <span className="relative z-10">{i + 1}</span>
          
          {/* Active page indicator with pulse */}
          {page === i + 1 && (
            <>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
              <span className="absolute -inset-1 bg-[#2D5356]/30 rounded-lg animate-[ping_2s_ease-in-out_infinite]" />
            </>
          )}

          {/* Hover effect */}
          {page !== i + 1 && (
            <span className="absolute inset-0 bg-[#2D5356] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          )}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => page < totalPages && onChange(page + 1)}
        disabled={page === totalPages}
        className={`p-2 rounded-lg font-semibold transition-all duration-300 group ${
          page === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border-2 border-[#2D5356] text-[#2D5356] hover:bg-[#2D5356] hover:text-white active:scale-95"
        }`}
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${page < totalPages ? 'group-hover:translate-x-1' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}