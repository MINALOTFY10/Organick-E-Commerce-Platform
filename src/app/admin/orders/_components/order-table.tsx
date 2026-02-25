"use client";

import { useState } from "react";
import { CheckSquare, Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/data-table";
import { formatCents } from "@/lib/constants/currency";
import { bulkUpdateOrderStatus } from "@/actions/order-actions";

const ORDER_STATUSES = ["PENDING", "COMPLETED", "CANCELLED"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

interface OrderRow {
  id: string;
  total: number;
  createdAt: string | Date;
  status: string;
  user: {
    name: string | null;
    email: string;
  };
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    COMPLETED: "bg-emerald-500/20 text-emerald-400",
    PENDING: "bg-yellow-500/20 text-yellow-400",
    CANCELLED: "bg-red-500/20 text-red-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${styles[status] || "bg-gray-500/20 text-gray-400"}`}>{status}</span>
  );
};

export default function OrderTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("COMPLETED");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleBulkUpdate = async () => {
    if (!confirm(`Set ${selectedIds.size} order${selectedIds.size === 1 ? "" : "s"} to ${bulkStatus}?`)) return;
    setBulkLoading(true);
    setBulkMessage(null);
    const result = await bulkUpdateOrderStatus(Array.from(selectedIds), bulkStatus);
    setBulkLoading(false);
    setSelectedIds(new Set());
    setBulkMessage({ success: result.success, text: result.message });
    if (result.success) router.refresh();
  };

  const columns: Column<OrderRow>[] = [
    {
      header: "ORDER ID",
      cell: (order) => <span className="font-mono text-[#00ff7f]">#{order.id.slice(0, 8).toUpperCase()}</span>,
    },
    {
      header: "CUSTOMER",
      cell: (order) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{order.user.name}</span>
          <span className="text-xs text-gray-500">{order.user.email}</span>
        </div>
      ),
    },
    {
      header: "AMOUNT",
      cell: (order) => <span className="text-white font-bold">{formatCents(order.total)}</span>,
    },
    {
      header: "CREATED AT",
      cell: (order) => <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "STATUS",
      cell: (order) => <StatusBadge status={order.status} />,
    },
  ];

  const EmptyState = (
    <>
      <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
      <p className="text-gray-400 font-semibold">No orders found</p>
    </>
  );

  return (
    <div className="space-y-3">
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-[#0d2820] border border-[#2a4d42] rounded-xl px-5 py-3">
          <span className="text-sm text-gray-300 font-medium">
            {selectedIds.size} order{selectedIds.size === 1 ? "" : "s"} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
              className="bg-[#1a3d32] border border-[#2a4d42] text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00ff7f] cursor-pointer"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleBulkUpdate}
              disabled={bulkLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ff7f]/20 text-[#00ff7f] rounded-lg text-sm font-semibold hover:bg-[#00ff7f]/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
              Apply to selected
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
        data={orders}
        columns={columns}
        emptyState={EmptyState}
        onRowClick={(order) => router.push(`/admin/orders/${order.id}`)}
        selectable
        getRowId={(o) => o.id}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}

