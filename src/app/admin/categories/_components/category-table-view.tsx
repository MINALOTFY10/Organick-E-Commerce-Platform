"use client";

import { useMemo } from "react";
import CategoryTable from "./category-table";
import { useCategoryFilters } from "./category-filters-provider";
import { Category } from "./categories-view";

interface Props {
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}

export default function CategoryTableView({ categories, onEdit, onDelete }: Props) {
  const { search, filter } = useCategoryFilters();

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" ||
        (filter === "HAS_PRODUCTS" && c._count.products > 0) ||
        (filter === "EMPTY" && c._count.products === 0);

      return matchesSearch && matchesFilter;
    });
  }, [categories, search, filter]);

  return <CategoryTable categories={filteredCategories} onEdit={onEdit} onDelete={onDelete} />;
}
