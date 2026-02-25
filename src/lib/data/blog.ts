/**
 * Data access functions for the Blog domain.
 */

import { prisma } from "@/lib/prisma";
import type { SectionType } from "@/generated/prisma/enums";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BlogSectionInput {
  id?: string;
  type: SectionType;
  content?: string;
  items?: string[];
  order: number;
}

export interface BlogWriteInput {
  title: string;
  subtitle: string;
  author: string;
  heroImage: string;
  sections: BlogSectionInput[];
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** All blogs with sections — used by admin and the public blog list. */
export async function findBlogs() {
  return prisma.blog.findMany({
    include: { sections: { orderBy: { order: "asc" } } },
    orderBy: { publishDate: "desc" },
  });
}

/** Most recent N blogs (no sections) — used by home page widget. */
export async function findRecentBlogs(count = 2) {
  return prisma.blog.findMany({
    take: count,
    orderBy: { publishDate: "desc" },
  });
}

/** Single blog with sections by id. */
export async function findBlogById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
}

/** Blogs matching a text search. */
export async function searchBlogs(query: string) {
  return prisma.blog.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { subtitle: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { sections: { orderBy: { order: "asc" } } },
    orderBy: { publishDate: "desc" },
  });
}

/** Total blog count. */
export async function countBlogs() {
  return prisma.blog.count();
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function createBlog(data: BlogWriteInput) {
  return prisma.blog.create({
    data: {
      title: data.title,
      subtitle: data.subtitle,
      author: data.author,
      heroImage: data.heroImage,
      publishDate: new Date(),
      sections: {
        create: data.sections.map((s) => ({
          type: s.type,
          content: s.content,
          items: s.items ?? [],
          order: s.order,
        })),
      },
    },
  });
}

export async function updateBlog(id: string, data: BlogWriteInput) {
  // Delete all sections and recreate them (simplest correct approach given
  // sections don't have client-stable IDs in the current schema).
  await prisma.blogSection.deleteMany({ where: { blogId: id } });
  return prisma.blog.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle,
      author: data.author,
      heroImage: data.heroImage,
      sections: {
        create: data.sections.map((s) => ({
          type: s.type,
          content: s.content,
          items: s.items ?? [],
          order: s.order,
        })),
      },
    },
  });
}

export async function deleteBlog(id: string) {
  await prisma.blogSection.deleteMany({ where: { blogId: id } });
  return prisma.blog.delete({ where: { id } });
}
