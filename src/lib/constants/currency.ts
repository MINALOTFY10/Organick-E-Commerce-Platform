/**
 * Currency utilities — all monetary values are stored as integer cents.
 */

/** Convert cents (integer) to a display string like "$12.99" */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Convert a dollar amount (from user input) to integer cents. */
export function toCents(dollars: number | string): number {
  const num = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  if (!Number.isFinite(num)) throw new Error("Invalid monetary value");
  return Math.round(num * 100);
}

/** Convert cents back to a dollar float (for computations that need it). */
export function toDollars(cents: number): number {
  return cents / 100;
}

/**
 * Return the effective selling price in cents.
 * Uses salePrice when it is a positive number, otherwise falls back to price.
 */
export function effectivePrice(price: number, salePrice?: number | null): number {
  return typeof salePrice === "number" && salePrice > 0 ? salePrice : price;
}
