import { Package } from "lucide-react";
import Link from "next/link";
import { formatCents } from "@/lib/constants/currency";

type TopProduct = {
  name?: string | null;
  imageUrl?: string | null;
  price?: number;
  category?: { name: string } | string | null;
  totalSold: number;
};

export default function TopSellingProducts({ TopProducts }: { TopProducts: TopProduct[] }) {
  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-bold text-white">Top Selling Products</h3>
        <Link href="/admin/products">
          <button className="text-sm text-[#00ff7f] hover:text-[#00ff7f]/80 font-medium">View All →</button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#2a4d42]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">PRODUCT</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">CATEGORY</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">PRICE</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">SOLD</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {TopProducts.map((product, index) => (
              <tr key={index} className="border-b border-[#2a4d42] last:border-0 hover:bg-[#0d2820] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d2820] rounded-lg overflow-hidden flex-shrink-0">
                      {product.imageUrl ?
                        <img src={product.imageUrl} alt={product.name || ""} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">Rank #{index + 1}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-300">
                    {typeof product.category === "object" && product.category !== null ? product.category.name : product.category || "General"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-white">{formatCents(product.price ?? 0)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-white">{product.totalSold}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="px-3 py-1 bg-[#00ff7f]/20 text-[#00ff7f] rounded-full text-xs font-medium">Active</span>
                </td>
              
              </tr>
            ))}
            {TopProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No sales data yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
