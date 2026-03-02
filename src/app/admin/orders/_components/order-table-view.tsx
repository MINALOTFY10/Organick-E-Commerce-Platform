"use client";

import { useMemo } from "react";
import OrderTable from "@/app/admin/orders/_components/order-table";
import { useOrderFilters } from "./order-filters-provider";
import { Prisma } from "@/generated/prisma/browser";

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    items: {
      include: {
        product: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

interface Props {
  orders: OrderWithRelations[];
}

export default function OrderTableView({ orders }: Props) {
  const { search, status } = useOrderFilters();

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "ALL" || o.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] overflow-hidden">
      <OrderTable orders={filteredOrders} />
    </div>
  );
}
