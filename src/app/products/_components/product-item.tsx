"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Plus, Minus } from "lucide-react";
import { formatCents } from "@/lib/constants/currency";
import { Product } from "@/types/product";
import { addItemToCart, decrementCartItem } from "@/actions/cart-actions";
import FavouriteButton from "./favourite-button";

const NEW_PRODUCT_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000;
const BUILD_TIME_NOW_MS = Date.now();

interface ProductItemProps {
  product: Product;
  className?: string;
  isFavourited?: boolean;
}

export default function ProductItem({ product, className, isFavourited = false }: ProductItemProps) {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const isSoldOut = product.stock === 0;
  const isNew = BUILD_TIME_NOW_MS - new Date(product.createdAt).getTime() < NEW_PRODUCT_THRESHOLD_MS;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    setQuantity(1); // optimistic — show controls immediately
    addItemToCart(product.id, 1).then((result) => {
      if (result.success === false) setQuantity(0); // revert on failure
      setLoading(false);
    });
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((q) => q + 1);
    addItemToCart(product.id, 1); // increment by exactly 1
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((q) => Math.max(0, q - 1));
    decrementCartItem(product.id); // decrement by 1 or remove when hitting 0
  };

  return (
    <Link href={`/products/${product.id}`} className={`block h-full ${className}`}>
      <article className="group relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full cursor-pointer">
        {/* Top row: sold-out badge (left) + heart (right) */}
        <div className="flex items-center justify-between px-2 sm:px-3 pt-3 pb-1">
          {isSoldOut ?
            <span className="text-[12px] font-semibold text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">Sold out</span>
          : <span />}
          <FavouriteButton productId={product.id} isFavourited={isFavourited} />
        </div>

        {/* Image area */}
        <div className="relative mx-0 sm:mx-3 rounded-xl overflow-hidden bg-gray-50 aspect-square">
          <img
            src={product.imageUrl ?? "/img/product-example.png"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ minHeight: 0 }}
          />

          {/* NEW badge – bottom-left of image */}
          {isNew && (
            <span className="absolute bottom-2 left-2 bg-[#7B4FA6] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              New
            </span>
          )}

          {/* Cart control – bottom-right of image */}
          <div className="absolute bottom-2 right-2">
            {isSoldOut ?
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 border border-[#7B4FA6]/30 flex items-center justify-center text-[#7B4FA6] hover:bg-[#7B4FA6]/10 transition-colors shadow"
                aria-label="Notify me"
              >
                <Bell size={16} strokeWidth={1.5} />
              </button>
            : quantity === 0 ?
              <button
                onClick={handleAdd}
                disabled={loading}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-(--primary-color) flex items-center justify-center text-white shadow hover:bg-[#6a3f92] active:scale-95 transition-all disabled:opacity-60"
                aria-label="Add to cart"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            : <div className="flex items-center gap-1 bg-white rounded-full shadow px-1 py-0.5 border border-gray-100">
                <button
                  onClick={handleDecrease}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-(--primary-color)/10 flex items-center justify-center text-(--primary-color) hover:bg-(--primary-color)/20 transition-colors"
                  aria-label="Decrease"
                >
                  <Minus size={12} strokeWidth={2.5} />
                </button>
                <span className="text-gray-800 text-sm font-semibold w-5 text-center">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-(--primary-color) flex items-center justify-center text-white hover:bg-[--primary-color] transition-colors"
                  aria-label="Increase"
                >
                  <Plus size={12} strokeWidth={2.5} />
                </button>
              </div>
            }
          </div>
        </div>

        {/* Price + name */}
        <div className="px-3 sm:px-5 pt-2 pb-3 mt-auto">
          {product.salePrice ?
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{formatCents(product.salePrice)}</p>
              <p className="text-sm font-bold text-red-500 line-through">{formatCents(product.price)}</p>
            </div>
          : <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{typeof product.price === "number" ? formatCents(product.price) : "N/A"}</p>}
          <p className="text-sm sm:text-md text-gray-500 mt-0.5 leading-snug line-clamp-2 break-words">{product.name}</p>
        </div>
      </article>
    </Link>
  );
}
