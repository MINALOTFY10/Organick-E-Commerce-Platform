"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertCategory, deleteCategory } from "@/actions/category-actions";
import CategoryStats from "./category-stats";
import CategoryTableView from "./category-table-view";
import CategoryFiltersView from "./category-filters-view";
import CategoryFormModal from "./category-form-modal";
import CategoryDeleteModal from "./category-delete-modal";
import AdminPageHeader from "@/app/admin/_components/admin-page-header";
import { Plus } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: { products: number };
}

interface Props {
  categories: Category[];
}

export default function CategoriesView({ categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // Tracks router refresh
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks API calls

  // --- State for Modals ---
  // We add a specific boolean for visibility to avoid relying on data check tricks
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "" });

  /* ---------- handlers ---------- */
  const openCreate = () => {
    setFormData({ name: "", description: "" });
    setEditing(null);
    setError("");
    setIsFormOpen(true); // Explicitly open the modal
  };

  const openEdit = (cat: Category) => {
    setFormData({ name: cat.name, description: cat.description || "" });
    setEditing(cat);
    setError("");
    setIsFormOpen(true); // Explicitly open the modal
  };

  const closeAll = () => {
    setIsFormOpen(false);
    setEditing(null);
    setDeleting(null);
    setError("");
  };

  const submit = async () => {
    setIsSubmitting(true);
    setError("");

    const result = editing
      ? await upsertCategory(formData, editing.id)
      : await upsertCategory(formData);

    if (!result.success) {
      setError(result.message);
    } else {
      closeAll();
      startTransition(() => router.refresh());
    }
    setIsSubmitting(false);
  };

  const remove = async () => {
    if (!deleting) return;
    setIsSubmitting(true);

    const result = await deleteCategory(deleting.id);
    if (!result.success) {
      setError(result.message);
    } else {
      closeAll();
      startTransition(() => router.refresh());
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <AdminPageHeader
        title="Category Management"
        subtitle="Organize and manage product categories."
        breadcrumb="Home › Categories"
        actionLabel="Add Category"
        actionIcon={<Plus className="w-4 h-4" />}
        onAction={openCreate}
      />

      <CategoryStats categories={categories} />

      <CategoryFiltersView categories={categories} />
      <CategoryTableView categories={categories} onEdit={openEdit} onDelete={setDeleting} />

      {isFormOpen && (
        <CategoryFormModal
          open={isFormOpen}
          loading={isSubmitting || isPending}
          error={error}
          formData={formData}
          isEdit={!!editing}
          onChange={setFormData}
          onClose={closeAll}
          onSubmit={submit}
        />
      )}

      {deleting && (
        <CategoryDeleteModal category={deleting} loading={isSubmitting || isPending} error={error} onClose={closeAll} onConfirm={remove} />
      )}
    </>
  );
}
