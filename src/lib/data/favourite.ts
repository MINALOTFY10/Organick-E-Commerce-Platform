/**
 * Data access functions for the Favourite domain.
 */

import { prisma } from "@/lib/prisma";

// ── Read ──────────────────────────────────────────────────────────────────────

/** Check whether a specific product is favourited by a user. */
export async function isFavourited(userId: string, productId: string): Promise<boolean> {
  const row = await prisma.favourite.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });
  return row !== null;
}

/** Return the full list of favourited products for a user, newest first. */
export async function findUserFavourites(userId: string) {
  return prisma.favourite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          stock: true,
          summary: true,
          category: { select: { name: true } },
        },
      },
    },
  });
}

/** Total number of favourites for a user. */
export async function countUserFavourites(userId: string): Promise<number> {
  return prisma.favourite.count({ where: { userId } });
}

// ── Write ─────────────────────────────────────────────────────────────────────

/** Add a product to a user's favourites. Safe to call even if it already exists. */
export async function addFavourite(userId: string, productId: string): Promise<void> {
  await prisma.favourite.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  });
}

/** Remove a product from a user's favourites. Safe to call even if it doesn't exist. */
export async function removeFavourite(userId: string, productId: string): Promise<void> {
  await prisma.favourite.deleteMany({ where: { userId, productId } });
}
