"use client";

import { useMemo } from "react";
import UserTable from "./user-table";
import { useUserFilters } from "./user-filters-provider";
import type { ComponentProps } from "react";

interface Props {
  users: ComponentProps<typeof UserTable>["users"];
}

export default function UserTableView({ users }: Props) {
  const { search, role } = useUserFilters();

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role === "ALL" || u.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  return <UserTable users={filteredUsers} />;
}
