import type { Metadata } from "next";
import { Suspense } from "react";
import { getFilteredProducts } from "@/actions/product-actions";
import { getCategoryNames } from "@/actions/category-actions";
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
  searchParams: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
  };
}

async function ProductsSection({ params }: { params: PageProps["searchParams"] }) {

  const filters = {
    search: params.search || "",
    category: params.category || "all",
    minPrice: params.minPrice ? Number(params.minPrice) : 0,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : 1000,
    sortBy: (params.sortBy || "featured") as SortBy,
  };
  const currentPage = params.page ? Number(params.page) : 1;

  let products = [] as any[];
  let totalPages = 0;
  let categories: { id: string; name: string }[] = [];

  if (filters.category && filters.category !== "all") {
    const results = await getFilteredProducts({
      search: filters.search || undefined,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy,
      page: currentPage,
    });
    products = results.products;
    totalPages = results.totalPages;
    categories = results.categories;
  } else {
    // Provide category list so the UI can show available categories, but do not return product data.
    categories = await getCategoryNames();
  }

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
  const params = await props.searchParams;
  const categoryTitle = params.category || "Our Collection";
  return (
    <>
      <SectionHeader img={ShopBannerImg} title={categoryTitle}/>
      <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-6 md:px-10 lg:px-20 mt-8 md:mt-11">
        <Suspense fallback={<LoadingPage />}>
          <ProductsSection params={params} />
        </Suspense>
      </div>
    </>
  );
}
