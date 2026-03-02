import { Suspense } from "react";
import { SpecificSkeletonPageLayout } from "@/components/ui/skeleton-components";
import AdminPageHeader from "@/components/admin/admin-page-header";
import OrderFiltersProvider from "@/app/admin/orders/_components/order-filters-provider";
import OrderFiltersView from "@/app/admin/orders/_components/order-filters-view";
import OrderTableView from "@/app/admin/orders/_components/order-table-view";
import { getOrders, getOrderStats } from "@/actions/order-actions";

export async function OrdersSection() {
  const [{ orders }, stats] = await Promise.all([
    getOrders(),
    getOrderStats(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Order Management"
        subtitle={`Manage all your orders in one place. Total orders: ${stats.all}`}
        breadcrumb="Home › Orders"
      />
      <OrderFiltersView stats={stats} />
      <OrderTableView orders={orders} />
    </div>
  );
}

export default async function OrdersPage() {
  return (
    <OrderFiltersProvider>
      <Suspense fallback={<SpecificSkeletonPageLayout statsCards={0} tableRows={10} />}>
        <OrdersSection />
      </Suspense>
    </OrderFiltersProvider>
  );
}
