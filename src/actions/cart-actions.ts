"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth-utils";
import { withAuth, withOwnership } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import * as db from "@/lib/data/cart";
import type { ActionResult } from "@/types/action-result";

// ── Mutations (decorated — auth is enforced before the function runs) ─────────

/**
 * Add a product to the authenticated user's cart.
 * Creates the cart if it doesn't exist yet.
 */
export const addItemToCart = withAuth(
  async (session, productId: string, quantity: number): Promise<ActionResult> => {
    if (quantity < 1) return { success: false, message: "Quantity must be at least 1." };
    return tryCatch(async () => {
      const cartId = await db.getOrCreateCart(session.user.id);
      await db.upsertCartItem(cartId, productId, quantity);
      revalidatePath("/", "layout");
      return "Item added to cart.";
    }, "Failed to add item to cart.");
  },
);

/**
 * Decrement a product's cart quantity by 1; removes the item when it hits 0.
 */
export const decrementCartItem = withAuth(
  async (session, productId: string): Promise<ActionResult> =>
    tryCatch(async () => {
      const cartId = await db.getOrCreateCart(session.user.id);
      await db.decrementOrRemoveCartItem(cartId, productId);
      revalidatePath("/", "layout");
      return "Cart updated.";
    }, "Failed to update cart."),
);

/**
 * Update the quantity of a cart item the current user owns.
 */
export const updateCartItemQuantity = withOwnership(
  async (itemId: string, _newQuantity: number) => db.findCartItemOwnerId(itemId),
  async (_session, itemId: string, newQuantity: number): Promise<ActionResult> => {
    if (newQuantity < 1) return { success: false, message: "Quantity must be at least 1." };
    return tryCatch(async () => {
      await db.setCartItemQuantity(itemId, newQuantity);
      revalidatePath("/", "layout");
      return "Cart updated.";
    }, "Failed to update cart.");
  },
);

/**
 * Remove a cart item the current user owns.
 */
export const removeCartItem = withOwnership(
  async (itemId: string) => db.findCartItemOwnerId(itemId),
  async (_session, itemId: string): Promise<ActionResult> =>
    tryCatch(async () => {
      await db.removeCartItem(itemId);
      revalidatePath("/", "layout");
      return "Item removed from cart.";
    }, "Failed to remove item."),
);

// ── Queries ───────────────────────────────────────────────────────────────────

/** Total number of distinct items in the current user's cart. */
export async function getCartCount(): Promise<number> {
  const session = await getServerSession();
  if (!session?.user) return 0;
  return db.getCartItemCount(session.user.id);
}

/** Full cart with items and product details for the cart sidebar / checkout. */
export async function getFullCart() {
  const session = await getServerSession();
  if (!session?.user) return null;
  return db.findCartWithItems(session.user.id);
}

