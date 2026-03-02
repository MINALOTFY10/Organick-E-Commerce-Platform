import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getUserId } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import {
  SHIPPING_COST_CENTS,
  CART_EMPTY_ERROR,
  STOCK_ERROR_PREFIX,
  SHIPPING_ERROR,
  DEFAULT_COUNTRY,
} from "@/lib/checkout-constants";
import { getGuestCartItems, clearGuestCartCookie } from "@/lib/guest-cart";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const sessionId = resolvedParams?.session_id;

  if (!sessionId) {
    redirect("/checkout?error=missing_session");
  }

  const userId = await getUserId();
  if (!userId) {
    redirect("/login");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isGuestOrder = session.metadata?.isGuest === "true";

    if (!isGuestOrder) {
      // Authenticated orders: validate session owner matches current user
      if (session.metadata?.userId !== userId) {
        redirect("/checkout?error=session_mismatch");
      }
    }

    if (session.payment_status !== "paid") {
      redirect("/checkout?error=unpaid_session");
    }

    const orderUserId = session.metadata?.userId;
    if (!orderUserId) redirect("/checkout?error=payment_processing");

    await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { stripeSessionId: sessionId },
      });
      if (existing) return;

      const shipping = {
        street: session.metadata?.street ?? "",
        city: session.metadata?.city ?? "",
        state: session.metadata?.state ?? "",
        postalCode: session.metadata?.postalCode ?? "",
        country: session.metadata?.country ?? DEFAULT_COUNTRY,
      };

      if (!shipping.street || !shipping.city || !shipping.postalCode) {
        throw new Error(SHIPPING_ERROR);
      }

      // ── Determine which items to order ────────────────────────────────────
      type OrderItemInput = { productId: string; quantity: number; price: number; categoryId: string | null };
      let orderItemsData: OrderItemInput[];
      let subtotal: number;

      if (isGuestOrder) {
        // Guest: read cookie cart (still present on this request)
        const guestItems = await getGuestCartItems();
        if (guestItems.length === 0) throw new Error(CART_EMPTY_ERROR);

        const products = await tx.product.findMany({
          where: { id: { in: guestItems.map((i) => i.productId) } },
          select: { id: true, price: true, salePrice: true, categoryId: true },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));

        orderItemsData = guestItems.map((item) => {
          const p = productMap.get(item.productId);
          if (!p) throw new Error(CART_EMPTY_ERROR);
          const unitPrice = p.salePrice && p.salePrice > 0 ? p.salePrice : p.price;
          return { productId: item.productId, quantity: item.quantity, price: unitPrice, categoryId: p.categoryId };
        });

        subtotal = orderItemsData.reduce((s, i) => s + i.price * i.quantity, 0);
      } else {
        // Authenticated: use DB cart
        const cart = await tx.cart.findUnique({
          where: { userId: orderUserId },
          include: { items: { include: { product: true } } },
        });
        if (!cart || cart.items.length === 0) throw new Error(CART_EMPTY_ERROR);

        orderItemsData = cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.salePrice && item.product.salePrice > 0
            ? item.product.salePrice
            : item.product.price,
          categoryId: item.product.categoryId,
        }));

        subtotal = orderItemsData.reduce((s, i) => s + i.price * i.quantity, 0);
      }

      const total = subtotal + SHIPPING_COST_CENTS;

      // ── Upsert address ────────────────────────────────────────────────────
      let address = await tx.address.findFirst({ where: { userId: orderUserId, ...shipping } });
      if (!address) {
        address = await tx.address.create({ data: { userId: orderUserId, ...shipping } });
      }

      // ── Create order ──────────────────────────────────────────────────────
      await tx.order.create({
        data: {
          userId: orderUserId,
          addressId: address.id,
          total,
          status: "PENDING",
          stripeSessionId: sessionId,
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              categoryId: item.categoryId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // ── Decrement stock ───────────────────────────────────────────────────
      for (const item of orderItemsData) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) throw new Error(`${STOCK_ERROR_PREFIX}:${item.productId}`);
      }

      // ── Clear DB cart for authenticated users ─────────────────────────────
      if (!isGuestOrder) {
        const cart = await tx.cart.findUnique({ where: { userId: orderUserId }, select: { id: true } });
        if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    });

    // ── Clear guest cookie after successful transaction ────────────────────
    if (isGuestOrder) {
      await clearGuestCartCookie();
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Stripe success handler error:", error instanceof Error ? error.message : "Unknown error");

    if (error instanceof Error) {
      if (error.message.startsWith(STOCK_ERROR_PREFIX)) {
        redirect("/checkout?error=stock_changed");
      }

      if (error.message === CART_EMPTY_ERROR) {
        redirect("/checkout?error=cart_empty");
      }

      if (error.message === SHIPPING_ERROR) {
        redirect("/checkout?error=shipping_missing");
      }
    }

    redirect("/checkout?error=payment_processing");
  }

  after(() => revalidatePath("/", "layout"));
  redirect("/thankyou");
}
