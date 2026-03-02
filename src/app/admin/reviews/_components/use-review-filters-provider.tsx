"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const ReviewFilterContext = createContext<{
  search: string;
  setSearch: (v: string) => void;
  reviewStatus: string;
  setReviewStatus: (v: string) => void;
}>({
  search: "",
  setSearch: () => {},
  reviewStatus: "ALL",
  setReviewStatus: () => {},
});

export function useReviewFilters() {
  return useContext(ReviewFilterContext);
}

export default function ReviewFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [reviewStatus, setReviewStatus] = useState("ALL");

  return <ReviewFilterContext.Provider value={{ search, setSearch, reviewStatus, setReviewStatus }}>{children}</ReviewFilterContext.Provider>;
}
