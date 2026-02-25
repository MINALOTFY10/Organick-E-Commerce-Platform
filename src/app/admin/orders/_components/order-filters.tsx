"use client";

import { Search } from "lucide-react";

interface Stats {
  all: number;
  pending: number;
  shipped: number;
  completed: number;
  cancelled: number;
}

interface Props {
  stats: Stats;
  search: string;
  onSearch: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
}

export default function OrderFilters({ stats, search, onSearch, status, onStatus }: Props) {
  const tabs = [
    { label: "All Orders", value: "ALL",       count: stats.all },
    { label: "Pending",    value: "PENDING",   count: stats.pending },
    { label: "Shipped",    value: "SHIPPED",   count: stats.shipped },
    { label: "Delivered",  value: "COMPLETED", count: stats.completed },
    { label: "Cancelled",  value: "CANCELLED", count: stats.cancelled },
  ];

  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-5">
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search Order…"
          className="w-full pl-11 pr-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-xl text-white focus:border-[#00ff7f] outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-6 border-b border-[#2a4d42] pb-5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatus(tab.value)}
            className={`px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
              status === tab.value
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
