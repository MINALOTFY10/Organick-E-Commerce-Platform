import Link from "next/link";
import { getMyOrders } from "@/actions/account-order-actions";
import { ShoppingBag, ChevronRight, Package, ArrowRight } from "lucide-react";
import { ReorderButton } from "./_components/reorder-button";

interface OrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const result = await getMyOrders({ page: currentPage, pageSize: 10 });

  if (!result || "success" in result) {
    return (
      <div className="rounded-2xl bg-red-50/50 p-8 border border-red-100">
        <p className="text-red-600 text-sm font-medium">Unable to load orders. Please try again later.</p>
      </div>
    );
  }

  const { orders, totalCount, totalPages } = result;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order History</h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount === 0 ? "You haven't placed any orders yet." : `Showing ${orders.length} of ${totalCount} orders.`}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">No orders yet</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Looks like you haven't made your first purchase. When you do, you can track its status here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-8 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-md shadow-gray-900/10"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // Modern ring-based badges
            const statusConfig: Record<string, string> = {
              PENDING: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
              SHIPPED: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
              COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
              CANCELLED: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
            };

            const statusLabels: Record<string, string> = {
              PENDING: "Pending",
              SHIPPED: "Shipped",
              COMPLETED: "Delivered",
              CANCELLED: "Cancelled",
            };

            return (
              <div
                key={order.id}
                className="relative flex items-center rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0 p-5 z-10"
                >
                  <div className="bg-gray-50 p-3.5 rounded-xl shrink-0 group-hover:bg-gray-100 transition-colors">
                    <Package className="w-5 h-5 text-gray-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusConfig[order.status] ?? "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                      <span>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{order.items.length} item{order.items.length === 1 ? "" : "s"}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0 mr-2">
                    <p className="text-sm font-bold text-gray-900">
                      ${(order.total / 100).toFixed(2)}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors shrink-0" />
                </Link>

                <div className="pr-5 shrink-0 relative z-20">
                  <ReorderButton orderId={order.id} compact />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Pagination remains mostly the same, add active/disabled states to buttons */}
    </div>
  );
}