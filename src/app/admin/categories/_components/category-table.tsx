import { Edit3, Package, Trash2 } from "lucide-react";
import { Category } from "./categories-view";
import { Column, DataTable } from "@/components/admin/data-table";

interface Props {
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
  const columns: Column<Category>[] = [
    {
      header: "Category",
      cell: (category) => <td className="py-4 px-6 text-white">{category.name}</td>,
    },
    {
      header: "Description",
      cell: (category) => <td className="py-4 px-6 text-gray-400">{category.description || "—"}</td>,
    },
    {
      header: "Products",
      cell: (category) => <td className="py-4 px-6 text-[#00ff7f]">{category._count.products}</td>,
    },
    {
      header: "Created",
      cell: (category) => <td className="py-4 px-6 text-gray-400">{new Date(category.createdAt).toLocaleDateString()}</td>,
    },
    {
      header: "Actions",
      cell: (category) => (
        <td className="py-4 px-6 flex gap-4">
          <button onClick={() => onEdit(category)}>
            <Edit3 className="w-5 h-5 text-gray-400" />
          </button>
          <button onClick={() => onDelete(category)}>
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </td>
      ),
    },
  ];

  const EmptyState = (
    <>
      <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 font-medium">No categories found</p>
      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or add a new category</p>
    </>
  );

  return <DataTable data={categories} columns={columns} emptyState={EmptyState} />;
}
