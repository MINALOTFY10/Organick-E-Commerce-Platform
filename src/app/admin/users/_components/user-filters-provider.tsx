"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const UserFilterContext = createContext<{
  search: string;
  setSearch: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
}>({
  search: "",
  setSearch: () => {},
  role: "ALL",
  setRole: () => {},
});

export function useUserFilters() {
  return useContext(UserFilterContext);
}

export default function UserFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");

  return <UserFilterContext.Provider value={{ search, setSearch, role, setRole }}>{children}</UserFilterContext.Provider>;
}
