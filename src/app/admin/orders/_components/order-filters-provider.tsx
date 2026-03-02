"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Create context to share filter state between sections
export const OrderFilterContext = createContext<{
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
}>({
  search: "",
  setSearch: () => {},
  status: "ALL",
  setStatus: () => {},
});

export function useOrderFilters() {
  return useContext(OrderFilterContext);
}

interface Props {
  children: ReactNode;
}

export default function OrderFiltersProvider({ children }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  return (
    <OrderFilterContext.Provider value={{ search, setSearch, status, setStatus }}>
      {children}
    </OrderFilterContext.Provider>
  );
}