"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertProduct } from "@/actions/product-actions";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    summary: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    imageUrl?: string | null;
    categoryId: string;
    additionalInfo?: string | null;
  };
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "");

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    summary: product?.summary || "",
    price: product?.price ? product.price / 100 : 0,
    salePrice: product?.salePrice ? product.salePrice / 100 : 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || "",
    categoryId: product?.categoryId || "",
    additionalInfo: product?.additionalInfo || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "imageUrl") {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await upsertProduct(formData, product?.id);
    if (!result.success) {
      setError(result.message);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-[#2a4d42] rounded-lg transition-colors shrink-0">
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              {product ? "Update product information" : "Create a new product listing"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-4 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors"
                placeholder="e.g., Organic Broccoli"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Summary *</label>
              <input
                type="text"
                name="summary"
                required
                value={formData.summary}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors"
                placeholder="Brief one-line description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Full Description *</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors resize-none"
                placeholder="Detailed product specifications..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Additional Info</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors resize-none"
                placeholder="Storage, origin, or care instructions..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white focus:outline-none focus:border-[#00ff7f] transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white focus:outline-none focus:border-[#00ff7f] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white focus:outline-none focus:border-[#00ff7f] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Sale Price ($) <span className="text-gray-500 font-normal">(optional — leave&nbsp;0 to disable)</span>
              </label>
              <input
                type="number"
                name="salePrice"
                step="0.01"
                min="0"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white focus:outline-none focus:border-[#00ff7f] transition-colors"
                placeholder="e.g. 3.99"
              />
              {formData.salePrice > 0 && formData.price > 0 && formData.salePrice < formData.price && (
                <p className="mt-1 text-xs text-[#00ff7f]">
                  Discount: {Math.round((1 - formData.salePrice / formData.price) * 100)}% off
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors"
                placeholder="https://..."
              />
              {imagePreview && (
                <div className="mt-4 relative rounded-lg border border-[#2a4d42] overflow-hidden h-48 bg-[#0d2820]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[#2a4d42]">
          <Link href="/admin/products" className="px-6 py-3 text-gray-400 hover:bg-[#0d2820] rounded-lg transition-colors font-medium">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#00ff7f] text-black rounded-lg hover:bg-[#00ff7f]/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-5 h-5" /> {product ? "Update Product" : "Create Product"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}