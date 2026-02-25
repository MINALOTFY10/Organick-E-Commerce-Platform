"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { reorderItems } from "@/actions/account-order-actions";

interface ReorderButtonProps {
  orderId: string;
  /** When true renders a compact icon-only variant for list rows */
  compact?: boolean;
}

export function ReorderButton({ orderId, compact = false }: ReorderButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleClick() {
    startTransition(async () => {
      const result = await reorderItems(orderId);
      if (!result || ("success" in result && !result.success)) return;
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    });
  }

  if (compact) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault(); // prevent parent link navigation
          handleClick();
        }}
        disabled={isPending}
        title="Reorder"
        className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-(--primary-color) hover:text-white hover:border-(--primary-color) transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : done ? (
          <Check className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <ShoppingCart className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || done}
      className="flex items-center gap-2 bg-(--primary-color) text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1e3a47] transition-colors disabled:opacity-70"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : done ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {done ? "Added to cart!" : isPending ? "Adding…" : "Reorder"}
    </button>
  );
}
