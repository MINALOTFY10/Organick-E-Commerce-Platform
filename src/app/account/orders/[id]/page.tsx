import Link from "next/link";
import { notFound } from "next/navigation";
import { getMyOrder } from "@/actions/account-order-actions";
import { ArrowLeft, Download, MapPin, Package, Truck } from "lucide-react";
import { SHIPPING_COST_CENTS } from "@/lib/checkout-constants";
import { ReorderButton } from "../_components/reorder-button";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getMyOrder(id);

  if (!order || "success" in order) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    SHIPPED: "Shipped",
    COMPLETED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = SHIPPING_COST_CENTS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/account/orders"
            className="flex items-center gap-1 text-sm text-(--muted-foreground) hover:text-(--primary-color) transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Orders
          </Link>
          <h2 className="text-2xl font-bold text-(--primary-color)">
            Order #{order.id.slice(0, 8)}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColors[order.status] ?? "bg-gray-50 text-gray-600"}`}
            >
              {statusLabels[order.status] ?? order.status}
            </span>
            <span className="text-sm text-(--muted-foreground)">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <ReorderButton orderId={order.id} />
          {order.status === "COMPLETED" && (
            <a
              href={`/api/invoices/${order.id}`}
              download
              className="flex items-center gap-2 bg-white border border-gray-200 text-(--primary-color) px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </a>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-(--primary-color) flex items-center gap-2">
            <Package className="w-4 h-4" />
            Items ({order.items.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              {item.product.imageUrl && (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-(--primary-color) truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-(--muted-foreground)">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-(--primary-color) shrink-0">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 bg-gray-50/50 space-y-2 text-sm">
          <div className="flex justify-between text-(--muted-foreground)">
            <span>Subtotal</span>
            <span>${(itemsSubtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-(--muted-foreground)">
            <span>Shipping</span>
            <span>${(shipping / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-(--primary-color) text-base pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${(order.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tracking info */}
      {order.status === "SHIPPED" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-(--primary-color) flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-blue-600" />
            Shipment Tracking
          </h3>
          {order.trackingNumber ? (
            <p className="text-sm font-mono text-(--primary-color)">{order.trackingNumber}</p>
          ) : (
            <p className="text-sm text-(--muted-foreground)">Your order has been shipped. Tracking number will be available soon.</p>
          )}
          {order.shippedAt && (
            <p className="text-xs text-(--muted-foreground) mt-2">
              Shipped on{" "}
              {new Date(order.shippedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      )}

      {/* Shipping address */}
      {order.address && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-(--primary-color) flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" />
            Shipping Address
          </h3>
          <div className="text-sm text-(--primary-color) leading-relaxed">
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
            <p className="text-(--muted-foreground)">{order.address.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}
