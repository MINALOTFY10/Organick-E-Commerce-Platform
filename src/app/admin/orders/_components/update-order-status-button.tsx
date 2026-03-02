"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, Clock, Truck } from "lucide-react";
import { updateOrderStatus } from "@/actions/order-actions";

export function UpdateOrderStatusButton({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleStatusSelect = (value: string) => {
    if (value === "SHIPPED") {
      setPendingStatus("SHIPPED");
      setShowMenu(false);
    } else {
      handleStatusUpdate(value);
    }
  };

  const handleStatusUpdate = async (newStatus: string, tracking?: string) => {
    if (newStatus === currentStatus && !tracking) {
      setShowMenu(false);
      setPendingStatus(null);
      return;
    }

    setLoading(true);
    const result = await updateOrderStatus(orderId, newStatus, tracking || undefined);
    if (!result.success) {
      alert(result.message);
    } else {
      router.refresh();
      setShowMenu(false);
      setPendingStatus(null);
      setTrackingNumber("");
    }
    setLoading(false);
  };

  const statuses = [
    { value: "PENDING",   label: "Pending",   icon: Clock,        color: "text-yellow-600" },
    { value: "SHIPPED",   label: "Shipped",   icon: Truck,        color: "text-blue-600"   },
    { value: "COMPLETED", label: "Completed", icon: CheckCircle,  color: "text-green-600"  },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle,      color: "text-red-600"    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="px-4 py-2 bg-[#00ff7f] text-slate-700 rounded-lg hover:bg-[#00ff7f] transition-colors font-bold text-md cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </span>
        ) : (
          "Update Status"
        )}
      </button>

      {showMenu && !loading && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
            {statuses.map((status) => {
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusSelect(status.value)}
                  className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 cursor-pointer ${
                    currentStatus === status.value ? "bg-slate-50" : ""
                  }`}
                >
                  <Icon className={`w-4 h-4 ${status.color}`} />
                  <span className="text-sm font-medium text-slate-700">{status.label}</span>
                  {currentStatus === status.value && (
                    <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Tracking number modal for SHIPPED */}
      {pendingStatus === "SHIPPED" && !loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Mark as Shipped
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Enter a tracking number (optional).
            </p>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setPendingStatus(null); setTrackingNumber(""); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate("SHIPPED", trackingNumber || undefined)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
