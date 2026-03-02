"use client";

import { ProductTable } from "./product-table";
import { useMemo } from "react";
import { useProductFilters } from "./product-filters-provider";
import type { ComponentProps } from "react";

type ProductRow = ComponentProps<typeof ProductTable>["products"][number];

export default function ProductTableView({ products }: { products: ProductRow[] }) {
  const { search, category, price } = useProductFilters();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || p.category.name === category;
      const matchesPrice = p.price >= price[0] * 100 && p.price <= price[1] * 100;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, category, price]);

  return <ProductTable products={filteredProducts} />;
}
