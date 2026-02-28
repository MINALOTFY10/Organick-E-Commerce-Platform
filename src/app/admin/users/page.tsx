import { SpecificSkeletonPageLayout } from "@/components/ui/skeleton-components";
import { Suspense } from "react";
import { Shield, Users } from "lucide-react";
import { StatsCard } from "@/app/admin/_components/stats-card";
import UserFiltersProvider from "./_components/user-filters-provider";
import UserFiltersView from "./_components/user-filters-view";
import UserTableView from "./_components/user-table-view";
import { getUsers, getUserRoleStats } from "@/actions/user-actions";

export async function UsersSection() {
  const [{ users }, stats] = await Promise.all([
    getUsers(),
    getUserRoleStats(),
  ]);

  const cards = [
    { label: "Total Users", value: stats.all, icon: Users, color: "bg-blue-500/20" },
    { label: "Customers", value: stats.customer, icon: Users, color: "bg-[#00ff7f]/20" },
    { label: "Admins", value: stats.admin, icon: Shield, color: "bg-yellow-500/20" },
    { label: "Super Admins", value: stats.superAdmin, icon: Shield, color: "bg-red-500/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Users</h2>
        <p className="text-gray-400 mt-1">Manage user accounts ({users.length} users)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard cards={cards} />
      </div>

      <UserFiltersView stats={stats} />
      <UserTableView users={users} />
    </div>
  );
}

export default async function UsersPage() {
  return (
    <UserFiltersProvider>
      <Suspense fallback={<SpecificSkeletonPageLayout statsCards={3} tableRows={10} />}>
        <UsersSection />
      </Suspense>
    </UserFiltersProvider>
  );
}
