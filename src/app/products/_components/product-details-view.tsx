"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { addItemToCart } from "@/actions/cart-actions";
import { submitProductReview, deleteProductReview } from "@/actions/review-actions";
import { ProductReviewItem, ProductReviewSummary } from "@/types/review";
import { formatCents } from "@/lib/constants/currency";
import Link from "next/link";
import ProductItem from "./product-item";
import FavouriteButton from "./favourite-button";

interface ProductProps {
  product: Product;
  relatedProducts?: Product[];
  reviews: ProductReviewItem[];
  reviewSummary: ProductReviewSummary;
  currentUserReview: ProductReviewItem | null;
  isAuthenticated: boolean;
  isFavourited: boolean;
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <Star key={v} className={`${sizes[size]} ${v <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
  APPROVED: "bg-green-50 text-green-600 border border-green-200",
  REJECTED: "bg-red-50 text-red-600 border border-red-200",
};

export default function ProductDetailsView({ product, relatedProducts, reviews, reviewSummary, currentUserReview, isAuthenticated, isFavourited }: ProductProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"description" | "none">("description");
  const [reviewRating, setReviewRating] = useState<number>(currentUserReview?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>(currentUserReview?.comment ?? "");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReview, setDeletingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ success: boolean; message: string } | null>(null);

  const avgRating = reviewSummary.averageRating;
  const totalReviews = reviewSummary.totalReviews;

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittingReview(true);
    setReviewMessage(null);
    const result = await submitProductReview({ productId: product.id, rating: reviewRating, comment: reviewComment });
    setSubmittingReview(false);
    setReviewMessage({ success: result.success, message: result.message });
    if (result.success) router.refresh();
  };

  const handleReviewDelete = async () => {
    if (!confirm("Delete your review? This cannot be undone.")) return;
    setDeletingReview(true);
    setReviewMessage(null);
    const result = await deleteProductReview({ productId: product.id });
    setDeletingReview(false);
    setReviewMessage({ success: result.success, message: result.message });
    if (result.success) {
      setReviewRating(5);
      setReviewComment("");
      router.refresh();
    }
  };

  return (
    <section>
      <div className="max-w-7xl font-sans text-slate-800 mt-10 mx-auto px-4 sm:px-8 lg:px-16 space-y-10">
        {/* ── Product Hero ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start ">
          {/* Image */}
          <div className="relative bg-[#F5F7F5] rounded-3xl flex justify-center items-center overflow-hidden min-h-[380px]">
            <img
              src={product.imageUrl || ""}
              alt={product.name}
              className="w-full max-w-xs h-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col space-y-4">
            {/* In stock and heart badge */}
            <div className="flex items-center justify-between">
              <span
                  className={`inline-flex text-center items-center text-xs font-semibold px-3 py-1 rounded-lg border ${
                    product.stock > 0 ? "border-green-400 text-green-600 bg-green-50" : "border-red-400 text-red-500 bg-red-50"
                  }`}
                >
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </span>
              <FavouriteButton
                productId={product.id}
                isFavourited={isFavourited}
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            {/* Stars + meta */}
            <div className="flex items-center gap-1.5 flex-wrap text-sm text-gray-500">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((v) => (
                  <Star
                    key={v}
                    className={`w-4 h-4 ${v <= Math.round(avgRating) && avgRating > 0 ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`}
                  />
                ))}
              </div>
              <span>{totalReviews > 0 ? `${avgRating.toFixed(1)} (${totalReviews})` : "No reviews yet"}</span>
              <span className="text-gray-300">·</span>
              <span>{product.categoryName}</span>
            </div>

            {/* Price */}
            <div className="pt-1">
              {product.salePrice && product.salePrice > 0 ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-extrabold ">{formatCents(product.salePrice)}</span>
                  <span className="text-lg font-bold text-red-500 line-through">{formatCents(product.price)}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    Save {Math.round((1 - product.salePrice / product.price) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900">{typeof product.price === "number" ? formatCents(product.price) : "N/A"}</span>
              )}
            </div>

            {/* Quantity + Cart */}
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-700 font-bold text-base hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="px-5 py-3 font-semibold text-gray-900 min-w-10 text-center border-x border-gray-300">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 text-gray-700 font-bold text-base hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await addItemToCart(product.id, quantity);
                }}
                disabled={product.stock === 0}
                className="flex-1 min-w-[140px] bg-(--primary-color) text-white font-semibold py-3 px-6 rounded-lg hover:bg-(--primary-color)/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add to cart
              </button>
            </div>

            {/* Product details accordion */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mt-2">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === "description" ? "none" : "description")}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Product details</span>
                {activeTab === "description" ?
                  <ChevronUp size={18} className="text-gray-500" />
                : <ChevronDown size={18} className="text-gray-500" />}
              </button>
              {activeTab === "description" && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  <p className="pt-4">{product.description}</p>
                  {product.additionalInfo && <p className="mt-3 text-gray-500">{product.additionalInfo}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Related Products ─────────────────────────────────── */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related products</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
              {relatedProducts.map((rp) => (
                <ProductItem key={rp.id} product={rp} className="w-[220px] flex-shrink-0" />
              ))}
            </div>
          </div>
        )}

        {/* ── Reviews ──────────────────────────────────────────── */}
        <div className="space-y-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#EFF4F1]">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-(--primary-color)" />
              <h2 className="text-2xl font-bold text-[#2D5356]">Customer Reviews</h2>
            </div>
            {totalReviews > 0 && (
              <div className="flex items-center gap-3 bg-[#F9F8F6] rounded-2xl px-5 py-3">
                <span className="text-4xl font-extrabold text-[#2D5356]">{avgRating.toFixed(1)}</span>
                <div>
                  <StarRating rating={Math.round(avgRating)} size="sm" />
                  <p className="text-xs text-gray-500 mt-0.5">
                    {totalReviews} review{totalReviews === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Write a review */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#2D5356] to-[#3a6b6e] px-6 py-4">
              <h3 className="text-white font-semibold text-lg">{currentUserReview ? "Update Your Review" : "Write a Review"}</h3>
              {currentUserReview?.status && (
                <span className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${STATUS_BADGE[currentUserReview.status] || ""}`}>
                  Status: {currentUserReview.status}
                </span>
              )}
            </div>

            {isAuthenticated ?
              <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
                {/* Star picker */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Your Rating <span className="text-red-400">*</span>
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer transition-transform hover:scale-125"
                        aria-label={`Rate ${value} stars`}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            value <= (hoverRating || reviewRating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-gray-500 font-medium">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hoverRating || reviewRating]}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="review-comment">
                    Your Review <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    minLength={10}
                    maxLength={2000}
                    required
                    className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D5356]/30 focus:border-[#2D5356] transition-all"
                    placeholder="Share your experience with this product (min. 10 characters)..."
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{reviewComment.length}/2000</p>
                </div>

                {reviewMessage && (
                  <div
                    className={`rounded-xl p-3 text-sm font-medium flex items-center gap-2 ${
                      reviewMessage.success ?
                        "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {reviewMessage.success ? "✓" : "✗"} {reviewMessage.message}
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="submit"
                    disabled={submittingReview || deletingReview || reviewComment.trim().length < 10}
                    className="bg-[#2D5356] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2D5356]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md cursor-pointer"
                  >
                    {submittingReview ?
                      "Submitting…"
                    : currentUserReview ?
                      "Update Review"
                    : "Submit Review"}
                  </button>
                  {currentUserReview && (
                    <button
                      type="button"
                      onClick={handleReviewDelete}
                      disabled={submittingReview || deletingReview}
                      className="border-2 border-red-300 text-red-500 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {deletingReview ? "Deleting…" : "Delete Review"}
                    </button>
                  )}
                </div>
              </form>
            : <div className="p-6 flex items-center gap-3 text-gray-500">
                <Star className="w-5 h-5 text-gray-300" />
                <p className="text-sm">
                  Please{" "}
                  <a href="/login" className="text-[#2D5356] font-semibold hover:underline">
                    log in
                  </a>{" "}
                  to write a review.
                </p>
              </div>
            }
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ?
            <div className="text-center py-12 bg-[#F9F8F6] rounded-2xl">
              <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No approved reviews yet.</p>
              <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
            </div>
          : <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D5356] to-[#3a6b6e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2D5356]">{review.userName}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed pl-13">{review.comment}</p>
                </div>
              ))}
            </div>
          }
        </div>

        {/* bottom padding */}
        <div className="h-4" />
      </div>
    </section>
  );
}
