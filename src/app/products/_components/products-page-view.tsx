"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductGrid from "@/app/products/_components/product-grid";
import ProductFiltersSidebar from "@/app/products/_components/product-filters-sidebar";
import ProductPagination from "@/app/products/_components/product-pagination";
import { Product } from "@/types/product";

export type SortBy = "featured" | "price_asc" | "price_desc" | "best_rated";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "best_rated", label: "Best Rated" },
];

interface Props {
  products: Product[];
  categories: { id: string; name: string }[];
  totalPages: number;
  currentPage: number;
  filters: {
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    sortBy: SortBy;
  };
  favouritedIds: string[];
}

export default function ProductPageView({
  products,
  categories,
  totalPages,
  currentPage,
  filters,
  favouritedIds,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(filters.search);
  const [price, setPrice] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  // Sync local state when URL-driven filter values change (e.g. reset)
  useEffect(() => setSearch(filters.search), [filters.search]);
  useEffect(
    () => setPrice([filters.minPrice, filters.maxPrice]),
    [filters.minPrice, filters.maxPrice]
  );

  // Build a new query string and navigate
  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset to page 1 when any filter (not page) changes
      if (!("page" in updates)) {
        params.delete("page");
      }

      Object.entries(updates).forEach(([key, value]) => {
        const v = String(value);
        const isDefault =
          (key === "search" && v === "") ||
          (key === "category" && (v === "all" || v === "")) ||
          (key === "minPrice" && (v === "0" || v === "")) ||
          (key === "maxPrice" && (v === "1000" || v === "")) ||
          (key === "sortBy" && (v === "featured" || v === "")) ||
          (key === "page" && (v === "1" || v === ""));

        if (isDefault) {
          params.delete(key);
        } else {
          params.set(key, v);
        }
      });

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname]
  );

  // Debounce search → URL (400 ms)
  useEffect(() => {
    const id = setTimeout(() => {
      if (search !== filters.search) {
        updateParams({ search });
      }
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Debounce price → URL (400 ms)
  useEffect(() => {
    const id = setTimeout(() => {
      if (price[0] !== filters.minPrice || price[1] !== filters.maxPrice) {
        updateParams({ minPrice: price[0], maxPrice: price[1] });
      }
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  const handleReset = useCallback(() => {
    setSearch("");
    setPrice([0, 1000]);
    router.push(pathname);
  }, [router, pathname]);

  return (
    <div className="gap-10">
      {/* <ProductFiltersSidebar
        search={search}
        onSearch={setSearch}
        category={filters.category}
        onCategory={(c) => updateParams({ category: c })}
        price={price}
        onPrice={setPrice}
        categories={categories}
        onReset={handleReset}
      /> */}

      <div className="space-y-10">
        <ProductGrid products={products} favouritedIds={favouritedIds} />
        {totalPages > 1 && (
          <ProductPagination
            page={currentPage}
            totalPages={totalPages}
            onChange={(p) => updateParams({ page: p })}
          />
        )}
      </div>
    </div>
  );
}
