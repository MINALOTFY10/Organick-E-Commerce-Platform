"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearch: (v: string) => void;
}

export default function BlogFilters({ search, onSearch }: Props) {
  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-5">
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search blogs..."
          className="w-full pl-11 pr-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-xl text-white focus:border-[#00ff7f] outline-none"
        />
      </div>
    </div>
  );
}
