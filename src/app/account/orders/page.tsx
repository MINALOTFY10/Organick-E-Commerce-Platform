import Link from "next/link";
import { getMyOrders } from "@/actions/account-order-actions";
import { ShoppingBag, ChevronRight, Package } from "lucide-react";
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
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-red-600">Unable to load orders. Please try again later.</p>
      </div>
    );
  }

  const { orders, totalCount, totalPages } = result;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-(--primary-color)/5 p-4 md:p-5">
        <h2 className="text-2xl font-bold text-(--primary-color)">Order History</h2>
        <p className="text-sm text-(--muted-foreground) mt-1">
          {totalCount === 0
            ? "You haven't placed any orders yet."
            : `You have ${totalCount} order${totalCount === 1 ? "" : "s"}.`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 shadow-sm border border-gray-100 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="font-medium text-(--primary-color)">No orders yet</p>
          <p className="text-sm text-(--muted-foreground) mt-1">
            When you place an order, it will appear here.
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 bg-(--primary-color) text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
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

            return (
              <div
                key={order.id}
                className="flex items-center rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0 p-5"
                >
                  <div className="bg-(--primary-color)/5 p-3 rounded-xl shrink-0">
                    <Package className="w-5 h-5 text-(--primary-color)" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-(--primary-color)">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColors[order.status] ?? "bg-gray-50 text-gray-600"}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </div>
                    <p className="text-xs text-(--muted-foreground) mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-(--primary-color)">
                      ${(order.total / 100).toFixed(2)}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-(--primary-color) transition-colors shrink-0" />
                </Link>

                <div className="pr-4 shrink-0">
                  <ReorderButton orderId={order.id} compact />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {currentPage > 1 && (
            <Link
              href={`/account/orders?page=${currentPage - 1}`}
              className="px-4 py-2 rounded-xl text-sm font-medium text-(--primary-color) hover:bg-gray-100 transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-(--muted-foreground)">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/account/orders?page=${currentPage + 1}`}
              className="px-4 py-2 rounded-xl text-sm font-medium text-(--primary-color) hover:bg-gray-100 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
