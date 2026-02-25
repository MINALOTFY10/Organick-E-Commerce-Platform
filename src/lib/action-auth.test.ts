import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@/lib/auth";

// Mock auth-utils — the decorators call requireAuth / requireAdmin / requireSuperAdmin
vi.mock("@/lib/auth-utils", () => ({
  getServerSession: vi.fn(),
  requireAuth: vi.fn(),
  requireAdmin: vi.fn(),
  requireSuperAdmin: vi.fn(),
}));

import { requireAuth, requireAdmin, requireSuperAdmin } from "@/lib/auth-utils";
import { withAuth, withAdmin, withSuperAdmin, withOwnership } from "@/lib/action-auth";

const mockRequireAuth = vi.mocked(requireAuth);
const mockRequireAdmin = vi.mocked(requireAdmin);
const mockRequireSuperAdmin = vi.mocked(requireSuperAdmin);

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
    role: "USER",
    image: null,
  },
} as Session;

beforeEach(() => {
  vi.clearAllMocks();
});

// --- withAuth ---
describe("withAuth", () => {
  it("passes session and args to the wrapped function", async () => {
    mockRequireAuth.mockResolvedValue(fakeSession);
    const inner = vi.fn().mockResolvedValue({ success: true, message: "ok" });
    const action = withAuth(inner);

    const result = await action("arg1", 42);

    expect(mockRequireAuth).toHaveBeenCalledOnce();
    expect(inner).toHaveBeenCalledWith(fakeSession, "arg1", 42);
    expect(result).toEqual({ success: true, message: "ok" });
  });

  it("propagates the redirect thrown by requireAuth when unauthenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("NEXT_REDIRECT"));
    const inner = vi.fn();
    const action = withAuth(inner);

    await expect(action()).rejects.toThrow("NEXT_REDIRECT");
    expect(inner).not.toHaveBeenCalled();
  });
});

// --- withAdmin ---
describe("withAdmin", () => {
  it("passes session to the wrapped function when user is admin", async () => {
    const adminSession = {
      ...fakeSession,
      user: { ...fakeSession.user, role: "ADMIN" },
    } as Session;
    mockRequireAdmin.mockResolvedValue(adminSession);

    const inner = vi.fn().mockResolvedValue("done");
    const action = withAdmin(inner);

    const result = await action();
    expect(inner).toHaveBeenCalledWith(adminSession);
    expect(result).toBe("done");
  });

  it("propagates redirect when user is not admin", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));
    const inner = vi.fn();
    const action = withAdmin(inner);

    await expect(action()).rejects.toThrow("NEXT_REDIRECT");
    expect(inner).not.toHaveBeenCalled();
  });
});

// --- withSuperAdmin ---
describe("withSuperAdmin", () => {
  it("passes session to the wrapped function when user is super admin", async () => {
    const superSession = {
      ...fakeSession,
      user: { ...fakeSession.user, role: "SUPER_ADMIN" },
    } as Session;
    mockRequireSuperAdmin.mockResolvedValue(superSession);

    const inner = vi.fn().mockResolvedValue(42);
    const action = withSuperAdmin(inner);

    const result = await action("x");
    expect(inner).toHaveBeenCalledWith(superSession, "x");
    expect(result).toBe(42);
  });
});

// --- withOwnership ---
describe("withOwnership", () => {
  it("allows action when the session user owns the resource", async () => {
    mockRequireAuth.mockResolvedValue(fakeSession);
    const getOwnerId = vi.fn().mockResolvedValue("user-1"); // matches fakeSession.user.id
    const inner = vi.fn().mockResolvedValue({ success: true, message: "updated" });

    const action = withOwnership(getOwnerId, inner);
    const result = await action("resource-1");

    expect(getOwnerId).toHaveBeenCalledWith("resource-1");
    expect(inner).toHaveBeenCalledWith(fakeSession, "resource-1");
    expect(result).toEqual({ success: true, message: "updated" });
  });

  it("returns failure when the session user does NOT own the resource", async () => {
    mockRequireAuth.mockResolvedValue(fakeSession);
    const getOwnerId = vi.fn().mockResolvedValue("other-user");
    const inner = vi.fn();

    const action = withOwnership(getOwnerId, inner);
    const result = await action("resource-1");

    expect(inner).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "You do not have permission to modify this resource.",
    });
  });

  it("returns failure when getOwnerId returns null (resource not found)", async () => {
    mockRequireAuth.mockResolvedValue(fakeSession);
    const getOwnerId = vi.fn().mockResolvedValue(null);
    const inner = vi.fn();

    const action = withOwnership(getOwnerId, inner);
    const result = await action("missing");

    expect(inner).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: "You do not have permission to modify this resource.",
    });
  });

  it("propagates redirect when user is not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("NEXT_REDIRECT"));
    const getOwnerId = vi.fn();
    const inner = vi.fn();

    const action = withOwnership(getOwnerId, inner);
    await expect(action()).rejects.toThrow("NEXT_REDIRECT");
    expect(getOwnerId).not.toHaveBeenCalled();
    expect(inner).not.toHaveBeenCalled();
  });
});
