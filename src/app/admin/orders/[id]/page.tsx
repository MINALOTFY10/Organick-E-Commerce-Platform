import { prisma } from "@/lib/prisma";
import { ArrowLeft, User, Mail, Phone, MapPin, Package, Calendar, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/app/admin/orders/_components/order-status-badge";
import { UpdateOrderStatusButton } from "@/app/admin/orders/_components/update-order-status-button";
import { Suspense } from "react";
import { SkeletonPageLayout } from "@/components/ui/skeleton-components";
import { formatCents } from "@/lib/constants/currency";

export async function OrderDetailFetcher({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      user: {
        include: {
          addresses: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <button className="p-2 bg-[#244c40] hover:bg-emerald-500/20 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-white cursor-pointer" />
            </button>
          </Link>

          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-slate-300 mt-1 text-sm">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="sm:ml-auto">
          <UpdateOrderStatusButton orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({order.items.length})
            </h3>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex items-center gap-4 p-4 rounded-xl bg-[#18372e] border border-[#2a4d42] hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10 transition"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative w-20 h-20 bg-[#244c40] rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.imageUrl ?
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                    }
                  </div>

                  <div className="relative flex-1">
                    <p className="font-semibold text-white">{item.product.name}</p>
                    <p className="text-sm text-slate-300 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm text-slate-300">Price: {formatCents(item.price)} each</p>
                  </div>

                  <div className="relative text-right">
                    <p className="font-bold text-emerald-400 text-lg">{formatCents(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCents(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCents(order.total - subtotal)}</span>
              </div>

              <div className="pt-3 border-t border-[#2a4d42]">
                <div className="flex justify-between">
                  <span className="font-bold text-white text-lg">Total</span>
                  <span className="font-bold text-emerald-400 text-lg">{formatCents(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Order Status</h3>
            <OrderStatusBadge status={order.status} large />

            <div className="mt-4 pt-4 border-t border-[#2a4d42]">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {order.status === "SHIPPED" && (
              <div className="mt-3 pt-3 border-t border-[#2a4d42]">
                <div className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-blue-300">Shipment Info</span>
                </div>
                {order.trackingNumber ? (
                  <p className="text-sm text-slate-200 font-mono ml-6">{order.trackingNumber}</p>
                ) : (
                  <p className="text-sm text-slate-400 ml-6">No tracking number provided.</p>
                )}
                {order.shippedAt && (
                  <p className="text-xs text-slate-400 ml-6 mt-1">
                    Shipped on {new Date(order.shippedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="font-semibold text-white">{order.user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-semibold text-white">{order.user.email}</p>
                </div>
              </div>

              {order.user.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="font-semibold text-white">{order.user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {order.user.addresses.length > 0 && (
            <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h3>

              <div className="space-y-1 text-slate-300">
                <p>{order.user.addresses[0].street}</p>
                <p>
                  {order.user.addresses[0].city}, {order.user.addresses[0].state} {order.user.addresses[0].postalCode}
                </p>
                <p>{order.user.addresses[0].country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<SkeletonPageLayout showHeader headerWithButton={false} sidebarCards={3} mainCards={2} showTable={false} formFields={3} />}>
      <OrderDetailFetcher params={params} />
    </Suspense>
  );
}
