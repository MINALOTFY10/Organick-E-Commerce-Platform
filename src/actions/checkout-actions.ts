"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth-utils";
import type { CheckoutState } from "@/lib/checkout-constants";
import { SHIPPING_COST_CENTS, CURRENCY, DEFAULT_COUNTRY } from "@/lib/checkout-constants";
import { stripe } from "@/lib/stripe";

export async function placeOrder(prevState: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const userId = await getUserId();
  if (!userId) {
    return {
      success: false,
      message: "User not authenticated.",
      errors: {}
    };
  }

  const rawFormData = {
    street: formData.get("street") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postalCode: formData.get("postalCode") as string,
    country: formData.get("country") as string || DEFAULT_COUNTRY,
  };

  if (!rawFormData.street || !rawFormData.city || !rawFormData.postalCode) {
    return {
      success: false,
      message: "Please fill in all required fields.",
      errors: {}
    };
  }

  // Validate field lengths
  if (rawFormData.street.length > 500 || rawFormData.city.length > 200 ||
      rawFormData.state.length > 200 || rawFormData.postalCode.length > 20 ||
      rawFormData.country.length > 100) {
    return {
      success: false,
      message: "One or more fields exceed the maximum length.",
      errors: {},
    };
  }

  let redirectUrl: string;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty.",
        errors: {},
      };
    }

    // Validate stock availability before creating Stripe session
    const outOfStockItems = cart.items.filter(
      (item) => item.product.stock < item.quantity,
    );
    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map((i) => i.product.name).join(", ");
      return {
        success: false,
        message: `Insufficient stock for: ${names}. Please update your cart.`,
        errors: {},
      };
    }

    const lineItems = cart.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.salePrice && item.product.salePrice > 0
          ? item.product.salePrice
          : item.product.price,
      },
    }));

    if (SHIPPING_COST_CENTS > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          product_data: { name: "Shipping" },
          unit_amount: SHIPPING_COST_CENTS,
        },
      });
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

    if (!appUrl) {
      throw new Error(
        "Missing NEXT_PUBLIC_APP_URL or APP_URL. Set it in your environment variables.",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: cart.id,
      customer_email: user?.email ?? undefined,
      line_items: lineItems,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=1`,
      metadata: {
        userId,
        street: rawFormData.street,
        city: rawFormData.city,
        state: rawFormData.state,
        postalCode: rawFormData.postalCode,
        country: rawFormData.country,
      },
    });

    if (!session.url) {
      throw new Error("Stripe session missing redirect URL");
    }

    redirectUrl = session.url;
  } catch (e) {
    console.error("Checkout Error:", e instanceof Error ? e.message : "Unknown error");
    return {
      success: false,
      message: "Failed to start checkout. Please try again.",
      errors: {},
    };
  }

  redirect(redirectUrl);
}
