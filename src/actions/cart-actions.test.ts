import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";

// ── Mocks ────────────────────────────────────────────────────────────
const mockRequireAuth = vi.fn();

vi.mock("@/lib/auth-utils", () => ({
  getServerSession: vi.fn(),
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cartItem: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    cart: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getServerSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  updateCartItemQuantity,
  removeCartItem,
  addItemToCart,
  getCartCount,
} from "@/actions/cart-actions";
import type { Cart, CartItem } from "@/generated/prisma/client";

const mockGetSession = vi.mocked(getServerSession);
const mockCartItem = vi.mocked(prisma.cartItem);
const mockCart = vi.mocked(prisma.cart);

type CartItemFindUniqueResult = (CartItem & { cart: { userId: string } }) | null;

const fakeSession: Session = {
  session: {
    id: "sess-1",
    userId: "user-1",
    expiresAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    token: "tok",
    ipAddress: null,
    userAgent: null,
  },
  user: {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "CUSTOMER",
    image: null,
  },
} as Session;

beforeEach(() => {
  vi.clearAllMocks();
  // Default: authenticated user. Override per-test when testing unauthenticated.
  mockRequireAuth.mockResolvedValue(fakeSession);
});

// ── updateCartItemQuantity ───────────────────────────────────────────
describe("updateCartItemQuantity", () => {
  it("returns error when quantity < 1", async () => {
    mockCartItem.findUnique.mockResolvedValue({
      id: "item-1",
      cart: { userId: "user-1" },
    } as unknown as CartItemFindUniqueResult);

    const result = await updateCartItemQuantity("item-1", 0);
    expect(result).toEqual({ success: false, message: "Quantity must be at least 1." });
  });

  it("updates the item and returns success", async () => {
    mockCartItem.findUnique.mockResolvedValue({
      id: "item-1",
      cart: { userId: "user-1" },
    } as unknown as CartItemFindUniqueResult);
    mockCartItem.update.mockResolvedValue({} as unknown as CartItem);

    const result = await updateCartItemQuantity("item-1", 3);
    expect(result).toEqual({ success: true, message: "Cart updated." });
  });

  it("returns error when user does not own the cart item", async () => {
    mockCartItem.findUnique.mockResolvedValue({
      id: "item-1",
      cart: { userId: "other-user" },
    } as unknown as CartItemFindUniqueResult);

    const result = await updateCartItemQuantity("item-1", 2);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/permission/i);
  });

  it("throws redirect when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(updateCartItemQuantity("item-1", 2)).rejects.toThrow("NEXT_REDIRECT");
  });
});

// ── removeCartItem ───────────────────────────────────────────────────
describe("removeCartItem", () => {
  it("removes the item and returns success", async () => {
    mockCartItem.findUnique.mockResolvedValue({
      id: "item-1",
      cart: { userId: "user-1" },
    } as unknown as CartItemFindUniqueResult);
    mockCartItem.delete.mockResolvedValue({} as unknown as CartItem);

    const result = await removeCartItem("item-1");
    expect(result).toEqual({ success: true, message: "Item removed from cart." });
    expect(mockCartItem.delete).toHaveBeenCalledWith({ where: { id: "item-1" } });
  });

  it("returns error when item not found", async () => {
    mockCartItem.findUnique.mockResolvedValue(null);

    const result = await removeCartItem("item-missing");
    expect(result.success).toBe(false);
  });
});

// ── addItemToCart ─────────────────────────────────────────────────────
describe("addItemToCart", () => {
  it("throws redirect when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(addItemToCart("product-1", 1)).rejects.toThrow("NEXT_REDIRECT");
  });

  it("creates a new cart item when product is not yet in cart", async () => {
    mockCart.upsert.mockResolvedValue({
      id: "cart-1",
      userId: "user-1",
      createdAt: new Date(),
    } as unknown as Cart);
    mockCartItem.upsert.mockResolvedValue({} as unknown as CartItem);

    const result = await addItemToCart("product-1", 2);
    expect(result).toEqual({ success: true, message: "Item added to cart." });
  });

  it("increments quantity when product already exists in cart", async () => {
    mockCart.upsert.mockResolvedValue({
      id: "cart-1",
      userId: "user-1",
      createdAt: new Date(),
    } as unknown as Cart);
    mockCartItem.upsert.mockResolvedValue({} as unknown as CartItem);

    const result = await addItemToCart("product-1", 2);
    expect(result).toEqual({ success: true, message: "Item added to cart." });
  });
});

// ── getCartCount ─────────────────────────────────────────────────────
describe("getCartCount", () => {
  it("returns 0 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    expect(await getCartCount()).toBe(0);
  });

  it("returns 0 when user has no cart", async () => {
    mockGetSession.mockResolvedValue(fakeSession);
    mockCart.findUnique.mockResolvedValue(null);
    expect(await getCartCount()).toBe(0);
  });

  it("returns item count from the cart", async () => {
    mockGetSession.mockResolvedValue(fakeSession);
    mockCart.findUnique.mockResolvedValue({
      id: "cart-1",
      userId: "user-1",
      createdAt: new Date(),
      _count: { items: 7 },
    } as unknown as Cart);
    expect(await getCartCount()).toBe(7);
  });
});
