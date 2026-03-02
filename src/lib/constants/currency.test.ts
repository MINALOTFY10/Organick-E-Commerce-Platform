import { describe, it, expect } from "vitest";
import { formatCents, toCents, toDollars } from "./currency";

describe("formatCents", () => {
  it("formats zero", () => {
    expect(formatCents(0)).toBe("$0.00");
  });

  it("formats whole dollar amounts", () => {
    expect(formatCents(100)).toBe("$1.00");
    expect(formatCents(1000)).toBe("$10.00");
    expect(formatCents(10000)).toBe("$100.00");
  });

  it("formats amounts with cents", () => {
    expect(formatCents(1299)).toBe("$12.99");
    expect(formatCents(1)).toBe("$0.01");
    expect(formatCents(50)).toBe("$0.50");
  });

  it("formats negative amounts", () => {
    expect(formatCents(-500)).toBe("$-5.00");
  });
});

describe("toCents", () => {
  it("converts whole dollar numbers", () => {
    expect(toCents(1)).toBe(100);
    expect(toCents(10)).toBe(1000);
  });

  it("converts fractional dollars", () => {
    expect(toCents(12.99)).toBe(1299);
    expect(toCents(0.01)).toBe(1);
    expect(toCents(0.5)).toBe(50);
  });

  it("rounds to nearest cent", () => {
    // 19.999 should round to 2000 cents ($20.00)
    expect(toCents(19.999)).toBe(2000);
    // 0.015 should round to 2 cents
    expect(toCents(0.015)).toBe(2);
  });

  it("accepts string input", () => {
    expect(toCents("12.99")).toBe(1299);
    expect(toCents("100")).toBe(10000);
  });

  it("throws on invalid input", () => {
    expect(() => toCents("abc")).toThrow("Invalid monetary value");
    expect(() => toCents(NaN)).toThrow("Invalid monetary value");
    expect(() => toCents(Infinity)).toThrow("Invalid monetary value");
  });
});

describe("toDollars", () => {
  it("converts cents to dollars", () => {
    expect(toDollars(1299)).toBe(12.99);
    expect(toDollars(100)).toBe(1);
    expect(toDollars(0)).toBe(0);
    expect(toDollars(1)).toBe(0.01);
  });
});
