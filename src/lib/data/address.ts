/**
 * Data access functions for the Address domain.
 */

import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CreateAddressInput {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface UpdateAddressInput {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** All addresses for a given user, newest first. */
export async function findAddressesByUserId(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/** Single address, scoped to user for security. */
export async function findAddressById(addressId: string, userId: string) {
  return prisma.address.findFirst({
    where: { id: addressId, userId },
  });
}

// ── Write ─────────────────────────────────────────────────────────────────────

/** Create a new address for the user. */
export async function createAddress(userId: string, data: CreateAddressInput) {
  return prisma.address.create({
    data: {
      userId,
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country ?? "Egypt",
    },
  });
}

/** Update an existing address (must belong to user). */
export async function updateAddress(
  addressId: string,
  userId: string,
  data: UpdateAddressInput,
) {
  return prisma.address.updateMany({
    where: { id: addressId, userId },
    data,
  });
}

/** Delete an address (must belong to user). */
export async function deleteAddress(addressId: string, userId: string) {
  return prisma.address.deleteMany({
    where: { id: addressId, userId },
  });
}
