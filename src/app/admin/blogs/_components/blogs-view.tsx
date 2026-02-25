"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBlog, toggleBlogStatus } from "@/actions/blog-actions";
import { FileText, Eye, MessageSquare, TrendingUp, Plus } from "lucide-react";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import AdminPageHeader from "@/components/admin/admin-page-header";
import BlogTableView from "./blog-table-view";
import BlogFiltersView from "./blog-filters-view";
import BlogDeleteModal from "./blog-delete-modal";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "DRAFT" | "PUBLISHED";
  views: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string | null;
  };
  _count: {
    comments: number;
  };
}

interface Props {
  blogs: Blog[];
}

export default function BlogsView({ blogs }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<Blog | null>(null);
  const [error, setError] = useState("");

  const publishedCount = blogs.filter((b) => b.status === "PUBLISHED").length;
  const totalViews = blogs.reduce((sum, b) => sum + b.views, 0);
  const totalComments = blogs.reduce((sum, b) => sum + b._count.comments, 0);

  const cards = [
    {
      label: "Total Blogs",
      value: blogs.length,
      icon: FileText,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Total Comments",
      value: totalComments,
      icon: MessageSquare,
      color: "from-orange-500 to-amber-500",
    },
  ];

  const handleStatusToggle = async (blogId: string) => {
    setIsSubmitting(true);
    const result = await toggleBlogStatus(blogId);
    if (!result.success) {
      setError(result.message);
    } else {
      startTransition(() => router.refresh());
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsSubmitting(true);
    const result = await deleteBlog(deleting.id);
    if (!result.success) {
      setError(result.message);
    } else {
      setDeleting(null);
      startTransition(() => router.refresh());
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <AdminPageHeader
        title="Blog Management"
        subtitle="Create and manage blog posts."
        breadcrumb="Home › Blogs"
        actionLabel="Create Blog"
        actionIcon={<Plus className="w-4 h-4" />}
        actionLink="/admin/blogs/new"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard cards={cards} />
      </div>

      <BlogFiltersView />
      <BlogTableView
        blogs={blogs}
        onStatusToggle={handleStatusToggle}
        onDelete={setDeleting}
        isLoading={isSubmitting || isPending}
      />

      {deleting && (
        <BlogDeleteModal
          blog={deleting}
          loading={isSubmitting || isPending}
          error={error}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}