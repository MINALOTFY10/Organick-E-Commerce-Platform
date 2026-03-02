export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProductReviewItem {
  id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
  userName: string;
}

export interface ProductReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export interface AdminReviewItem {
  id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
  product: { id: string; name: string };
  user: { id: string; name: string; email: string };
}