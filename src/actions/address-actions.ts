"use server";

import { withAuth } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import {
  findAddressesByUserId,
  findAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/data/address";
import type { CreateAddressInput, UpdateAddressInput } from "@/lib/data/address";
import type { ActionResult } from "@/types/action-result";
import { revalidatePath } from "next/cache";

export type { CreateAddressInput, UpdateAddressInput } from "@/lib/data/address";

// ── Queries ───────────────────────────────────────────────────────────────────

/** All addresses for the authenticated user. */
export const getAddresses = withAuth(async (session) => {
  return findAddressesByUserId(session.user.id);
});

/** Single address by ID (must belong to user). */
export const getAddress = withAuth(async (session, addressId: string) => {
  return findAddressById(addressId, session.user.id);
});

// ── Mutations ─────────────────────────────────────────────────────────────────

/** Add a new address. */
export const addAddressAction = withAuth(
  async (session, data: CreateAddressInput): Promise<ActionResult> => {
    if (!data.street?.trim() || !data.city?.trim() || !data.postalCode?.trim()) {
      return { success: false, message: "Street, city, and postal code are required." };
    }

    if (data.street.length > 500 || data.city.length > 200 ||
        (data.state && data.state.length > 200) || data.postalCode.length > 20) {
      return { success: false, message: "One or more fields exceed maximum length." };
    }

    return tryCatch(async () => {
      await createAddress(session.user.id, data);
      revalidatePath("/account/addresses");
      return "Address added successfully.";
    }, "Failed to add address.");
  },
);

/** Update an existing address. */
export const updateAddressAction = withAuth(
  async (session, addressId: string, data: UpdateAddressInput): Promise<ActionResult> => {
    if (data.street !== undefined && data.street.length > 500) {
      return { success: false, message: "Street exceeds maximum length." };
    }

    return tryCatch(async () => {
      const result = await updateAddress(addressId, session.user.id, data);
      if (result.count === 0) {
        throw new Error("Address not found or does not belong to you.");
      }
      revalidatePath("/account/addresses");
      return "Address updated successfully.";
    }, "Failed to update address.");
  },
);

/** Delete an address. */
export const deleteAddressAction = withAuth(
  async (session, addressId: string): Promise<ActionResult> => {
    return tryCatch(async () => {
      const result = await deleteAddress(addressId, session.user.id);
      if (result.count === 0) {
        throw new Error("Address not found or does not belong to you.");
      }
      revalidatePath("/account/addresses");
      return "Address deleted successfully.";
    }, "Failed to delete address.");
  },
);
