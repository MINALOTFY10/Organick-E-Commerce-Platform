"use server";

import { requireAdmin } from "@/lib/auth-utils";
import * as db from "@/lib/data/order";

export async function getChartData() {
  await requireAdmin();
  return db.findMonthlySalesChart();
}

export async function getCategoriesStats() {
  await requireAdmin();
  return db.findCategoryRevenue();
}

export async function getTopProducts() {
  await requireAdmin();
  return db.findTopProducts();
}
