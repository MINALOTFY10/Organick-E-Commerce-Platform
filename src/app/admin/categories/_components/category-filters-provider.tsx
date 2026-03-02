"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const CategoryFilterContext = createContext<{
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
}>({
  search: "",
  setSearch: () => {},
  filter: "ALL",
  setFilter: () => {},
});

export function useCategoryFilters() {
  return useContext(CategoryFilterContext);
}

export default function CategoryFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  return (
    <CategoryFilterContext.Provider value={{ search, setSearch, filter, setFilter }}>
      {children}
    </CategoryFilterContext.Provider>
  );
}
