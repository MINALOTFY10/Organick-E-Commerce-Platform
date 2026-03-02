"use client";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="flex h-9.5 w-65 overflow-hidden rounded-full border border-gray-200 bg-white">
      
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 px-4 text-sm outline-none placeholder:text-gray-500 text-gray-500"
      />

      <button className="flex h-full w-[52px] items-center justify-center bg-(--secondary-color) transition hover:bg-[#6aa57f]">
        <FaSearch size={14} className="text-white" />
      </button>

    </div>
  );
}
