"use client";

import OrderFilters from "./order-filters";
import { useOrderFilters } from "./order-filters-provider";

interface Props {
  stats: {
    all: number;
    pending: number;
    shipped: number;
    completed: number;
    cancelled: number;
  };
}

export default function OrderFiltersView({ stats }: Props) {
  const { search, setSearch, status, setStatus } = useOrderFilters();

  return (
    <OrderFilters
      stats={stats}
      search={search}
      onSearch={setSearch}
      status={status}
      onStatus={setStatus}
    />
  );
}