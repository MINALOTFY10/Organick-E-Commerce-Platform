/**
 * Data access functions for admin-level User/system statistics.
 */

import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FindUsersParams {
  page?: number;
  pageSize?: number;
  role?: string;
  search?: string;
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** High-level count stats for the admin dashboard overview. */
export async function findAdminDashboardStats() {
  const [userCount, orderCount, blogsCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.blog.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "COMPLETED" },
    }),
  ]);

  return {
    users: userCount,
    orders: orderCount,
    blogs: blogsCount,
    revenue: Number(totalRevenue._sum.total) || 0,
  };
}

/** User counts grouped by role — single DB query, no JS filtering. */
export async function findUserRoleStats() {
  const grouped = await prisma.user.groupBy({
    by: ["role"],
    _count: { id: true },
  });

  const counts: Record<string, number> = Object.fromEntries(
    grouped.map((g) => [g.role, g._count.id]),
  );
  const all = grouped.reduce((sum, g) => sum + g._count.id, 0);

  return {
    all,
    customer:   counts["CUSTOMER"]    ?? 0,
    admin:      counts["ADMIN"]       ?? 0,
    superAdmin: counts["SUPER_ADMIN"] ?? 0,
  };
}

/** Paginated user list with order counts — used by admin user table.
 *  Filtering is kept light here; for small admin user-sets client-side
 *  filtering over a capped result is acceptable. Convert to server-side
 *  URL-param filtering (like the products page) when user count grows.
 */
export async function findUsers({
  page = 1,
  pageSize = 200,
}: FindUsersParams = {}) {
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);

  return { users, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
}

// ── Write ─────────────────────────────────────────────────────────────────────

export interface UpdateUserInput {
  name?: string;
  role?: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  emailVerified?: boolean;
}

/** Update a user's profile / role. */
export async function updateUser(id: string, data: UpdateUserInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

/** Delete a single user. */
export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}

/** Delete multiple users by id. */
export async function bulkDeleteUsers(ids: string[]) {
  return prisma.user.deleteMany({ where: { id: { in: ids } } });
}
