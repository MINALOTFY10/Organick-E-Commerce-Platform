import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "@/app/checkout/_components/checkout-form";
import { getUserId } from "@/lib/auth-utils";
import { getAddresses } from "@/actions/address-actions";
import Link from "next/link";

export const metadata = {
  title: "Checkout | Organic Store",
};

type CheckoutSearchParams = {
  canceled?: string;
  error?: string;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<CheckoutSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const feedback = (() => {
    if (resolvedParams?.error) {
      const errorMessages: Record<string, string> = {
        cart_empty:
          "We couldn't find any items to charge. Please add products to your cart and try again.",
        stock_changed:
          "Some items sold out while you were checking out. Review your cart and adjust quantities before retrying.",
        shipping_missing:
          "Shipping details were incomplete. Please fill out the form again.",
        session_mismatch:
          "We couldn't match that payment session to your account. Please sign in and try again.",
        unpaid_session:
          "Stripe hasn't confirmed the payment yet. If you were charged, contact support with your receipt.",
        missing_session:
          "We didn't receive a payment reference from Stripe. Please restart checkout.",
        payment_processing:
          "Something went wrong while finalizing payment. Please try again in a moment.",
      };

      console.error(
        "Checkout returned with error code:",
        Object.hasOwn(errorMessages, resolvedParams.error)
          ? resolvedParams.error
          : "unknown",
      );

      return {
        tone: "error" as const,
        message:
          errorMessages[resolvedParams.error] ??
          "We couldn't finalize your payment. Please try again or contact support if the issue persists.",
      };
    }

    if (resolvedParams?.canceled) {
      return {
        tone: "info" as const,
        message: "Payment canceled. Your cart is still saved if you'd like to retry.",
      };
    }

    return null;
  })();

  const savedAddressesResult = await getAddresses();
  const savedAddresses =
    savedAddressesResult && !("success" in savedAddressesResult)
      ? savedAddressesResult
      : [];

  const cart = await prisma.cart.findUnique({
    where: { userId: userId! },
    include: {
      items: {
        include: { product: true },
        orderBy: { product: { name: "asc" } },
      },
    },
  });

  const cartItems = cart?.items ?? [];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        {feedback && (
          <div
            className={`w-full max-w-md px-6 py-4 text-sm font-medium rounded-2xl ${
              feedback.tone === "error"
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            }`}
          >
            {feedback.message}
          </div>
        )}
        <h1 className="text-3xl font-bold text-[#274c5b]">Your cart is empty</h1>
        <p className="text-gray-500">Add some products before checking out.</p>
        <Link
          href="/"
          className="bg-[#7EB693] text-white px-6 py-3 rounded-full font-bold hover:bg-[#6da582] transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      {feedback && (
        <div
          className={`mx-auto max-w-4xl px-6 py-4 mt-6 text-sm font-medium rounded-2xl ${
            feedback.tone === "error"
              ? "bg-red-50 text-red-700 border border-red-100"
              : "bg-amber-50 text-amber-700 border border-amber-100"
          }`}
        >
          {feedback.message}
        </div>
      )}
      <CheckoutForm cart={{ items: cartItems }} savedAddresses={savedAddresses} />
    </>
  );
}
