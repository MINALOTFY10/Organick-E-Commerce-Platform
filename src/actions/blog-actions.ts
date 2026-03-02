"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { withAdmin } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import * as db from "@/lib/data/blog";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import type { ActionResult } from "@/types/action-result";
import type { BlogWriteInput } from "@/lib/data/blog";

// ── Public queries ────────────────────────────────────────────────────────────

export async function getBlogs() {
  const blogs = await db.findBlogs();
  return { blogs };
}

export async function getRecentBlogs(count = 2) {
  return db.findRecentBlogs(count);
}

export async function getBlogById(id: string) {
  const blog = await db.findBlogById(id);
  if (!blog) notFound();
  return blog;
}

export async function searchBlogs(query: string) {
  return db.searchBlogs(query);
}

export async function getBlogStats() {
  const total = await db.countBlogs();
  return {
    total,
    published: total, // All blogs are treated as published until a status field is added
    draft: 0,
    views: 0,         // Not tracked in schema yet
  };
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getAdminBlogs() {
  await requireAdmin();
  const blogs = await db.findBlogs();

  // Adapt DB rows to the shape the admin UI expects.
  // Fields marked TODO should be added to the schema (see architecture review).
  const transformedBlogs = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    // TODO: store slug in schema — computed slugs break on title edit
    slug: blog.title.toLowerCase().replace(/\s+/g, "-"),
    excerpt: blog.subtitle,
    // TODO: add status field to Blog model
    status: "PUBLISHED" as const,
    // TODO: add views field to Blog model
    views: 0,
    createdAt: blog.publishDate,
    updatedAt: blog.publishDate,
    author: { name: blog.author },
    // TODO: add comments relation
    _count: { comments: 0 },
  }));

  return { blogs: transformedBlogs };
}

// ── Admin mutations (decorated) ───────────────────────────────────────────────

export const createBlog = withAdmin(
  async (_session, data: BlogWriteInput): Promise<ActionResult> =>
    tryCatch(async () => {
      await db.createBlog(data);
      revalidatePath("/admin/blogs");
      return "Blog created successfully.";
    }, "Failed to create blog."),
);

export const updateBlog = withAdmin(
  async (_session, id: string, data: BlogWriteInput): Promise<ActionResult> =>
    tryCatch(async () => {
      await db.updateBlog(id, data);
      revalidatePath("/admin/blogs");
      revalidatePath(`/admin/blogs/${id}/edit`);
      return "Blog updated successfully.";
    }, "Failed to update blog."),
);

export const deleteBlog = withAdmin(
  async (_session, id: string): Promise<ActionResult> =>
    tryCatch(async () => {
      await db.deleteBlog(id);
      revalidatePath("/admin/blogs");
      return "Blog deleted successfully.";
    }, "Failed to delete blog."),
);

export const toggleBlogStatus = withAdmin(
  async (_session, _id: string): Promise<ActionResult> => {
    // TODO: implement once Blog.status is added to the schema.
    return { success: false, message: "Blog status toggling is not yet implemented." };
  },
);