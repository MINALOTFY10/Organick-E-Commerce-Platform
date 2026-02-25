"use server";

import { withAuth } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import { eraseProfileAccount, findProfile, updateProfile } from "@/lib/data/profile";
import type { UpdateProfileInput } from "@/lib/data/profile";
import type { ActionResult } from "@/types/action-result";
import { revalidatePath } from "next/cache";

export type { UpdateProfileInput } from "@/lib/data/profile";

/** Fetch the authenticated user's profile. */
export const getProfile = withAuth(async (session) => {
  return findProfile(session.user.id);
});

/** Update the authenticated user's name/phone. */
export const updateProfileAction = withAuth(
  async (session, data: UpdateProfileInput): Promise<ActionResult> => {
    // Basic validation
    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name || name.length < 2 || name.length > 100) {
        return { success: false, message: "Name must be between 2 and 100 characters." };
      }
      data.name = name;
    }

    if (data.phone !== undefined && data.phone !== null) {
      const phone = data.phone.trim();
      if (phone && (phone.length < 6 || phone.length > 20)) {
        return { success: false, message: "Phone number must be between 6 and 20 characters." };
      }
      data.phone = phone || undefined;
    }

    return tryCatch(async () => {
      await updateProfile(session.user.id, data);
      revalidatePath("/account");
      return "Profile updated successfully.";
    }, "Failed to update profile.");
  },
);

/** Delete the authenticated user's account and personal data. */
export const deleteOwnAccountAction = withAuth(
  async (session, confirmationText: string): Promise<ActionResult> => {
    if (confirmationText.trim() !== "DELETE") {
      return {
        success: false,
        message: 'Type "DELETE" exactly to confirm account deletion.',
      };
    }

    return tryCatch(async () => {
      await eraseProfileAccount(session.user.id);
      revalidatePath("/");
      revalidatePath("/account");
      return "Account permanently deleted.";
    }, "Failed to delete account.");
  },
);
