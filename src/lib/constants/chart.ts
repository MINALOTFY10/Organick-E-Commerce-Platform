/**
 * Display constants for the admin analytics charts.
 *
 * Kept outside the DAL so data-access modules don't know about presentation
 * concerns (colors, labels).
 */

export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * Brand colors keyed by category name.
 * Add a row here when a new category is created in the database.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Vegetables: "#00ff7f",
  Fruits:     "#3b82f6",
  Bakery:     "#a855f7",
  Dairy:      "#f59e0b",
  Meat:       "#ef4444",
  Seafood:    "#14b8a6",
  Beverages:  "#f97316",
  Spices:     "#8b5cf6",
  Frozen:     "#00bcd4",
  Grains:     "#f43f5e",
  Nuts:       "#eab308",
  Oils:       "#f87171",
  default:    "#6b7280",
};
