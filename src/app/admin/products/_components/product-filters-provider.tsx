"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PriceRange = [number, number];

export const ProductFilterContext = createContext<{
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  price: PriceRange;
  setPrice: (v: PriceRange) => void;
}>({
  search: "",
  setSearch: () => {},
  category: "all",
  setCategory: () => {},
  price: [0, 1000],
  setPrice: () => {},
});

export function useProductFilters() {
  return useContext(ProductFilterContext);
}

export default function ProductFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState<PriceRange>([0, 1000]);

  return (
    <ProductFilterContext.Provider
      value={{ search, setSearch, category, setCategory, price, setPrice }}
    >
      {children}
    </ProductFilterContext.Provider>
  );
}
