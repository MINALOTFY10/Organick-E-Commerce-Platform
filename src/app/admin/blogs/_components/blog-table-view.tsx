"use client";

import { useMemo } from "react";
import BlogTable from "./blog-table";
import { useBlogFilters } from "./blog-filters-provider";
import { Blog } from "./blogs-view";

interface Props {
  blogs: Blog[];
  onStatusToggle: (id: string) => void;
  onDelete: (blog: Blog) => void;
  isLoading: boolean;
}

export default function BlogTableView({ blogs, onStatusToggle, onDelete, isLoading }: Props) {
  const { search } = useBlogFilters();

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);

  return (
    <BlogTable
      blogs={filteredBlogs}
      onStatusToggle={onStatusToggle}
      onDelete={onDelete}
      isLoading={isLoading}
    />
  );
}
