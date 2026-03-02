import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products/suggestions?q=banana
 * Returns up to 8 product name suggestions matching the query prefix.
 * Public — no auth required.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 1 || q.length > 50) {
    return NextResponse.json({ suggestions: [] });
  }

  const products = await prisma.product.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    select: { name: true },
    take: 8,
    orderBy: { name: "asc" },
  });

  // Deduplicate names in case of seeding quirks
  const suggestions = [...new Set(products.map((p) => p.name))];

  return NextResponse.json({ suggestions });
}
