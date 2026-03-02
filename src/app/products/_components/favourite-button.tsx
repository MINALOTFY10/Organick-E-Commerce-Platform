"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { toggleFavourite } from "@/actions/favourite-actions";

interface FavouriteButtonProps {
  productId: string;
  isFavourited: boolean;
  /** Extra classes applied to the outer button element. */
  className?: string;
}

function FavouriteToast({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [visible, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-3 bg-white border border-gray-100 shadow-lg rounded-2xl px-5 py-3.5 transition-all duration-300 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Heart size={18} className="fill-red-500 text-red-500 shrink-0" strokeWidth={1.5} />
      <span className="text-md text-gray-700 font-medium whitespace-nowrap">
        Product was added to favourites
      </span>
      <Link
        href="/account/favourites"
        onClick={onClose}
        className="text-sm font-semibold text-[#274C5B] hover:underline whitespace-nowrap ml-1"
      >
        View list
      </Link>
    </div>,
    document.body,
  );
}

export default function FavouriteButton({
  productId,
  isFavourited: initialFavourited,
  className,
}: FavouriteButtonProps) {
  const router = useRouter();
  const [favourited, setFavourited] = useState(initialFavourited);
  const [isPending, startTransition] = useTransition();
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update — revert if the server reports failure.
    const optimistic = !favourited;
    setFavourited(optimistic);

    startTransition(async () => {
      const result = await toggleFavourite(productId);

      if (!result.success) {
        // Revert optimistic update.
        setFavourited(favourited);
        if (result.message === "unauthenticated") {
          router.push("/login");
        }
        return;
      }

      if (result.data) {
        setFavourited(result.data.favourited);
        if (result.data.favourited) {
          // Clear any existing dismiss timer and show the toast.
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          setShowToast(true);
        }
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        className={`w-9 h-9 rounded-full bg-white flex items-center justify-center shadow transition-colors z-10 ${
          favourited ? "text-red-500" : "text-gray-400 hover:text-red-500"
        } ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className ?? ""}`}
      >
        <Heart
          size={18}
          strokeWidth={1.5}
          className={favourited ? "fill-red-500" : "fill-none"}
        />
      </button>
      <FavouriteToast visible={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}
