import { Product as UiProduct } from "@/types/product";
import type { Product, Category } from "@/generated/prisma/client";

type ProductWithCategory = Product & { category: Category | null };

export function mapRowProductToProduct(row: ProductWithCategory): UiProduct {
  return {
    id: row.id,
    name: row.name,
    summary: row.summary,
    description: row.description,
    additionalInfo: row.additionalInfo,

    price: Number(row.price),
    salePrice: row.salePrice != null ? Number(row.salePrice) : null,

    stock: row.stock,
    imageUrl: row.imageUrl,
    categoryName: row.category?.name ?? "Uncategorized",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
