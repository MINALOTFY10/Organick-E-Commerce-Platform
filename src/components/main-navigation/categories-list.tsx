"use client";
import { useEffect, useState } from "react";

type Category = { id: string; name: string };

export default function CategoriesList({ onSelect }: { onSelect: (name: string) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setCategories(data ?? []);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!categories.length) {
    return (
      <ul className="py-1">
        <li className="px-3 py-2 text-sm text-(--primary-color)">No categories</li>
      </ul>
    );
  }

  return (
    <ul className="py-1">
      {categories.map((c) => (
        <li key={c.id}>
          <button onClick={() => onSelect(c.name)} className="w-full text-left px-3 py-2 text-sm text-(--primary-color) hover:bg-gray-50">
            {c.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
