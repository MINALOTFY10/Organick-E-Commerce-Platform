/**
 * Data access functions for customer-facing order queries.
 */

import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FindUserOrdersParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** Paginated orders for a specific customer, newest first. */
export async function findUserOrders({
  userId,
  page = 1,
  pageSize = 10,
}: FindUserOrdersParams) {
  const where = { userId };

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, imageUrl: true },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
}

/** Single order with full details, scoped to user for security. */
export async function findUserOrderById(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, imageUrl: true, price: true },
          },
        },
      },
      address: true,
    },
  });
}
