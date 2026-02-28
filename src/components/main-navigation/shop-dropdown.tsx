"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Category = { id: string; name: string };

export default function ShopDropdown({ setMenuOpen }: { setMenuOpen?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname?.startsWith("/products");

  // fetch categories for dropdown
  useEffect(() => {
    let mounted = true;
    fetch(`/api/categories`)
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

  const onToggle = () => setOpen((s) => !s);

  const onSelect = (name: string) => {
    setOpen(false);
    setMenuOpen?.(false);
    // navigate to products filtered by category name
    router.push(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-current={isActive ? "page" : undefined}
        className={`text-[15px] font-bold transition-colors duration-200 py-3 lg:py-0 relative group inline-flex items-center gap-2 ${
          isActive ? "text-(--secondary-color)" : "text-(--primary-color) hover:text-(--secondary-color)"
        }`}
        type="button"
      >
        <span className="relative inline-flex items-center gap-2 cursor-pointer">
          Shop
          <ChevronDown size={14} />
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-(--secondary-color) transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg">
          <ul className="p-2">
            {categories.map((c) => (
              <li key={c.id}>
                <button onClick={() => onSelect(c.name)} className="w-full text-left px-3 py-2 text-sm text-(--primary-color) hover:bg-gray-50 cursor-pointer">
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
