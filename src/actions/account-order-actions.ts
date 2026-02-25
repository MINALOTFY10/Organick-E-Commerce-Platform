"use server";

import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import { findUserOrders, findUserOrderById } from "@/lib/data/customer-order";
import * as cartDb from "@/lib/data/cart";
import type { FindUserOrdersParams } from "@/lib/data/customer-order";
import type { ActionResult } from "@/types/action-result";

export type { FindUserOrdersParams } from "@/lib/data/customer-order";

/** Paginated order list for the authenticated customer. */
export const getMyOrders = withAuth(
  async (session, params: Omit<FindUserOrdersParams, "userId"> = {}) => {
    return findUserOrders({ userId: session.user.id, ...params });
  },
);

/** Single order detail for the authenticated customer. */
export const getMyOrder = withAuth(async (session, orderId: string) => {
  return findUserOrderById(orderId, session.user.id);
});

/** Add all items from a past order back into the current user's cart. */
export const reorderItems = withAuth(
  async (session, orderId: string): Promise<ActionResult> =>
    tryCatch(async () => {
      const order = await findUserOrderById(orderId, session.user.id);
      if (!order) throw new Error("Order not found.");
      const cartId = await cartDb.getOrCreateCart(session.user.id);
      await Promise.all(
        order.items.map((item) => cartDb.upsertCartItem(cartId, item.productId, item.quantity)),
      );
      revalidatePath("/", "layout");
      return `${order.items.length} item${order.items.length === 1 ? "" : "s"} added to your cart.`;
    }, "Failed to reorder items."),
);
