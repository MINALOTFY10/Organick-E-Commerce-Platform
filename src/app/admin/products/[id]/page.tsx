// src/app/admin/products/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Tag } from "lucide-react";
import Image from "next/image";
import { formatCents } from "@/lib/constants/currency";

import { Suspense } from "react";
import { SkeletonPageLayout } from "@/components/ui/skeleton-components";

export async function ProductSection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      category: true,
      _count: { select: { reviews: true } },
      orderItems: {
        include: {
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { order: { createdAt: "desc" } },
        take: 10,
      },
    },
  });

  if (!product) {
    notFound();
  }

  const totalOrders = product.orderItems.length;
  const totalRevenue = product.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-[#1a3d32] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <p className="text-sm text-gray-400 mb-1">Home › Inventory › Product Details</p>
            <h2 className="text-3xl font-bold text-white">{product.name}</h2>
          </div>
        </div>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="flex items-center gap-2 bg-[#00ff7f] text-black px-6 py-3 rounded-xl hover:bg-[#00ff7f]/90 transition-all font-medium"
        >
          <Edit className="w-5 h-5" />
          Edit Product
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image & Basic Info */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-[#0f2920]">
                {product.imageUrl ?
                  <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                : <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>}
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Product Name</p>
                  <p className="text-xl font-semibold text-white">{product.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Category</p>
                  <Link
                    href={`/admin/categories?selected=${product.category.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00ff7f]/20 text-[#00ff7f] rounded-lg hover:bg-[#00ff7f]/30 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    {product.category.name}
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Price</p>
                    <p className="text-2xl font-bold text-[#00ff7f]">{formatCents(product.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Stock</p>
                    <p
                      className={`text-2xl font-bold ${
                        product.stock > 10 ? "text-[#00ff7f]"
                        : product.stock > 0 ? "text-yellow-400"
                        : "text-red-400"
                      }`}
                    >
                      {product.stock}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Reviews</p>
                  <p className="text-2xl font-bold text-[#00ff7f]">{product._count.reviews}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Description</h3>
            <p className="text-gray-300 leading-relaxed">{product.description || "No description available."}</p>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
            {product.orderItems.length > 0 ?
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a4d42]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.orderItems.map((item) => (
                      <tr key={item.id} className="border-b border-[#2a4d42] hover:bg-[#0f2920] transition-colors">
                        <td className="py-3 px-4 text-sm text-white font-mono">#{item.orderId.slice(0, 8)}</td>
                        <td className="py-3 px-4 text-sm text-white">{item.order.user?.name || "Guest"}</td>
                        <td className="py-3 px-4 text-sm text-white">{item.quantity}</td>
                        <td className="py-3 px-4 text-sm text-[#00ff7f] font-semibold">{formatCents(item.price * item.quantity)}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">{new Date(item.order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            : <p className="text-gray-400 text-center py-8">No orders yet for this product.</p>}
          </div>
        </div>

        {/* Right Column - Stats & Metadata */}
        <div className="space-y-6">
          {/* Sales Statistics */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Sales Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#0f2920] rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0f2920] rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-[#00ff7f] mt-1">{formatCents(totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-[#00ff7f]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00ff7f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0f2920] rounded-lg">
                <div>
                  <p className="text-sm text-gray-400">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalOrders > 0 ? formatCents(Math.round(totalRevenue / totalOrders)) : "$0.00"}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Metadata</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Created At</p>
                <p className="text-white">{new Date(product.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                <p className="text-white">{new Date(product.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Product ID</p>
                <p className="text-white font-mono text-sm break-all">{product.id}</p>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Stock Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Stock</span>
                <span className="text-white font-semibold">{product.stock} units</span>
              </div>
              <div className="w-full bg-[#0f2920] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    product.stock > 10 ? "bg-[#00ff7f]"
                    : product.stock > 0 ? "bg-yellow-400"
                    : "bg-red-400"
                  }`}
                  style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock > 10 ? "bg-[#00ff7f]"
                    : product.stock > 0 ? "bg-yellow-400"
                    : "bg-red-400"
                  }`}
                />
                <span className="text-sm text-gray-400">
                  {product.stock > 10 ?
                    "In Stock"
                  : product.stock > 0 ?
                    "Low Stock"
                  : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={<SkeletonPageLayout showHeader headerWithButton showBreadcrumb sidebarCards={3} mainCards={2} showTable showImage formFields={4} />}
    >
      <ProductSection params={params} />
    </Suspense>
  );
}
