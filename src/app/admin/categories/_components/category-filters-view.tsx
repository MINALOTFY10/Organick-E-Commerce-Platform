"use client";

import CategoryFilters from "./category-filters";
import { useCategoryFilters } from "./category-filters-provider";
import { Category } from "./categories-view";

interface Props {
  categories: Category[];
}

export default function CategoryFiltersView({ categories }: Props) {
  const { search, setSearch, filter, setFilter } = useCategoryFilters();

  const totalCategories = categories.length;
  const hasProducts = categories.filter((c) => c._count.products > 0).length;
  const empty = categories.filter((c) => c._count.products === 0).length;

  return (
    <CategoryFilters
      totalCategories={totalCategories}
      hasProducts={hasProducts}
      empty={empty}
      search={search}
      onSearch={setSearch}
      filter={filter}
      onFilter={setFilter}
    />
  );
}
