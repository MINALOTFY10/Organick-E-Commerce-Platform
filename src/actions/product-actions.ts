"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { withAdmin } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import * as db from "@/lib/data/product";
import type { ActionResult } from "@/types/action-result";

// Re-export the filter params type so callers don't need to import from lib/data
export type { ProductFilterParams } from "@/lib/data/product";

// ── Public queries (no auth required) ────────────────────────────────────────

/** Paginated, filtered product list for the public /products page. */
export async function getFilteredProducts(params: db.ProductFilterParams = {}) {
  return db.findFilteredProducts(params);
}

/** All products mapped to the UI type (cached per render). */
export const getProducts = cache(() => db.findProducts());

/** Most recent N products — home page hero section. */
export async function getFeaturedProducts(take = 8) {
  return db.findFeaturedProducts(take);
}

/** Products from specific categories — home page offer section. */
export async function getProductsByCategoryNames(
  categoryNames: string[],
  takePerCategory = 2,
) {
  return db.findProductsByCategoryNames(categoryNames, takePerCategory);
}

/** Single product by id. */
export async function getProductById(id: string) {
  return db.findProductById(id);
}

/** Related products in the same category.
 *  Pass `categoryId` when already known to save a DB round trip.
 */
export async function getRelatedProducts(productId: string, categoryId?: string) {
  return db.findRelatedProducts(productId, categoryId);
}

// ── Admin queries ─────────────────────────────────────────────────────────────

/** All products with category + order count — admin product table (cached per render). */
export const getProductsWithCategories = cache(async () => {
  await requireAdmin();
  return db.findProductsWithCategories();
});

/** Stock health breakdown — admin inventory widget. */
export async function getInventoryStats() {
  await requireAdmin();
  return db.findInventoryStats();
}

// ── Admin mutations (decorated — auth is enforced before the function runs) ──

/**
 * Create or update a product.
 * Pass `productId` to update an existing record; omit to create.
 */
export const upsertProduct = withAdmin(
  async (
    _session,
    formData: db.ProductWriteInput,
    productId?: string,
  ): Promise<ActionResult> =>
    tryCatch(async () => {
      const data = db.buildProductData(formData); // throws on invalid input
      if (productId) {
        await db.updateProduct(productId, data);
      } else {
        await db.createProduct(data);
      }
      revalidatePath("/admin/products");
      return productId ? "Product updated." : "Product created.";
    }, "Failed to save product."),
);

/** Delete a product by id. */
export const deleteProduct = withAdmin(
  async (_session, productId: string): Promise<ActionResult> =>
    tryCatch(async () => {
      await db.deleteProduct(productId);
      revalidatePath("/admin/products");
      return "Product deleted.";
    }, "Failed to delete product."),
);

/** Delete multiple products by id. */
export const bulkDeleteProducts = withAdmin(
  async (_session, ids: string[]): Promise<ActionResult> =>
    tryCatch(async () => {
      if (!ids.length) throw new Error("No products selected.");
      await db.bulkDeleteProducts(ids);
      revalidatePath("/admin/products");
      return `${ids.length} product${ids.length === 1 ? "" : "s"} deleted.`;
    }, "Failed to delete products."),
);
