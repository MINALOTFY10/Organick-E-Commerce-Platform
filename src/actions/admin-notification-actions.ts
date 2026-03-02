"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/inventory";

export interface Notification {
  id: string;
  type: "order" | "user" | "low_stock" | "message";
  title: string;
  description: string;
  href: string;
  time: string;
}

/**
 * Fetch recent admin notifications:
 * - Recent orders (last 24h)
 * - New users (last 24h)
 * - Low stock products
 * - Recent contact messages (last 24h)
 */
export async function getAdminNotifications(): Promise<{
  notifications: Notification[];
  unreadCount: number;
}> {
  await requireAdmin();

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [recentOrders, newUsers, lowStockProducts, recentMessages] =
    await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: oneDayAgo } },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      prisma.user.findMany({
        where: { createdAt: { gte: oneDayAgo } },
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        select: { id: true, name: true, stock: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),

      prisma.contactMessage.findMany({
        where: { createdAt: { gte: oneDayAgo } },
        select: { id: true, fullName: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  const notifications: Notification[] = [];

  for (const order of recentOrders) {
    notifications.push({
      id: `order-${order.id}`,
      type: "order",
      title: "New Order",
      description: `${order.user?.name ?? "Customer"} placed an order for $${(order.total / 100).toFixed(2)}`,
      href: "/admin/orders",
      time: formatTimeAgo(order.createdAt),
    });
  }

  for (const user of newUsers) {
    notifications.push({
      id: `user-${user.id}`,
      type: "user",
      title: "New User",
      description: `${user.name} (${user.email}) registered`,
      href: "/admin/users",
      time: formatTimeAgo(user.createdAt),
    });
  }

  for (const product of lowStockProducts) {
    notifications.push({
      id: `stock-${product.id}`,
      type: "low_stock",
      title: "Low Stock Alert",
      description: `${product.name} — only ${product.stock} left`,
      href: "/admin/products",
      time: "now",
    });
  }

  for (const msg of recentMessages) {
    notifications.push({
      id: `msg-${msg.id}`,
      type: "message",
      title: "New Message",
      description: `${msg.fullName} sent a message`,
      href: "/admin/messages",
      time: formatTimeAgo(msg.createdAt),
    });
  }

  // Sort by recency (orders/users/messages first, low stock always present)
  const unreadCount = recentOrders.length + newUsers.length + recentMessages.length + lowStockProducts.length;

  return { notifications, unreadCount };
}

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diffMs = now - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
