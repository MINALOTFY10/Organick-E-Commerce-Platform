import BlogPost from "@/app/blog/_components/blog-post";
import { mapRowBlogToBlog } from "@/mappers/blog-mapper";
import { Suspense } from "react";
import { getBlogById } from "@/actions/blog-actions";
import LoadingPage from "@/components/ui/loading-page";
import type { Metadata } from "next";
import { findBlogById } from "@/lib/data/blog";

interface PostProps {
  params: Promise<{
    blogSlug: string;
  }>;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { blogSlug } = await params;
  const rawPost = await findBlogById(blogSlug);

  if (!rawPost) {
    return { title: "Post Not Found" };
  }

  const post = mapRowBlogToBlog(rawPost);
  const images = post.heroImage
    ? [{ url: post.heroImage, alt: post.title }]
    : [];

  return {
    title: post.title,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images,
      type: "article",
      publishedTime: new Date(post.publishDate).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
      images: post.heroImage ? [post.heroImage] : [],
    },
  };
}

export async function PostSection({ params }: PostProps) {
  const resolvedParams = await params;
  const blogSlug = resolvedParams.blogSlug;
  const post = await getBlogById(blogSlug).then((data) => mapRowBlogToBlog(data));

  return <BlogPost post={post} />;
}

export default async function Post({ params }: PostProps) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PostSection params={params} />
    </Suspense>
  );
}
