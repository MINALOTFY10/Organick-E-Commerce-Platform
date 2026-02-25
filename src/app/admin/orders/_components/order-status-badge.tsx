"use client";

export function OrderStatusBadge({ status, large = false }: { status: string; large?: boolean }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "SHIPPED":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Shipped",
        };
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Completed",
        };
      case "PENDING":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          label: "Pending",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`${config.bg} ${config.text} rounded-full font-medium inline-flex items-center justify-center ${
        large ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"
      }`}
    >
      {config.label}
    </span>
  );
}
