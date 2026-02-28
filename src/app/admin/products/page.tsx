import { Suspense } from "react";
import { Plus } from "lucide-react";
import { SkeletonStatCards, SkeletonTablePage } from "@/components/ui/skeleton-components";
import { InventoryStatsView } from "./_components/inventory-stats-view";
import ProductTableView from "./_components/product-table-view";
import AdminPageHeader from "@/app/admin/_components/admin-page-header";
import { getInventoryStats, getProductsWithCategories } from "@/actions/product-actions";
import ProductFiltersProvider from "./_components/product-filters-provider";
import ProductFiltersView from "./_components/product-filters-view";

export async function InventoryStatsSection() {
  const stats = await getInventoryStats();
  return <InventoryStatsView stats={stats} />;
}

export async function ProductTableSection() {
  const data = await getProductsWithCategories();
  return <ProductTableView products={data.products} />;
}

export async function ProductToolbarSection() {
  const data = await getProductsWithCategories();

  return <ProductFiltersView categories={data.categories} />;
}

export default async function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductFiltersProvider>
        <AdminPageHeader
          title="Inventory Management"
          subtitle="Manage organic products and stock levels."
          breadcrumb="Home › Inventory"
          actionLabel="Add New Product"
          actionIcon={<Plus className="w-5 h-5" />}
          actionLink="/admin/products/new"
        />

        <Suspense fallback={<SkeletonStatCards count={4} />}>
          <InventoryStatsSection />
        </Suspense>

        <Suspense
          fallback={
            <SkeletonTablePage
              showStats={false}
              showFilters
              tableHeaders={["PRODUCT", "CATEGORY", "PRICE", "STOCK", "STATUS", "ACTIONS"]}
              tableColumns={[{ width: "w-48" }, { width: "w-24" }, { width: "w-16" }, { width: "w-12" }, { width: "w-20" }, { width: "w-20" }]}
            />
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-1">
              <ProductToolbarSection />
            </div>
            <div className="lg:col-span-4">
              <ProductTableSection />
            </div>
          </div>
        </Suspense>
      </ProductFiltersProvider>
    </div>
  );
}
