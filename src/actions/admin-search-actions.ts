"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: "product" | "order" | "user" | "blog" | "message";
  href: string;
}

/**
 * Global admin search across products, orders, users, blogs, and messages.
 * Returns up to 5 results per category for speed.
 */
export async function globalSearch(query: string): Promise<SearchResult[]> {
  await requireAdmin();

  const q = query.trim();
  if (!q || q.length < 2) return [];
  // Limit search query length to prevent expensive ILIKE queries
  if (q.length > 100) return [];

  const [products, orders, users, blogs, messages] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, price: true },
      take: 5,
    }),

    prisma.order.findMany({
      where: {
        OR: [
          { id: { contains: q, mode: "insensitive" } },
          { user: { name: { contains: q, mode: "insensitive" } } },
          { user: { email: { contains: q, mode: "insensitive" } } },
        ],
      },
      select: { id: true, status: true, total: true, user: { select: { name: true } } },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),

    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true, role: true },
      take: 5,
    }),

    prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { subtitle: { contains: q, mode: "insensitive" } },
          { author: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true, author: true },
      take: 5,
    }),

    prisma.contactMessage.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { message: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, fullName: true, email: true },
      take: 5,
    }),
  ]);

  const results: SearchResult[] = [];

  for (const p of products) {
    results.push({
      id: p.id,
      title: p.name,
      subtitle: `$${(p.price / 100).toFixed(2)}`,
      category: "product",
      href: `/admin/products`,
    });
  }

  for (const o of orders) {
    results.push({
      id: o.id,
      title: `Order #${o.id.slice(0, 8)}`,
      subtitle: `${o.user?.name ?? "Unknown"} — ${o.status}`,
      category: "order",
      href: `/admin/orders`,
    });
  }

  for (const u of users) {
    results.push({
      id: u.id,
      title: u.name,
      subtitle: `${u.email} — ${u.role}`,
      category: "user",
      href: `/admin/users`,
    });
  }

  for (const b of blogs) {
    results.push({
      id: b.id,
      title: b.title,
      subtitle: `by ${b.author}`,
      category: "blog",
      href: `/admin/blogs`,
    });
  }

  for (const m of messages) {
    results.push({
      id: m.id,
      title: m.fullName,
      subtitle: m.email,
      category: "message",
      href: `/admin/messages`,
    });
  }

  return results;
}
