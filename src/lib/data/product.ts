/**
 * Data access functions for the Product domain.
 *
 * These functions are purely concerned with reading and writing product data.
 * Auth and business logic live in the action layer.
 */

import { prisma } from "@/lib/prisma";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/inventory";
import { mapRowProductToProduct } from "@/mappers/product-mapper";
import { toCents } from "@/lib/constants/currency";
import type { Product as UiProduct } from "@/types/product";
import type { Prisma } from "@/generated/prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductWriteInput {
  name: string;
  description: string;
  summary: string;
  price: string | number;
  salePrice?: string | number | null;
  stock: string | number;
  imageUrl?: string | null;
  categoryId: string;
  additionalInfo?: string | null;
}

export type ProductSortBy = "featured" | "price_asc" | "price_desc" | "best_rated";

export interface ProductFilterParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortBy;
  page?: number;
  pageSize?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseNumber(value: string | number, field: string): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) throw new Error(`Invalid ${field}`);
  return num;
}

function normalizeOptionalText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function buildProductData(formData: ProductWriteInput) {
  const name = formData.name?.trim();
  const description = formData.description?.trim();
  const summary = formData.summary?.trim();
  const categoryId = formData.categoryId?.trim();

  if (!name || !description || !summary || !categoryId) {
    throw new Error("Missing required product fields");
  }

  const price = toCents(formData.price);
  const rawSalePrice = formData.salePrice;
  const salePrice =
    rawSalePrice != null && rawSalePrice !== "" && rawSalePrice !== 0
      ? toCents(rawSalePrice)
      : null;
  const stock = Math.trunc(parseNumber(formData.stock, "stock"));

  return {
    name,
    description,
    summary,
    price,
    salePrice,
    stock,
    imageUrl: normalizeOptionalText(formData.imageUrl),
    categoryId,
    additionalInfo: normalizeOptionalText(formData.additionalInfo),
  };
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** All products with their category — used by admin product list. */
export async function findProductsWithCategories() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ select: { id: true, name: true } }),
  ]);
  return { products, categories };
}

/** All products mapped to the UI type — used by public product listing. */
export async function findProducts(): Promise<UiProduct[]> {
  const rows = await prisma.product.findMany({ include: { category: true } });
  return rows.map(mapRowProductToProduct);
}

/** Most recent N products — used by the home page hero section. */
export async function findFeaturedProducts(take = 8): Promise<UiProduct[]> {
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take,
  });
  return rows.map(mapRowProductToProduct);
}

/** Products from specific categories, up to `takePerCategory` each.
 *  Used by the home page offer section (e.g. 2 Dairy + 2 Meat).
 */
export async function findProductsByCategoryNames(
  categoryNames: string[],
  takePerCategory = 2,
): Promise<UiProduct[]> {
  const rows = await prisma.product.findMany({
    where: { category: { name: { in: categoryNames } } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Group by category and take N from each to guarantee balanced representation
  const grouped = new Map<string, typeof rows>();
  for (const row of rows) {
    const catName = row.category.name;
    const group = grouped.get(catName) ?? [];
    if (group.length < takePerCategory) {
      group.push(row);
      grouped.set(catName, group);
    }
  }

  return [...grouped.values()].flat().map(mapRowProductToProduct);
}

/** Filtered and paginated product list — used by the public /products page. */
export async function findFilteredProducts(params: ProductFilterParams = {}) {
  const {
    search,
    category,
    minPrice = 0,
    maxPrice = 1000,
    sortBy = "featured",
    page = 1,
    pageSize = 12,
  } = params;

  const where: Prisma.ProductWhereInput = {
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    ...(category && category !== "all" ? { category: { name: category } } : {}),
    price: { gte: minPrice * 100, lte: maxPrice * 100 },
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === "price_asc"
      ? { price: "asc" }
      : sortBy === "price_desc"
        ? { price: "desc" }
        : sortBy === "best_rated"
          ? { reviews: { _count: "desc" } }
          : { createdAt: "desc" }; // "featured" — newest first

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ select: { id: true, name: true } }),
  ]);

  return {
    products: products.map(mapRowProductToProduct),
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    categories,
  };
}

/** Single product by id, including category (raw Prisma row). */
export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

/** Products in the same category, excluding the given product.
 *  Pass `categoryId` when already available at the call site to avoid a
 *  redundant first-trip lookup.
 */
export async function findRelatedProducts(
  productId: string,
  categoryId?: string,
  take = 4,
) {
  const catId =
    categoryId ??
    (await prisma.product.findUnique({
      where:  { id: productId },
      select: { categoryId: true },
    }))?.categoryId;

  if (!catId) return [];

  return prisma.product.findMany({
    where: { categoryId: catId, id: { not: productId } },
    include: { category: true },
    take,
  });
}

/** Inventory stats for admin dashboard — single conditional-aggregation query. */
export async function findInventoryStats() {
  type Row = { total: bigint; in_stock: bigint; low_stock: bigint; out_of_stock: bigint };
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT
      COUNT(*)                                                             AS total,
      COUNT(*) FILTER (WHERE stock > ${LOW_STOCK_THRESHOLD})               AS in_stock,
      COUNT(*) FILTER (WHERE stock > 0 AND stock < ${LOW_STOCK_THRESHOLD}) AS low_stock,
      COUNT(*) FILTER (WHERE stock = 0)                                    AS out_of_stock
    FROM "Product"
  `;
  const row = rows[0];
  return {
    totalProductsCount: Number(row.total),
    inStock:    Number(row.in_stock),
    lowStock:   Number(row.low_stock),
    outOfStock: Number(row.out_of_stock),
  };
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function createProduct(data: ReturnType<typeof buildProductData>) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: ReturnType<typeof buildProductData>) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function bulkDeleteProducts(ids: string[]) {
  return prisma.product.deleteMany({ where: { id: { in: ids } } });
}
