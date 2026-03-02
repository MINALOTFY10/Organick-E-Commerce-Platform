"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {CheckoutState, SHIPPING_COST_CENTS } from "@/lib/checkout-constants";
import { placeOrder } from "@/actions/checkout-actions";
import { Loader2, MapPin, Truck, CreditCard, BookUser, Check } from "lucide-react";
import { formatCents } from "@/lib/constants/currency";

// --- Types ---

type SavedAddress = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

// Define the shape of the cart data passed from the server component
type CartData = {
  items: {
    id: string;
    quantity: number;
    product: {
      name: string;
      price: number;
      imageUrl: string | null;
    };
  }[];
};

// --- Helper Components ---

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full mt-6 bg-(--primary-color) text-white py-4 rounded-xl font-bold text-lg hover:bg-(--primary-color)/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondary-color)"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Redirecting to Stripe...
        </>
      ) : (
        <>
          <CreditCard size={20} /> Pay Securely
        </>
      )}
    </button>
  );
}

// --- Main Component ---

export default function CheckoutForm({
  cart,
  savedAddresses = [],
}: {
  cart: CartData;
  savedAddresses?: SavedAddress[];
}) {
  // 1. Define Initial State matching the Server Action return type
  const initialState: CheckoutState = {
    message: "",
    errors: {},
    success: false,
  };

  // 2. Hook up the Server Action
  const [state, action] = useActionState(placeOrder, initialState);

  // 3. Address selection state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [fields, setFields] = useState({ street: "", city: "", state: "", postalCode: "" });

  function selectAddress(addr: SavedAddress) {
    if (selectedAddressId === addr.id) {
      // Deselect
      setSelectedAddressId(null);
      setFields({ street: "", city: "", state: "", postalCode: "" });
    } else {
      setSelectedAddressId(addr.id);
      setFields({
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
      });
    }
  }

  // 4. Calculate Totals
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shippingCost = SHIPPING_COST_CENTS;
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#274c5b] mb-2 text-center">
          Checkout
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Complete your order to receive your organic goods.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Shipping Form (Span 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-[#eff6f1] p-2 rounded-full text-[#274c5b]">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-bold text-[#274c5b]">
                  Shipping Details
                </h2>
              </div>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookUser size={16} className="text-[#274c5b]" />
                    <span className="text-sm font-bold text-[#274c5b]">
                      Your Saved Addresses
                    </span>
                    <span className="text-xs text-gray-400 ml-1">— click to fill</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => selectAddress(addr)}
                          className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondary-color) ${
                            isSelected
                              ? "border-(--secondary-color) bg-(--secondary-color)/5"
                              : "border-gray-200 bg-gray-50 hover:border-(--secondary-color)/50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#274c5b] truncate">
                                {addr.street}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {addr.city}, {addr.state} {addr.postalCode}
                              </p>
                              <p className="text-xs text-gray-400">{addr.country}</p>
                            </div>
                            {isSelected && (
                              <Check size={16} className="text-(--secondary-color) shrink-0 mt-0.5" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <form action={action} className="space-y-5">
                {/* Street Address */}
                <div>
                  <label htmlFor="checkout-street" className="block text-sm font-bold text-(--primary-color) mb-2">
                    Street Address
                  </label>
                  <input
                    id="checkout-street"
                    name="street"
                    required
                    autoComplete="street-address"
                    placeholder="e.g. 123 Organic Lane, Apt 4B"
                    value={fields.street}
                    onChange={(e) => setFields((f) => ({ ...f, street: e.target.value }))}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* City & State Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="checkout-city" className="block text-sm font-bold text-(--primary-color) mb-2">
                      City
                    </label>
                    <input
                      id="checkout-city"
                      name="city"
                      required
                      autoComplete="address-level2"
                      placeholder="e.g. Cairo"
                      value={fields.city}
                      onChange={(e) => setFields((f) => ({ ...f, city: e.target.value }))}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-state" className="block text-sm font-bold text-(--primary-color) mb-2">
                      State / Province
                    </label>
                    <input
                      id="checkout-state"
                      name="state"
                      required
                      autoComplete="address-level1"
                      placeholder="e.g. Cairo Governorate"
                      value={fields.state}
                      onChange={(e) => setFields((f) => ({ ...f, state: e.target.value }))}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Zip & Country Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="checkout-postal" className="block text-sm font-bold text-(--primary-color) mb-2">
                      Postal Code
                    </label>
                    <input
                      id="checkout-postal"
                      name="postalCode"
                      required
                      autoComplete="postal-code"
                      placeholder="e.g. 11311"
                      value={fields.postalCode}
                      onChange={(e) => setFields((f) => ({ ...f, postalCode: e.target.value }))}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-country" className="block text-sm font-bold text-(--primary-color) mb-2">
                      Country
                    </label>
                    <input
                      id="checkout-country"
                      name="country"
                      defaultValue="Egypt"
                      readOnly
                      className="w-full p-4 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                {/* Error Message Display */}
                {state.message && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-pulse">
                    ⚠️ {state.message}
                  </div>
                )}

                <SubmitButton />
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary (Span 5) */}
          <div className="lg:col-span-5">
            <div className="bg-[#F9F8F8] p-8 rounded-3xl sticky top-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#274c5b] mb-6 flex items-center gap-2">
                Order Summary
                <span className="text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                  {cart.items.length} items
                </span>
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-8 max-h-100 overflow-y-auto custom-scrollbar pr-2">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="h-16 w-16 bg-[#F9F8F8] rounded-lg p-2 shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#274c5b] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium">
                        Qty: {item.quantity} × {formatCents(item.product.price)}
                      </p>
                    </div>
                    <p className="font-bold text-[#274c5b] text-lg">
                      {formatCents(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-6 border-t-2 border-dashed border-gray-200">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span>{formatCents(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Truck size={16} /> Shipping
                  </span>
                  <span>{formatCents(shippingCost)}</span>
                </div>
                
                <div className="h-px bg-gray-200 my-2" />
                
                <div className="flex justify-between text-[#274c5b] font-extrabold text-2xl items-end">
                  <span>Total</span>
                  <span>{formatCents(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}