"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { withAdmin } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import * as db from "@/lib/data/order";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/generated/prisma/enums";
import type { ActionResult } from "@/types/action-result";

// ── Admin mutations ───────────────────────────────────────────────────────────

export const updateOrderStatus = withAdmin(
  async (
    _session,
    orderId: string,
    newStatus: string,
    trackingNumber?: string,
  ): Promise<ActionResult> => {
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(newStatus as OrderStatus)) {
      return { success: false, message: `Invalid order status: "${newStatus}".` };
    }
    return tryCatch(async () => {
      await db.updateOrderStatus(orderId, newStatus as OrderStatus, trackingNumber);
      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
      return "Order status updated.";
    }, "Failed to update order status.");
  },
);

export const bulkUpdateOrderStatus = withAdmin(
  async (_session, ids: string[], newStatus: string): Promise<ActionResult> => {
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(newStatus as OrderStatus)) {
      return { success: false, message: `Invalid order status: "${newStatus}".` };
    }
    return tryCatch(async () => {
      if (!ids.length) throw new Error("No orders selected.");
      await db.bulkUpdateOrderStatus(ids, newStatus as OrderStatus);
      revalidatePath("/admin/orders");
      return `${ids.length} order${ids.length === 1 ? "" : "s"} updated to ${newStatus}.`;
    }, "Failed to bulk update orders.");
  },
);

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getOrders(params: db.FindOrdersParams = {}) {
  await requireAdmin();
  return db.findOrders(params);
}

export async function getOrderStats() {
  await requireAdmin();
  return db.findOrderStats();
}
