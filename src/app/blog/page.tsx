import type { Metadata } from "next";
import { Suspense } from "react";

import SectionHeader from "@/components/section-header";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read our latest articles on organic living, healthy eating, sustainability, and farm-to-table recipes.",
  openGraph: {
    title: "Blog — Organick",
    description:
      "Read our latest articles on organic living, healthy eating, sustainability, and farm-to-table recipes.",
    type: "website",
  },
};
import LoadingPage from "@/components/ui/loading-page";
import BlogView from "./_components/blog-view";

import NewsPageCover from "@/../public/img/news--page-cover.png";
import { mapRowBlogToBlog } from "@/mappers/blog-mapper";
import { getBlogs } from "@/actions/blog-actions";

async function BlogListSection() {
  const blogs = await getBlogs().then((data) => data.blogs.map(mapRowBlogToBlog));
  return <BlogView blogs={blogs} />;
}

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      <div className="">
        <SectionHeader img={NewsPageCover} title="Blog Feed" />
      </div>

      <Suspense fallback={<LoadingPage />}>
        <BlogListSection />
      </Suspense>
    </div>
  );
}
