import { Suspense } from "react";
import { SpecificSkeletonPageLayout } from "@/components/ui/skeleton-components";
import { getCategories } from "@/actions/category-actions";
import CategoriesView from "./_components/categories-view";
import CategoryFiltersProvider from "./_components/category-filters-provider";

async function CategoriesSection() {
  const data = await getCategories();
  return <CategoriesView {...data} />;
}

export default function CategoriesPage() {
  return (
    <CategoryFiltersProvider>
      <div className="space-y-6">
        <Suspense fallback={<SpecificSkeletonPageLayout statsCards={3} tableRows={10} />}>
          <CategoriesSection />
        </Suspense>
      </div>
    </CategoryFiltersProvider>
  );
}
