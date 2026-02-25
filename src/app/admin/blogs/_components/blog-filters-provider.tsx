"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const BlogFilterContext = createContext<{
  search: string;
  setSearch: (v: string) => void;
}>({ search: "", setSearch: () => {} });

export function useBlogFilters() {
  return useContext(BlogFilterContext);
}

export default function BlogFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");

  return (
    <BlogFilterContext.Provider value={{ search, setSearch }}>
      {children}
    </BlogFilterContext.Provider>
  );
}
