"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const MessageFilterContext = createContext<{
  search: string;
  setSearch: (v: string) => void;
}>({ search: "", setSearch: () => {} });

export function useMessageFilters() {
  return useContext(MessageFilterContext);
}

export default function MessageFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");

  return (
    <MessageFilterContext.Provider value={{ search, setSearch }}>
      {children}
    </MessageFilterContext.Provider>
  );
}
