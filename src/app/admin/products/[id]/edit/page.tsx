import { prisma } from "@/lib/prisma";
import ProductForm from "@/app/admin/products/_components/product-form";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: (await params).id },
      include: {
        category: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  // Return 404 if product doesn't exist
  if (!product) {
    notFound();
  }

  return <ProductForm product={product} categories={categories} />;
}