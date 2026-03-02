"use client";

import { useState } from "react";
import { Package, Edit3, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "./delete-product-button";
import { DataTable, Column } from "@/components/admin/data-table";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/constants/currency";
import { bulkDeleteProducts } from "@/actions/product-actions";

interface Product {
  id: string;
  name: string;
  summary?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  category: {
    name: string;
  };
  _count: {
    orderItems: number;
  };
}

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} product${selectedIds.size === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setBulkLoading(true);
    setBulkMessage(null);
    const result = await bulkDeleteProducts(Array.from(selectedIds));
    setBulkLoading(false);
    setSelectedIds(new Set());
    setBulkMessage({ success: result.success, text: result.message });
    if (result.success) router.refresh();
  };

  const columns: Column<Product>[] = [
    {
      header: "PRODUCT",
      cell: (product) => (
        <div className="flex items-center gap-3 w-fit">
          <div className="w-12 h-12 bg-[#0d2820] rounded-lg overflow-hidden shrink-0 border border-[#2a4d42]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <p className="max-w-50 font-semibold text-white">{product.name}</p>
            <p className="max-w-50 text-xs text-gray-500 line-clamp-1">
              {product.summary}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "CATEGORY",
      cell: (product) => (
        <span className="px-3 py-1 bg-[#0d2820] text-gray-300 rounded-lg text-xs border border-[#2a4d42]">
          {product.category.name}
        </span>
      ),
    },
    {
      header: "PRICE",
      cell: (product) => (
        <div>
          {product.salePrice && product.salePrice > 0 ? (
            <>
              <p className="font-semibold text-[#00ff7f]">{formatCents(product.salePrice)}</p>
              <p className="text-xs text-gray-500 line-through">{formatCents(product.price)}</p>
            </>
          ) : (
            <p className="font-semibold text-white">{formatCents(product.price)}</p>
          )}
        </div>
      ),
    },
    {
      header: "STOCK",
      cell: (product) => (
        <p className={`font-semibold ${product.stock < 10 ? "text-yellow-400" : "text-gray-300"}`}>
          {product.stock}
        </p>
      ),
    },
    {
      header: "STATUS",
      className: "px-4",
      cell: (product) =>
        product.stock > 0 ? (
          <span className="py-1 px-3 bg-[#00ff7f]/20 text-[#00ff7f] rounded-full text-xs font-medium">
            In Stock
          </span>
        ) : (
          <span className="py-1 px-2 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            Out of Stock
          </span>
        ),
    },
    {
      header: "ACTIONS",
      cell: (product) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/products/${product.id}/edit`}>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a4d42] rounded-lg transition-colors cursor-pointer">
              <Edit3 className="w-5 h-5" />
            </button>
          </Link>
          <DeleteProductButton productId={product.id} />
        </div>
      ),
    },
  ];

  const EmptyState = (
    <>
      <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 font-medium">No products found</p>
      <p className="text-gray-500 text-sm mt-1">
        Try adjusting your filters or add a new product
      </p>
    </>
  );

  return (
    <div className="space-y-3">
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-[#0d2820] border border-[#2a4d42] rounded-xl px-5 py-3">
          <span className="text-sm text-gray-300 font-medium">
            {selectedIds.size} product{selectedIds.size === 1 ? "" : "s"} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleBulkDelete}
              disabled={bulkLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-2 text-gray-400 hover:text-white text-sm rounded-lg hover:bg-[#2a4d42] transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {bulkMessage && (
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          bulkMessage.success ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
        }`}>
          {bulkMessage.text}
        </div>
      )}

      <DataTable
        data={products}
        columns={columns}
        emptyState={EmptyState}
        onRowClick={(product) => router.push(`/admin/products/${product.id}`)}
        selectable
        getRowId={(p) => p.id}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}