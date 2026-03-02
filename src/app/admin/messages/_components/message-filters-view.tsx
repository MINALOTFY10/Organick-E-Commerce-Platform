"use client";

import MessageFilters from "./message-filters";
import { useMessageFilters } from "./message-filters-provider";

export default function MessageFiltersView() {
  const { search, setSearch } = useMessageFilters();

  return <MessageFilters search={search} onSearch={setSearch} />;
}
