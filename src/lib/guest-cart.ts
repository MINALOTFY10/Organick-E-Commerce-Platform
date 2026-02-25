import { cookies } from "next/headers";

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

const GUEST_CART_COOKIE = "guest_cart";

export async function getGuestCartItems(): Promise<GuestCartItem[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "productId" in item &&
          "quantity" in item &&
          typeof (item as { productId: unknown }).productId === "string" &&
          typeof (item as { quantity: unknown }).quantity === "number"
        ) {
          return {
            productId: (item as { productId: string }).productId,
            quantity: Math.max(1, Math.trunc((item as { quantity: number }).quantity)),
          } satisfies GuestCartItem;
        }
        return null;
      })
      .filter((item): item is GuestCartItem => item !== null);
  } catch {
    return [];
  }
}

export async function clearGuestCartCookie() {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_CART_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
}
