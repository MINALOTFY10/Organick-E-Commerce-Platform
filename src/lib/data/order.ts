/**
 * Data access functions for the Order domain.
 * Also hosts chart/stats queries that are all order-derived.
 */

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/enums";
import { MONTH_NAMES, CATEGORY_COLORS } from "@/lib/constants/chart";
import type { Prisma } from "@/generated/prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────

export interface FindOrdersParams {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** Paginated, optionally filtered order list for admin. */
export async function findOrders({
  page = 1,
  pageSize = 50,
  status,
  search,
}: FindOrdersParams = {}) {
  const where: Prisma.OrderWhereInput = {
    ...(status && status !== "ALL" ? { status: status as OrderStatus } : {}),
    ...(search
      ? {
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
}

/** Order counts by status — single groupBy query, used by admin order stats widget. */
export async function findOrderStats() {
  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const counts: Record<string, number> = Object.fromEntries(
    grouped.map((g) => [g.status, g._count.id]),
  );
  const all = grouped.reduce((sum, g) => sum + g._count.id, 0);
  return {
    all,
    pending:   counts["PENDING"]   ?? 0,
    shipped:   counts["SHIPPED"]   ?? 0,
    completed: counts["COMPLETED"] ?? 0,
    cancelled: counts["CANCELLED"] ?? 0,
  };
}

/** Monthly sales chart data for the given year.
 *  Uses SQL GROUP BY so only up to 12 rows are returned regardless of order volume.
 */
export async function findMonthlySalesChart(year = new Date().getFullYear()) {
  const yearStart = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year + 1}-01-01`);

  const rows = await prisma.$queryRaw<{ month: number; total: bigint }[]>`
    SELECT EXTRACT(MONTH FROM "createdAt")::int AS month,
           SUM(total)                            AS total
    FROM   "Order"
    WHERE  status = 'COMPLETED'
      AND  "createdAt" >= ${yearStart}
      AND  "createdAt" <  ${yearEnd}
    GROUP BY month
    ORDER BY month
  `;

  const revenueByMonth = new Map(rows.map((r) => [r.month, Number(r.total)]));

  return MONTH_NAMES.map((name, i) => ({
    name,
    total: revenueByMonth.get(i + 1) ?? 0,
  }));
}

/** Revenue totals and per-category breakdown for the given year.
 *  Uses a single SQL GROUP BY rather than fetching all order rows into memory.
 */
export async function findCategoryRevenue(year = new Date().getFullYear()) {
  const yearStart = new Date(`${year}-01-01`);

  const [totalRevenue, grouped, allCategories] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "COMPLETED" },
    }),
    // categoryId is denormalised onto OrderItem at checkout so we can
    // aggregate without joining through Order → OrderItem → Product.
    prisma.$queryRaw<{ categoryId: string; revenue: bigint }[]>`
      SELECT   oi."categoryId",
               SUM(oi.price * oi.quantity) AS revenue
      FROM     "OrderItem" oi
      JOIN     "Order" o ON o.id = oi."orderId"
      WHERE    o.status = 'COMPLETED'
        AND    o."createdAt" >= ${yearStart}
        AND    oi."categoryId" IS NOT NULL
      GROUP BY oi."categoryId"
    `,
    prisma.category.findMany({ select: { id: true, name: true } }),
  ]);

  const revenueMap = new Map(
    grouped.map((g) => [g.categoryId, Number(g.revenue)]),
  );

  const salesByCategory = allCategories
    .map((cat) => ({
      name:  cat.name,
      value: revenueMap.get(cat.id) ?? 0,
      color: CATEGORY_COLORS[cat.name] ?? CATEGORY_COLORS.default,
    }))
    .filter((cat) => cat.value > 0);

  return {
    revenue: Number(totalRevenue._sum.total) || 0,
    salesByCategory,
  };
}

/** Top 5 products by quantity sold. */
export async function findTopProducts() {
  const topRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const productIds = topRaw.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, imageUrl: true, price: true, category: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return topRaw.map((item) => {
    const product = productMap.get(item.productId);
    return {
      name: product?.name,
      imageUrl: product?.imageUrl,
      price: product?.price,
      category: product?.category,
      totalSold: item._sum.quantity ?? 0,
    };
  });
}

/** Aggregate revenue from completed orders. */
export async function findTotalRevenue() {
  const result = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "COMPLETED" },
  });
  return Number(result._sum.total) || 0;
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  trackingNumber?: string,
) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      ...(newStatus === "SHIPPED"
        ? {
            trackingNumber: trackingNumber ?? null,
            shippedAt: new Date(),
          }
        : {}),
    },
  });
}

export async function bulkUpdateOrderStatus(ids: string[], newStatus: OrderStatus) {
  return prisma.order.updateMany({ where: { id: { in: ids } }, data: { status: newStatus } });
}
