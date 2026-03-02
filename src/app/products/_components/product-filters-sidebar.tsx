interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  price: [number, number];
  onPrice: (v: [number, number]) => void;
  categories: { id: string; name: string }[];
  onReset?: () => void;
}

export default function ProductFiltersSidebar({ search, onSearch, category, onCategory, price, onPrice, categories, onReset }: Props) {
  return (
    <aside className="sticky top-24 h-fit bg-white rounded-2xl p-6 shadow-sm space-y-8 animate-[slideInLeft_0.5s_ease-out]">
      <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
        <svg className="w-5 h-5 text-[#2D5356]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </h3>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Search</h4>

        <div className="relative group">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-all duration-300 group-focus-within:text-[#2D5356] group-focus-within:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-xl bg-gray-100 pl-11 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-(--primary-color) transition-all duration-300 focus:scale-105"
          />

          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors animate-[fadeIn_0.3s_ease-out]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-0 left-0 h-0.5 bg-[#2D5356] transition-all duration-300 w-0 group-focus-within:w-full" />
        </div>
      </div>

      <details open className="group/details">
        <summary className="cursor-pointer text-sm font-semibold text-(--primary-color) flex items-center justify-between hover:scale-105 transition-transform list-none">
          <span>Category</span>
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-open/details:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategory(c.name)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 hover:scale-105 ${
                category === c.name ? "bg-(--primary-color) text-white scale-105 shadow-md" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </details>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#2D5356]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Price Range
        </h4>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span className="font-semibold text-[#2D5356]">${price[0]}</span>
            <span className="font-semibold text-[#2D5356]">${price[1]}</span>
          </div>

          <div className="relative pt-2 pb-4">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2" />
            <div 
              className="absolute top-1/2 h-1 bg-[#2D5356] rounded-full -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${(price[0] / 1000) * 100}%`,
                right: `${100 - (price[1] / 1000) * 100}%`
              }}
            />
            
            <input
              type="range"
              min={0}
              max={1000}
              step={1}
              value={price[0]}
              onChange={(e) => onPrice([+e.target.value, price[1]])}
              className="absolute w-full accent-(--primary-color) rounded-lg appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2D5356] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
            />
            <input
              type="range"
              min={0}
              max={1000}
              step={1}
              value={price[1]}
              onChange={(e) => onPrice([price[0], +e.target.value])}
              className="absolute w-full accent-(--primary-color) rounded-lg appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2D5356] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">$</span>
              <input
                type="number"
                value={price[0]}
                onChange={(e) => {
                  const minVal = Math.min(+e.target.value, price[1]);
                  onPrice([minVal, price[1]]);
                }}
                className="w-full rounded-xl border pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary-color) transition-all"
                placeholder="Min"
              />
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">$</span>
              <input
                type="number"
                value={price[1]}
                onChange={(e) => {
                  const maxVal = Math.max(+e.target.value, price[0]);
                  onPrice([price[0], maxVal]);
                }}
                className="w-full rounded-xl border pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary-color) transition-all"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (onReset) {
            onReset();
          } else {
            onSearch("");
            onCategory("all");
            onPrice([0, 1000]);
          }
        }}
        className="w-full rounded-xl border border-gray-200 py-2 text-sm font-semibold hover:bg-gray-100 transition-all cursor-pointer hover:scale-105 active:scale-95 relative overflow-hidden group"
      >
        Reset Filters
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_ease-in-out]" />
      </button>
    </aside>
  );
}