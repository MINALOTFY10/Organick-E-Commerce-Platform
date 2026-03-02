"use client";

import { ProductFilters } from "./product-filters";
import { useProductFilters } from "./product-filters-provider";

interface Props {
  categories: { id: string; name: string }[];
}

export default function ProductFiltersView({ categories }: Props) {
  const {
    search,
    setSearch,
    category,
    setCategory,
    price,
    setPrice,
  } = useProductFilters();

  return (
    <ProductFilters
      search={search}
      onSearch={setSearch}
      category={category}
      onCategory={setCategory}
      price={price}
      onPrice={setPrice}
      categories={categories}
    />
  );
}
