import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Truck, ShoppingBag } from "lucide-react";
import { getUserId } from "@/lib/auth-utils";
import { formatCents } from "@/lib/constants/currency";
import { SHIPPING_COST_CENTS } from "@/lib/checkout-constants";

export const metadata = {
  title: "Thank You | Organic Store",
  description: "Order confirmation page for Organic Store",
};

export default async function ThankYouPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/");
  }

  const order = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    redirect("/shop");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="text-[#7EB693] w-12 h-12" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#274c5b] mb-4">Order Confirmed!</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Your order <span className="font-bold text-[#274c5b]">#{order.id.slice(0, 8).toUpperCase()}</span> has been placed successfully. 
            We&apos;re already gathering the freshest organic produce for you.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#274c5b] mb-6">Order Summary</h2>
            
            {/* Items List mapping to OrderItem schema  */}
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#F9F8F8] rounded-2xl p-2 shrink-0">
                    <img 
                      src={item.product.imageUrl || "/placeholder.png"} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#274c5b]">{item.product.name}</h3>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#274c5b]">{formatCents(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCents(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{formatCents(order.total - order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-bold text-[#274c5b]">Total</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#274c5b]">{formatCents(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link 
            href="/shop" 
            className="flex items-center justify-center gap-2 bg-white border-2 border-[#274c5b] text-[#274c5b] px-0 sm:px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition"
          >
            <ShoppingBag size={20} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}