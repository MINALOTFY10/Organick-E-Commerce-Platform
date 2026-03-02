"use client";

import BlogFilters from "./blog-filters";
import { useBlogFilters } from "./blog-filters-provider";

export default function BlogFiltersView() {
  const { search, setSearch } = useBlogFilters();

  return <BlogFilters search={search} onSearch={setSearch} />;
}
