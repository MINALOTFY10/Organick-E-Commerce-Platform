"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Star, X } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { moderateProductReview } from "@/actions/review-actions";
import type { AdminReviewItem } from "@/types/review";

interface Props {
  reviews: AdminReviewItem[];
}

export default function ReviewTable({ reviews }: Props) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleModeration = async (reviewId: string, status: "APPROVED" | "REJECTED") => {
    setPendingId(reviewId);
    await moderateProductReview({ reviewId, status });
    setPendingId(null);
    router.refresh();
  };

  const columns: Column<AdminReviewItem>[] = [
    {
      header: "Product",
      cell: (review) => <p className="text-white font-medium max-w-52 truncate">{review.product.name}</p>,
    },
    {
      header: "Customer",
      cell: (review) => (
        <div>
          <p className="text-white text-sm">{review.user.name}</p>
          <p className="text-gray-400 text-xs">{review.user.email}</p>
        </div>
      ),
    },
    {
      header: "Rating",
      cell: (review) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`w-4 h-4 ${value <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
            />
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (review) => {
        const statusClass =
          review.status === "APPROVED"
            ? "bg-emerald-500/20 text-emerald-300"
            : review.status === "REJECTED"
              ? "bg-red-500/20 text-red-300"
              : "bg-amber-500/20 text-amber-300";
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>{review.status}</span>;
      },
    },
    {
      header: "Review",
      cell: (review) => <p className="text-sm text-gray-300 max-w-md line-clamp-3">{review.comment}</p>,
    },
    {
      header: "Date",
      cell: (review) => (
        <p className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      ),
    },
    {
      header: "Action",
      cell: (review) => (
        <div className="flex items-center gap-2">
          <button
            disabled={pendingId === review.id}
            onClick={(event) => {
              event.stopPropagation();
              handleModeration(review.id, "APPROVED");
            }}
            className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50"
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            disabled={pendingId === review.id}
            onClick={(event) => {
              event.stopPropagation();
              handleModeration(review.id, "REJECTED");
            }}
            className="p-1.5 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50"
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={reviews}
      columns={columns}
      emptyState={<p className="text-gray-400">No reviews found for current filters.</p>}
    />
  );
}