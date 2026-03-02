/**
 * Data access functions for the Cart domain.
 */

import { prisma } from "@/lib/prisma";

// ── Read ──────────────────────────────────────────────────────────────────────

/**
 * Returns the userId that owns a cart item, or null if the item doesn't exist.
 * Used by the ownership check before mutating a cart item.
 */
export async function findCartItemOwnerId(itemId: string): Promise<string | null> {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    select: { cart: { select: { userId: true } } },
  });
  return item?.cart.userId ?? null;
}

/** Total number of distinct items in a user's cart. */
export async function getCartItemCount(userId: string): Promise<number> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { _count: { select: { items: true } } },
  });
  return cart?._count.items ?? 0;
}

/** Full cart with items and their products — used by checkout. */
export async function findCartWithItems(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
}

// ── Write ─────────────────────────────────────────────────────────────────────

/**
 * Find the user's cart or create one if it doesn't exist.
 * Returns the cart id.
 */
export async function getOrCreateCart(userId: string): Promise<string> {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: { id: true },
  });
  return cart.id;
}

/**
 * Atomically add `quantity` units of a product to a cart.
 * Uses upsert on the @@unique([cartId, productId]) constraint so concurrent
 * calls cannot create duplicate rows.
 */
export async function upsertCartItem(
  cartId: string,
  productId: string,
  quantity: number,
) {
  return prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId, productId, quantity },
  });
}

export async function setCartItemQuantity(itemId: string, quantity: number) {
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

/**
 * Decrement the quantity of a product in a cart by 1.
 * If the quantity would reach 0, the item is removed entirely.
 */
export async function decrementOrRemoveCartItem(cartId: string, productId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
    select: { id: true, quantity: true },
  });
  if (!item) return;
  if (item.quantity <= 1) {
    return prisma.cartItem.delete({ where: { id: item.id } });
  }
  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: { decrement: 1 } },
  });
}

export async function removeCartItem(itemId: string) {
  return prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(cartId: string) {
  return prisma.cartItem.deleteMany({ where: { cartId } });
}
