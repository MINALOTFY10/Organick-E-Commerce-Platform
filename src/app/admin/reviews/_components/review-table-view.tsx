"use client";

import { useMemo } from "react";
import ReviewTable from "./review-table";
import { useReviewFilters } from "./use-review-filters-provider";
import type { AdminReviewItem } from "@/types/review";

interface Props {
  reviews: AdminReviewItem[];
}

export default function ReviewTableView({ reviews }: Props) {
  const { search, reviewStatus } = useReviewFilters();

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.product.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = reviewStatus === "ALL" || r.status === reviewStatus;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, reviewStatus]);

  return <ReviewTable reviews={filteredReviews} />;
}
