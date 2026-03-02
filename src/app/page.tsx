import { Suspense } from "react";
import { getFeaturedProducts, getProductsByCategoryNames } from "@/actions/product-actions";
import { getCategoryNames } from "@/actions/category-actions";

import ProductSectionSkeleton from "./products/_components/product-section-skeleton";
import BannerView from "@/components/home/banner-view";
import CategoriesView from "@/components/home/categories-view";
import OfferBannerView from "@/components/home/offer-banner-view";
import ProductsHomePageView from "@/components/home/products-home-page-view";
import TestimonialCounterView from "@/components/home/testimonial-counter-view";
import AboutView from "@/components/home/about-view";
import OurMissionView from "@/components/home/our-mission-view";
import OfferView from "@/components/home/offer-view";
import BlogsView from "@/components/home/blogs-view";
import NewsletterSection from "@/components/home/news-letter-section";
import { getRecentBlogs } from "@/actions/blog-actions";
import { mapRowBlogToBlog } from "@/mappers/blog-mapper";

export async function ProductsSection() {
  const products = await getFeaturedProducts(8);
  return <ProductsHomePageView products={products} />;
}

export async function CategoriesSection() {
  const categories = await getCategoryNames();
  return <CategoriesView categories={categories} />;
}

export async function OfferSection() {
  const products = await getProductsByCategoryNames(["Dairy", "Meat"], 3);
  return <OfferView products={products} />;
}

export async function BlogsSection() {
  const rowBlogPosts = await getRecentBlogs(2);
  const blogPosts = rowBlogPosts.map(mapRowBlogToBlog);
  return <BlogsView blogs={blogPosts} />;
}

export default async function Home() {
  return (
    <div>
      <BannerView />
      <OfferBannerView />
      <Suspense fallback={<ProductSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>
      {/* <AboutView /> */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <BlogsSection />
      </Suspense>
      <Suspense fallback={<ProductSectionSkeleton />}>
        <OfferSection />
      </Suspense>
      <OurMissionView />
      <TestimonialCounterView />
      <NewsletterSection />
    </div>
  );
}
