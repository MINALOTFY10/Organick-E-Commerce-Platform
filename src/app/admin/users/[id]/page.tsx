// src/app/admin/users/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Mail, Shield, User } from "lucide-react";
import { Suspense } from "react";
import { formatCents } from "@/lib/constants/currency";

import { SkeletonPageLayout } from "@/components/ui/skeleton-components";

export async function UserFetcher({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) notFound();

  const totalOrders = user.orders.length;
  const totalSpent = user.orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="p-2 hover:bg-[#1a3d32] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <p className="text-sm text-gray-400 mb-1">Home › Users › User Details</p>
            <h2 className="text-3xl font-bold text-white">{user.name}</h2>
          </div>
        </div>

        <Link
          href={`/admin/users/${user.id}/edit`}
          className="flex items-center gap-2 bg-[#00ff7f] text-black px-6 py-3 rounded-xl hover:bg-[#00ff7f]/90 transition-all font-medium"
        >
          <Edit className="w-5 h-5" />
          Edit User
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center bg-[#0f2920] rounded-xl p-10">
                <User className="w-20 h-20 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Name</p>
                  <p className="text-xl font-semibold text-white">{user.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#00ff7f]" />
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Role</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00ff7f]/20 text-[#00ff7f] rounded-lg">
                    <Shield className="w-4 h-4" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>

            {user.orders.length ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a4d42]">
                      <th className="text-left py-3 px-4 text-sm text-gray-400">Order</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-400">Items</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-400">Total</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.orders.map((order) => {
                      const total = order.items.reduce(
                        (s, i) => s + i.price * i.quantity,
                        0
                      );

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-[#2a4d42] hover:bg-[#0f2920]"
                        >
                          <td className="py-3 px-4 text-white font-mono">
                            #{order.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {order.items.length}
                          </td>
                          <td className="py-3 px-4 text-[#00ff7f] font-semibold">
                            {formatCents(total)}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-6">
                No orders for this user.
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4">User Statistics</h3>

            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-[#0f2920] rounded-lg">
                <span className="text-gray-400">Total Orders</span>
                <span className="text-white font-bold">{totalOrders}</span>
              </div>

              <div className="flex justify-between p-4 bg-[#0f2920] rounded-lg">
                <span className="text-gray-400">Total Spent</span>
                <span className="text-[#00ff7f] font-bold">
                  {formatCents(totalSpent)}
                </span>
              </div>

              <div className="flex justify-between p-4 bg-[#0f2920] rounded-lg">
                <span className="text-gray-400">Avg Order</span>
                <span className="text-white font-bold">
                  {totalOrders ? formatCents(Math.round(totalSpent / totalOrders)) : "$0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Metadata</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Created</p>
                <p className="text-white">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">User ID</p>
                <p className="text-white font-mono text-sm break-all">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function SingleUserPage({ params }: { params: Promise<{ id: string }> }) {
  return (
     <Suspense fallback={
      <SkeletonPageLayout
        showHeader
        headerWithButton
        sidebarCards={2}
        mainCards={1}
        showTable
        showImage
        formFields={3}
      />
    }>
      <UserFetcher params={params} />
    </Suspense>
  );
}
