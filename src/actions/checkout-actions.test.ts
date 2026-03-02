import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────
vi.mock("@/lib/auth-utils", () => ({
  getUserId: vi.fn(),
}));

const mockCartFindUnique = vi.fn();
const mockUserFindUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    cart: { findUnique: (...args: unknown[]) => mockCartFindUnique(...args) },
    user: { findUnique: (...args: unknown[]) => mockUserFindUnique(...args) },
  },
}));

const mockStripeCreate = vi.fn();

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: { create: (...args: unknown[]) => mockStripeCreate(...args) },
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

import { getUserId } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { type CheckoutState } from "@/lib/checkout-constants";
import { placeOrder } from "./checkout-actions";

const mockGetUserId = vi.mocked(getUserId);
const mockRedirect = vi.mocked(redirect);

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.append(key, value);
  }
  return fd;
}

const validAddress = {
  street: "123 Main St",
  city: "Cairo",
  state: "Cairo Gov",
  postalCode: "11511",
  country: "Egypt",
};

const prevState: CheckoutState = { message: "" };

beforeEach(() => {
  vi.clearAllMocks();
  // Default: set APP_URL so the env check passes
  process.env.NEXT_PUBLIC_APP_URL = "https://example.com";
});

// ─────────────────────────────────────────────────────────────────────
describe("placeOrder", () => {
  it("returns error when user is not authenticated", async () => {
    mockGetUserId.mockResolvedValue(null);

    const result = await placeOrder(prevState, makeFormData(validAddress));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/not authenticated/i);
  });

  it("returns validation error when required fields are missing", async () => {
    mockGetUserId.mockResolvedValue("user-1");

    const result = await placeOrder(
      prevState,
      makeFormData({ street: "", city: "", postalCode: "", state: "", country: "Egypt" }),
    );
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/required fields/i);
  });

  it("returns error when cart is empty", async () => {
    mockGetUserId.mockResolvedValue("user-1");
    mockCartFindUnique.mockResolvedValue({ id: "cart-1", items: [] });

    const result = await placeOrder(prevState, makeFormData(validAddress));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/cart is empty/i);
  });

  it("returns error when product has insufficient stock", async () => {
    mockGetUserId.mockResolvedValue("user-1");
    mockCartFindUnique.mockResolvedValue({
      id: "cart-1",
      items: [
        {
          productId: "prod-1",
          quantity: 5,
          product: { price: 1500, stock: 2, name: "Organic Apples", categoryId: "cat-1" },
        },
      ],
    });

    const result = await placeOrder(prevState, makeFormData(validAddress));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/insufficient stock/i);
  });

  it("redirects to Stripe checkout on success", async () => {
    mockGetUserId.mockResolvedValue("user-1");
    mockCartFindUnique.mockResolvedValue({
      id: "cart-1",
      items: [
        {
          productId: "prod-1",
          quantity: 2,
          product: { price: 1500, stock: 10, name: "Organic Apples", categoryId: "cat-1" },
        },
      ],
    });
    mockUserFindUnique.mockResolvedValue({ email: "test@example.com" });
    mockStripeCreate.mockResolvedValue({
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });

    await expect(placeOrder(prevState, makeFormData(validAddress))).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("https://checkout.stripe.com/pay/cs_test_123");
  });

  it("returns error when Stripe session has no URL", async () => {
    mockGetUserId.mockResolvedValue("user-1");
    mockCartFindUnique.mockResolvedValue({
      id: "cart-1",
      items: [
        {
          productId: "prod-1",
          quantity: 1,
          product: { price: 1000, stock: 5, name: "Lettuce", categoryId: "cat-1" },
        },
      ],
    });
    mockUserFindUnique.mockResolvedValue({ email: "test@example.com" });
    mockStripeCreate.mockResolvedValue({ url: null });

    const result = await placeOrder(prevState, makeFormData(validAddress));
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/failed to start checkout/i);
  });
});
