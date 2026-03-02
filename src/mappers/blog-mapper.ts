import Blog from "@/types/blog";
import type { Blog as PrismaBlog, BlogSection } from "@/generated/prisma/client";

type BlogWithSections = PrismaBlog & { sections?: BlogSection[] };

export function mapRowBlogToBlog(row: BlogWithSections): Blog {
  const dateObj = new Date(row.publishDate);

  return {
    id: row.id,
    heroImage: row.heroImage,
    publishDate: dateObj.toISOString().split('T')[0],
    month: dateObj.toLocaleString("default", { month: "short" }),
    day: dateObj.toLocaleString("default", { day: "2-digit" }),
    author: row.author,
    title: row.title,
    subtitle: row.subtitle,
    sections: row.sections ?? [],
  };
}
