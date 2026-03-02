import { prisma } from "@/lib/prisma";
import type { AdminReviewItem, ProductReviewItem, ProductReviewSummary, ReviewStatus } from "@/types/review";

interface ReviewWriteInput {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

function clampRating(value: number) {
  return Math.min(5, Math.max(1, Math.trunc(value)));
}

function normalizeComment(comment: string) {
  return comment.trim();
}

export async function findApprovedProductReviews(productId: string): Promise<ProductReviewItem[]> {
  const rows = await prisma.productReview.findMany({
    where: { productId, status: "APPROVED" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    status: row.status as ReviewStatus,
    createdAt: row.createdAt,
    userName: row.user.name,
  }));
}

export async function findProductReviewSummary(productId: string): Promise<ProductReviewSummary> {
  const aggregate = await prisma.productReview.aggregate({
    where: { productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: { _all: true },
  });

  return {
    averageRating: Number(aggregate._avg.rating ?? 0),
    totalReviews: aggregate._count._all,
  };
}

export async function findCurrentUserProductReview(productId: string, userId: string): Promise<ProductReviewItem | null> {
  const row = await prisma.productReview.findUnique({
    where: {
      productId_userId: {
        productId,
        userId,
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    status: row.status as ReviewStatus,
    createdAt: row.createdAt,
    userName: row.user.name,
  };
}

export async function upsertProductReview(input: ReviewWriteInput) {
  const rating = clampRating(input.rating);
  const comment = normalizeComment(input.comment);

  const review = await prisma.productReview.upsert({
    where: {
      productId_userId: {
        productId: input.productId,
        userId: input.userId,
      },
    },
    create: {
      productId: input.productId,
      userId: input.userId,
      rating,
      comment,
      status: "PENDING",
    },
    update: {
      rating,
      comment,
      status: "PENDING",
    },
  });

  return review;
}

export async function findReviewModerationQueue() {
  const reviews = await prisma.productReview.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return reviews.map((row) => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    status: row.status as ReviewStatus,
    createdAt: row.createdAt,
    user: {
      id: row.userId,
      name: row.user.name,
      email: row.user.email,
    },
    product: {
      id: row.productId,
      name: row.product.name,
    },
  })) as AdminReviewItem[];
}

export async function countReviewStats() {
  const [all, pending, approved, rejected] = await Promise.all([
    prisma.productReview.count(),
    prisma.productReview.count({ where: { status: "PENDING" } }),
    prisma.productReview.count({ where: { status: "APPROVED" } }),
    prisma.productReview.count({ where: { status: "REJECTED" } }),
  ]);

  return { all, pending, approved, rejected };
}

export async function updateReviewStatus(reviewId: string, status: ReviewStatus) {
  return prisma.productReview.update({
    where: { id: reviewId },
    data: { status },
    select: { id: true, productId: true },
  });
}

export async function deleteProductReview(productId: string, userId: string) {
  return prisma.productReview.delete({
    where: {
      productId_userId: {
        productId,
        userId,
      },
    },
    select: { id: true, productId: true },
  });
}
