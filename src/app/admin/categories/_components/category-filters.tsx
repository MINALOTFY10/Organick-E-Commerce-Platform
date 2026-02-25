"use client";

import { Search } from "lucide-react";

interface Props {
  totalCategories: number;
  hasProducts: number;
  empty: number;
  search: string;
  onSearch: (v: string) => void;
  filter: string;
  onFilter: (v: string) => void;
}

export default function CategoryFilters({ totalCategories, hasProducts, empty, search, onSearch, filter, onFilter }: Props) {
  const tabs = [
    { label: "All",          value: "ALL",          count: totalCategories },
    { label: "Has Products", value: "HAS_PRODUCTS",  count: hasProducts },
    { label: "Empty",        value: "EMPTY",         count: empty },
  ];

  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-5">
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-11 pr-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-xl text-white focus:border-[#00ff7f] outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-6 border-b border-[#2a4d42] pb-5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilter(tab.value)}
            className={`px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
              filter === tab.value
                ? "bg-[#00ff7f] text-black"
                : "text-gray-400 bg-[#0d2820]/50 hover:bg-[#0d2820]"
            }`}
          >
            {tab.label}
            <span className="text-[10px] opacity-70">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
