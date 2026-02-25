/**
 * Data access functions for the user Profile domain (customer-facing).
 */

import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** Fetch the profile data visible to the customer. */
export async function findProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
    },
  });
}

// ── Write ─────────────────────────────────────────────────────────────────────

/** Update the customer's own profile fields. */
export async function updateProfile(userId: string, data: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * GDPR right-to-erasure for a customer account.
 * Removes user-owned personal/order data and then deletes the user.
 */
export async function eraseProfileAccount(userId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({
      where: {
        cart: { userId },
      },
    });

    await tx.cart.deleteMany({ where: { userId } });

    await tx.orderItem.deleteMany({
      where: {
        order: { userId },
      },
    });

    await tx.order.deleteMany({ where: { userId } });
    await tx.address.deleteMany({ where: { userId } });
    await tx.favourite.deleteMany({ where: { userId } });
    await tx.productReview.deleteMany({ where: { userId } });

    await tx.user.delete({ where: { id: userId } });
  });
}
