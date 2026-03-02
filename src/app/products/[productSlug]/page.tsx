import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getRelatedProducts } from "@/actions/product-actions";
import {
  getApprovedProductReviews,
  getCurrentUserProductReview,
  getProductReviewSummary,
} from "@/actions/review-actions";
import { checkIsFavourited } from "@/actions/favourite-actions";
import { mapRowProductToProduct } from "@/mappers/product-mapper";
import LoadingPage from "@/components/ui/loading-page";
import ProductDetailsView from "@/app/products/_components/product-details-view";
import { getServerSession } from "@/lib/auth-utils";

export async function generateMetadata(
  { params }: { params: Promise<{ productSlug: string }> }
): Promise<Metadata> {
  const { productSlug } = await params;
  const rawProduct = await getProductById(productSlug);

  if (!rawProduct) {
    return { title: "Product Not Found" };
  }

  const product = mapRowProductToProduct(rawProduct);
  const images = product.imageUrl
    ? [{ url: product.imageUrl, alt: product.name }]
    : [];

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: product.name,
      description: product.summary,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.summary,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export async function ProjectDetailsSection({ productSlug }: { productSlug: string }) {
  // Fetch product first so we can pass its categoryId to the related-products
  // query, eliminating a redundant second DB lookup inside findRelatedProducts.
  const rawProduct = await getProductById(productSlug);
  if (!rawProduct) notFound();

  const session = await getServerSession();

  const [rawRelated, reviews, reviewSummary, currentUserReview, isFavourited] = await Promise.all([
    getRelatedProducts(productSlug, rawProduct.categoryId),
    getApprovedProductReviews(productSlug),
    getProductReviewSummary(productSlug),
    session?.user?.id ? getCurrentUserProductReview(productSlug, session.user.id) : Promise.resolve(null),
    session?.user?.id ? checkIsFavourited(session.user.id, productSlug) : Promise.resolve(false),
  ]);

  const product = mapRowProductToProduct(rawProduct);
  const relatedProducts = rawRelated.map(mapRowProductToProduct);

  return (
    <ProductDetailsView
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
      reviewSummary={reviewSummary}
      currentUserReview={currentUserReview}
      isAuthenticated={Boolean(session?.user?.id)}
      isFavourited={isFavourited}
    />
  );
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const resolvedParams = await params;
  const productSlug = resolvedParams.productSlug;

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProjectDetailsSection productSlug={productSlug} />
    </Suspense>
  );
}
