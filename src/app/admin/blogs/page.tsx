import { Suspense } from "react";
import { SpecificSkeletonPageLayout } from "@/components/ui/skeleton-components";
import { getAdminBlogs } from "@/actions/blog-actions";
import BlogsView from "./_components/blogs-view";
import BlogFiltersProvider from "./_components/blog-filters-provider";

async function BlogsSection() {
  const data = await getAdminBlogs();
  return <BlogsView {...data} />;
}

export default function BlogsPage() {
  return (
    <BlogFiltersProvider>
      <div className="space-y-6">
        <Suspense fallback={<SpecificSkeletonPageLayout statsCards={4} tableRows={8} />}>
          <BlogsSection />
        </Suspense>
      </div>
    </BlogFiltersProvider>
  );
}