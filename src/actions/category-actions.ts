"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { withAdmin } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import * as db from "@/lib/data/category";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/action-result";

// ── Public queries ────────────────────────────────────────────────────────────

export async function getCategories() {
  return db.findCategories();
}

export async function getCategoryNames() {
  return db.findCategoryNames();
}

// ── Admin mutations ───────────────────────────────────────────────────────────

export const upsertCategory = withAdmin(
  async (
    _session,
    formData: { name: string; description?: string | null },
    categoryId?: string,
  ): Promise<ActionResult> =>
    tryCatch(async () => {
      if (categoryId) {
        await db.updateCategory(categoryId, formData);
      } else {
        await db.createCategory(formData);
      }
      revalidatePath("/admin/categories");
      return categoryId ? "Category updated." : "Category created.";
    }, "Failed to save category."),
);

export const deleteCategory = withAdmin(
  async (_session, categoryId: string): Promise<ActionResult> => {
    const productsCount = await db.countProductsInCategory(categoryId);
    if (productsCount > 0) {
      return { success: false, message: "This category has products and cannot be deleted." };
    }
    return tryCatch(async () => {
      await db.deleteCategory(categoryId);
      revalidatePath("/admin/categories");
      return "Category deleted.";
    }, "Failed to delete category.");
  },
);

// ── Admin queries ─────────────────────────────────────────────────────────────

/** Admin-only alias that gates the same data behind a role check. */
export async function getAdminCategories() {
  await requireAdmin();
  return db.findCategories();
}
