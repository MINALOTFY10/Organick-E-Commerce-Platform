"use client";

import { ReviewFilters } from "./review-filters";
import { useReviewFilters } from "./use-review-filters-provider";


interface Props {
  stats: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function ReviewFiltersView({ stats }: Props) {
  const { search, setSearch, reviewStatus, setReviewStatus } = useReviewFilters();

  return (
    <ReviewFilters
      stats={stats}
      search={search}
      onSearch={setSearch}
      reviewStatus={reviewStatus}
      setReviewStatus={setReviewStatus}
    />
  );
}
