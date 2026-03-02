import type { ActionResult } from "@/types/action-result";

/**
 * Wraps an async action body in a try/catch and normalises the return value
 * to `ActionResult`.
 *
 * The `fn` should perform its work and return a success message string.
 * Any thrown error is caught and its message surfaced to the caller.
 *
 * Usage:
 *   return tryCatch(async () => {
 *     await db.deleteProduct(id);
 *     revalidatePath("/admin/products");
 *     return "Product deleted.";
 *   }, "Failed to delete product.");
 */
export async function tryCatch(
  fn: () => Promise<string>,
  fallback: string,
): Promise<ActionResult> {
  try {
    const message = await fn();
    return { success: true, message };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : fallback };
  }
}
