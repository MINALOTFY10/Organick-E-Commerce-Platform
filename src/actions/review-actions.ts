"use server";

import { revalidatePath } from "next/cache";
import { withAdmin, withAuth } from "@/lib/action-auth";
import { requireAdmin } from "@/lib/auth-utils";
import { tryCatch } from "@/lib/action-utils";
import * as db from "@/lib/data/review";
import type { ActionResult } from "@/types/action-result";
import type { ReviewStatus } from "@/types/review";

function parseRating(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return NaN;
  return Math.trunc(parsed);
}

export async function getApprovedProductReviews(productId: string) {
  return db.findApprovedProductReviews(productId);
}

export async function getProductReviewSummary(productId: string) {
  return db.findProductReviewSummary(productId);
}

export const submitProductReview = withAuth(
  async (
    session,
    payload: { productId: string; rating: number; comment: string },
  ): Promise<ActionResult> =>
    tryCatch(async () => {
      const productId = payload.productId?.trim();
      const rating = parseRating(payload.rating);
      const comment = payload.comment?.trim();

      if (!productId) throw new Error("Product is required.");
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5 stars.");
      }
      if (!comment || comment.length < 10) {
        throw new Error("Review must be at least 10 characters.");
      }
      if (comment.length > 2000) {
        throw new Error("Review is too long (max 2000 characters).");
      }

      await db.upsertProductReview({
        productId,
        userId: session.user.id,
        rating,
        comment,
      });

      revalidatePath(`/products/${productId}`);
      revalidatePath("/admin/reviews");
      return "Review submitted and sent for moderation.";
    }, "Failed to submit review."),
);

export async function getCurrentUserProductReview(productId: string, userId: string) {
  return db.findCurrentUserProductReview(productId, userId);
}

export const deleteProductReview = withAuth(
  async (
    session,
    payload: { productId: string },
  ): Promise<ActionResult> =>
    tryCatch(async () => {
      const productId = payload.productId?.trim();
      if (!productId) throw new Error("Product is required.");

      await db.deleteProductReview(productId, session.user.id);

      revalidatePath(`/products/${productId}`);
      revalidatePath("/admin/reviews");
      return "Review deleted.";
    }, "Failed to delete review."),
);

export async function getReviewModerationQueue() {
  await requireAdmin();
  return db.findReviewModerationQueue();
}

export async function getReviewModerationStats() {
  await requireAdmin();
  return db.countReviewStats();
}

export const moderateProductReview = withAdmin(
  async (
    _session,
    payload: { reviewId: string; status: Exclude<ReviewStatus, "PENDING"> },
  ): Promise<ActionResult> =>
    tryCatch(async () => {
      if (!payload.reviewId?.trim()) throw new Error("Review id is required.");
      if (payload.status !== "APPROVED" && payload.status !== "REJECTED") {
        throw new Error("Invalid moderation status.");
      }

      const updated = await db.updateReviewStatus(payload.reviewId, payload.status);

      revalidatePath("/admin/reviews");
      revalidatePath(`/products/${updated.productId}`);

      return payload.status === "APPROVED" ? "Review approved." : "Review rejected.";
    }, "Failed to moderate review."),
);