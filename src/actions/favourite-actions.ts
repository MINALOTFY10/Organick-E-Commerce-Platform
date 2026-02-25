"use server";

import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import { getServerSession } from "@/lib/auth-utils";
import * as db from "@/lib/data/favourite";
import type { ActionResult } from "@/types/action-result";

// ── Queries ───────────────────────────────────────────────────────────────────

/** Returns all favourited products for the currently authenticated user. */
export async function getUserFavourites(userId: string) {
  return db.findUserFavourites(userId);
}

/** Returns true if the given product is in the current user's favourites. */
export async function checkIsFavourited(userId: string, productId: string): Promise<boolean> {
  return db.isFavourited(userId, productId);
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/**
 * Toggle a product's favourite status for the authenticated user.
 * Gets the session directly (does NOT redirect) so it always returns a clean
 * ActionResult — calling redirect() inside startTransition can fail silently.
 */
export async function toggleFavourite(
  productId: string,
): Promise<ActionResult<{ favourited: boolean }>> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, message: "unauthenticated" };
    }

    const userId = session.user.id;
    const already = await db.isFavourited(userId, productId);

    if (already) {
      await db.removeFavourite(userId, productId);
    } else {
      await db.addFavourite(userId, productId);
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath("/account/favourites");

    return {
      success: true,
      message: already ? "Removed from favourites." : "Added to favourites.",
      data: { favourited: !already },
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to update favourites.",
    };
  }
}

/** Remove a product from the authenticated user's favourites. */
export const removeFavouriteItem = withAuth(
  async (session, productId: string): Promise<ActionResult> =>
    tryCatch(async () => {
      await db.removeFavourite(session.user.id, productId);
      revalidatePath("/account/favourites");
      return "Removed from favourites.";
    }, "Failed to remove favourite."),
);
