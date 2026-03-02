"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import CartIcon from "./cart-icon";
import { getFullCart, updateCartItemQuantity, removeCartItem } from "@/actions/cart-actions";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { formatCents } from "@/lib/constants/currency";
import Link from "next/link";

type CartData = NonNullable<Awaited<ReturnType<typeof getFullCart>>>;
type CartLine = CartData["items"][number];

export default function CartButton({
  cartCount,
}: {
  cartCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const cartItems = cartData?.items ?? [];

  const handleMouseEnter = () => {
    if (!cartData && !loading) {
      getFullCart().then((data) => setCartData(data));
    }
  };

  const handleQuantityChange = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    setCartData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item,
        ),
      };
    });

    await updateCartItemQuantity(itemId, newQty);
  };

  const handleRemove = async (itemId: string) => {
    setCartData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      };
    });

    await removeCartItem(itemId);
  };

  const toggleCart = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      if (!cartData) setLoading(true);
      // Always re-fetch on open to guarantee fresh data;
      // preloaded cartData just skips the loading spinner.
      const data = await getFullCart();
      setCartData(data);
      setLoading(false);
    }
  };

  const totalPrice =
    cartData?.items.reduce((acc: number, item: CartLine) => acc + item.product.price * item.quantity, 0) ?? 0;

  return (
    <>
      {/* Trigger Button - Remains in the Nav flow */}
      <button
        onClick={toggleCart}
        onMouseEnter={handleMouseEnter}
        className="ml-4 flex items-center gap-1 rounded-full border text-[#274c5b] border-gray-300 bg-transparent px-3 py-1.5 text-sm transition hover:border-[#eff6f1] hover:bg-[#eff6f1] cursor-pointer"
      >
        <span className="h-6 w-4">
          <CartIcon />
        </span>
        <span>Cart</span>
        <span className="rounded-full text-primary">{`(${cartCount})`}</span>
      </button>

      {/* Slide-over Drawer - Rendered via Portal at the end of <body> */}
      {typeof document !== "undefined" && createPortal(
        <div 
          className={`fixed inset-0 z-[999] transition-opacity duration-300 ${
            isOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {/* Backdrop with Blur */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />

          <aside
            className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-extrabold text-[#274c5b] flex items-center gap-2">
                Your Cart <span className="text-sm font-normal text-gray-400">({cartCount} items)</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7EB693] border-t-transparent" />
                </div>
              ) : cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item: CartLine) => (
                    <div key={item.id} className="flex gap-4 items-start group">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F9F8F8] border border-gray-100">
                        <img 
                          src={item.product.imageUrl ?? "/img/product-example.png"} 
                          alt={item.product.name} 
                          className="h-full w-full object-contain p-2" 
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-[#274c5b] text-lg leading-tight">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-medium text-[#7EB693]">
                          {formatCents(item.product.price)}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3 bg-[#F9F8F8] rounded-lg px-2 py-1">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                              className="p-1 text-[#274c5b] hover:bg-white rounded-md shadow-sm transition-all disabled:opacity-30 cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              className="p-1 text-[#274c5b] hover:bg-white rounded-md shadow-sm transition-all cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-[#F9F8F8] p-6 rounded-full mb-4 text-gray-300">
                    <ShoppingBag size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-[#274c5b]">Cart is empty</h3>
                  <p className="text-gray-500 mt-2">
                    Looks like you haven&apos;t added<br />any organic goodness yet.
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="bg-white border-t border-gray-100 p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatCents(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#274c5b] font-extrabold text-xl">
                    <span>Total Amount</span>
                    <span>{formatCents(totalPrice)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-3 bg-[#274c5b] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#1e3a46] transition-all active:scale-[0.98] shadow-lg shadow-[#274c5b]/10 cursor-pointer"
                >
                  Go to Checkout <X className="rotate-45" size={18} />
                </Link>
              </div>
            )}
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}