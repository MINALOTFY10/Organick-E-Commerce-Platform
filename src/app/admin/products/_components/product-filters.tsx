"use client";

import { Search, RotateCcw } from "lucide-react";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  price: [number, number];
  onPrice: (v: [number, number]) => void;
  categories: { id: string; name: string }[];
}

export function ProductFilters({ 
  search, onSearch, category, onCategory, 
  price, onPrice, categories 
}: Props) {
  return (
    <aside className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-5 space-y-6 h-fit">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Filters</h3>
        <button 
          onClick={() => {
            onSearch("");
            onCategory("all");
            onPrice([0, 1000]);
          }}
          className="text-[#00ff7f] text-xs flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase font-bold">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white text-sm focus:outline-none focus:border-[#00ff7f]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase font-bold">Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategory("all")}
            className={`px-3 py-1 rounded-md text-xs transition ${
              category === "all" ? "bg-[#00ff7f] text-black" : "bg-[#0d2820] text-white hover:bg-[#2a4d42]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategory(cat.name)}
              className={`px-3 py-1 rounded-md text-xs transition ${
                category === cat.name ? "bg-[#00ff7f] text-black" : "bg-[#0d2820] text-white hover:bg-[#2a4d42]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase font-bold">Price Range</label>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-xs text-white">
            <span>${price[0]}</span>
            <span>${price[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            value={price[1]}
            onChange={(e) => onPrice([price[0], +e.target.value])}
            className="w-full accent-[#00ff7f] bg-[#0d2820] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex gap-2">
             <input
                type="number"
                value={price[0]}
                onChange={(e) => onPrice([Math.min(+e.target.value, price[1]), price[1]])}
                className="w-1/2 bg-[#0d2820] border border-[#2a4d42] rounded p-1.5 text-xs text-white"
             />
             <input
                type="number"
                value={price[1]}
                onChange={(e) => onPrice([price[0], Math.max(+e.target.value, price[0])])}
                className="w-1/2 bg-[#0d2820] border border-[#2a4d42] rounded p-1.5 text-xs text-white"
             />
          </div>
        </div>
      </div>
    </aside>
  );
}