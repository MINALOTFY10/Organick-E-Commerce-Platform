import { Suspense } from "react";
import { CheckCircle2, Clock3, Star, XCircle } from "lucide-react";
import { SpecificSkeletonPageLayout } from "@/components/ui/skeleton-components";
import { StatsCard } from "@/app/admin/_components/stats-card";
import AdminPageHeader from "@/app/admin/_components/admin-page-header";
import { getReviewModerationQueue, getReviewModerationStats } from "@/actions/review-actions";
import ReviewFiltersProvider from "./_components/use-review-filters-provider";
import ReviewFiltersView from "./_components/review-filters-view";
import ReviewTableView from "./_components/review-table-view";

export async function ReviewsSection() {
  const [reviews, stats] = await Promise.all([
    getReviewModerationQueue(),
    getReviewModerationStats(),
  ]);

  const cards = [
    { label: "Total Reviews", value: stats.all, icon: Star, color: "bg-blue-500/20" },
    { label: "Pending", value: stats.pending, icon: Clock3, color: "bg-amber-500/20" },
    { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "bg-emerald-500/20" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-500/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <AdminPageHeader title="Product Reviews" subtitle="Moderate customer reviews and maintain rating quality." breadcrumb="Home › Reviews" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatsCard cards={cards} />
      </div>

      <ReviewFiltersView stats={stats} />
      <ReviewTableView reviews={reviews} />
    </div>
  );
}

export default async function AdminReviewsPage() {
  return (
    <ReviewFiltersProvider>
      <Suspense fallback={<SpecificSkeletonPageLayout statsCards={4} tableRows={10} />}>
        <ReviewsSection />
      </Suspense>
    </ReviewFiltersProvider>
  );
}
