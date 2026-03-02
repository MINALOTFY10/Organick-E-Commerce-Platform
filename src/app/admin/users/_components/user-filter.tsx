"use client";

import { Search } from "lucide-react";

interface Props {
  stats: {
    all: number;
    customer: number;
    admin: number;
    superAdmin: number;
  }; 
  search: string;
  onSearch: (v: string) => void;
  role: string;
  onRole: (v: string) => void;
}

export function UserFilters({ stats, search, onSearch, role, onRole }: Props) {
  const tabs = [
    { label: "All Users", value: "ALL", count: stats.all },
    { label: "Customers", value: "CUSTOMER", count: stats.customer },
    { label: "Admins", value: "ADMIN", count: stats.admin },
    { label: "Super Admins", value: "SUPER_ADMIN", count: stats.superAdmin },
  ];

  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-5">
      {/* Search */}
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search Users..."
          className="w-full pl-11 pr-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-xl text-white focus:border-[#00ff7f] outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mt-6 border-b border-[#2a4d42] pb-5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onRole(tab.value)}
            className={`px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
              role === tab.value
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
