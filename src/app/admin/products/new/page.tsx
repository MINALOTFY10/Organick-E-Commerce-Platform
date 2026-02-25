import ProductForm from "@/app/admin/products/_components/product-form";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export default async function NewProductPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <ProductForm categories={categories} />
    </div>
  );
}
