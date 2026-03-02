/**
 * Data access functions for the Category domain.
 */

import { prisma } from "@/lib/prisma";

// ── Read ──────────────────────────────────────────────────────────────────────

/** All categories with product counts — used by admin category list. */
export async function findCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
  });

  const totalProducts = categories.reduce((s, c) => s + c._count.products, 0);

  return {
    categories,
    stats: {
      totalCategories: categories.length,
      totalProducts,
      avgProducts: categories.length
        ? Math.round(totalProducts / categories.length)
        : 0,
    },
  };
}

/** All categories as id+name pairs — used for select inputs. */
export async function findCategoryNames() {
  return prisma.category.findMany({ select: { id: true, name: true } });
}

/** Count of products in a category — used to guard deletes. */
export async function countProductsInCategory(categoryId: string) {
  return prisma.product.count({ where: { categoryId } });
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function createCategory(data: { name: string; description?: string | null }) {
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: { name: string; description?: string | null },
) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
