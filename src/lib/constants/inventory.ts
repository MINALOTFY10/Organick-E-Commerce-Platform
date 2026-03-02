/**
 * Inventory thresholds shared between the DAL queries and any UI that
 * displays stock health labels. Change ONE number here and both layers
 * stay in sync.
 */

/** Products with stock > this value are considered "In Stock". */
export const LOW_STOCK_THRESHOLD = 10;
