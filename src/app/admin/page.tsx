import { Suspense } from "react";
import CategoryPieChartSkeleton from "@/components/admin/skeletons/category-pie-chart-skeleton";
import { SkeletonStatCards } from "@/components/ui/skeleton-components";
import { SkeletonChart } from "@/components/ui/skeleton-components";
import { SkeletonTable } from "@/components/ui/skeleton-components";
import { getUserStats } from "@/actions/user-actions";
import { StatsCard } from "@/app/admin/_components/stats-card";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { formatCents } from "@/lib/constants/currency";
import { getCategoriesStats, getChartData, getTopProducts } from "@/actions/admin-stats-actions";
import { SalesOverview } from "@/app/admin/_components/sales-overview";
import { CategoryPieChart } from "@/app/admin/_components/charts";
import { CategoriesDynamicLegend } from "@/app/admin/_components/categories-dynamic-legend";
import TopSellingProducts from "@/app/admin/_components/top-selling-products";

export interface CategoriesStatsType {
  salesByCategory: { name: string; value: number; color: string }[];
  revenue: number;
}

export async function StatsCardSection() {
  const stats = await getUserStats();
  const cards = [
    { label: "Total Sales", value: formatCents(stats.revenue), icon: DollarSign, color: "from-green-500 to-emerald-500", trend: "+15%" },
    { label: "New Orders", value: stats.orders, icon: ShoppingBag, color: "from-blue-500 to-cyan-500", trend: "+3%" },
    { label: "Active Users", value: stats.users, icon: Users, color: "from-orange-500 to-amber-500", trend: "+5%" },
    { label: "Blogs", value: stats.blogs, icon: TrendingUp, color: "from-purple-500 to-pink-500", trend: "+12%" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard cards={cards} />
    </div>
  );
}

export async function SalesOverviewSection() {
  const chartData = await getChartData();
  return <SalesOverview chartData={chartData} />;
}

export async function CategoryPieChartSection() {
  const CategoriesStats: CategoriesStatsType = await getCategoriesStats();

  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6">
      <h3 className="text-xl font-bold text-white mb-6">Sales by Category</h3>
      <div className="flex justify-center mb-6">
        <CategoryPieChart data={CategoriesStats.salesByCategory} />
      </div>
      <CategoriesDynamicLegend stats={CategoriesStats} />
    </div>
  );
}

export async function TopSellingProductsSection() {
  const TopProducts = await getTopProducts();
  return <TopSellingProducts TopProducts={TopProducts} />;
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
      <Suspense fallback={<SkeletonStatCards count={4} />}>
        <StatsCardSection />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        <Suspense fallback={<SkeletonChart showControls title="Sales" />}>
          <SalesOverviewSection />
        </Suspense>

        <Suspense fallback={<CategoryPieChartSkeleton />}>
          <CategoryPieChartSection />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <SkeletonTable
            headers={["PRODUCT", "CATEGORY", "PRICE", "SOLD", "STATUS"]}
            rows={5}
            columns={[{ width: "w-48" }, { width: "w-24" }, { width: "w-16" }, { width: "w-10" }, { width: "w-16" }]}
          />
        }
      >
        <TopSellingProductsSection />
      </Suspense>
    </div>
  );
}
