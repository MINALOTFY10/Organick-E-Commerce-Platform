"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function FilterBar({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-xl border">
      {/* Search */}
      <div>
        <label className="block text-sm font-bold mb-2">Search</label>
        <input
          value={searchParams.get("query") ?? ""}
          onChange={(e) => updateFilters("query", e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold mb-2">Category</label>
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateFilters("category", e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Max Price */}
      <div>
        <label className="block text-sm font-bold mb-2">
          Max Price: ${searchParams.get("maxPrice") ?? 1000}
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={searchParams.get("maxPrice") ?? 1000}
          onChange={(e) => updateFilters("maxPrice", e.target.value)}
          className="w-full"
        />
      </div>

      {isPending && (
        <p className="text-xs text-blue-500 animate-pulse">
          Updating results...
        </p>
      )}
    </div>
  );
}
