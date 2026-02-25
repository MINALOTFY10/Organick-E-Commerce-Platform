"use client";

import { UserFilters } from "./user-filter";
import { useUserFilters } from "./user-filters-provider";

interface Props {
  stats: {
    all: number;
    customer: number;
    admin: number;
    superAdmin: number;
  };
}

export default function UserFiltersView({ stats }: Props) {
  const { search, setSearch, role, setRole } = useUserFilters();

  return (
    <UserFilters
      stats={stats}
      search={search}
      onSearch={setSearch}
      role={role}
      onRole={setRole}
    />
  );
}
