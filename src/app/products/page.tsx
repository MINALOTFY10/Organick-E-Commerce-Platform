import type { Metadata } from "next";
import { Suspense } from "react";
import { getFilteredProducts } from "@/actions/product-actions";
import { getUserFavourites } from "@/actions/favourite-actions";
import { getServerSession } from "@/lib/auth-utils";

import SectionHeader from "@/components/section-header";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our full range of fresh, certified organic products. Filter by category, price, and more.",
  openGraph: {
    title: "Shop — Organick",
    description:
      "Browse our full range of fresh, certified organic products. Filter by category, price, and more.",
    type: "website",
  },
};
import ShopBannerImg from "@/../public/img/ShopBanner.png";
import LoadingPage from "@/components/ui/loading-page";
import ProductPageView, { SortBy } from "./_components/products-page-view";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
  }>;
}

async function ProductsSection({ searchParams }: { searchParams: PageProps["searchParams"] }) {
  const params = await searchParams;

  const filters = {
    search: params.search || "",
    category: params.category || "all",
    minPrice: params.minPrice ? Number(params.minPrice) : 0,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : 1000,
    sortBy: (params.sortBy || "featured") as SortBy,
  };
  const currentPage = params.page ? Number(params.page) : 1;

  const { products, totalPages, categories } = await getFilteredProducts({
    search: filters.search || undefined,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy,
    page: currentPage,
  });

  const session = await getServerSession();
  const favouritedIds: string[] = session?.user?.id
    ? (await getUserFavourites(session.user.id)).map((f) => f.product.id)
    : [];

  return (
    <ProductPageView
      products={products}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
      filters={filters}
      favouritedIds={favouritedIds}
      />
  );
}

export default async function ProductsPage(props: PageProps) {
  return (
    <>
      <SectionHeader img={ShopBannerImg} title="Our Collection" />
      <div className="px-4 sm:px-10 lg:px-20 mt-11">
        <Suspense fallback={<LoadingPage />}>
          <ProductsSection searchParams={props.searchParams} />
        </Suspense>
      </div>
    </>
  );
}
