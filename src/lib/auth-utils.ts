import { auth, Session, UserRole } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * Runtime type guard for admin roles.
 * Avoids silent `as UserRole` casts on values that come from the DB as plain
 * strings — if the value is unexpected, this returns false and access is denied.
 */
function isAdminRole(role: unknown): role is Extract<UserRole, "ADMIN" | "SUPER_ADMIN"> {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

function isSuperAdminRole(role: unknown): role is Extract<UserRole, "SUPER_ADMIN"> {
  return role === "SUPER_ADMIN";
}

/**
 * Get the current session on the server side.
 * Wrapped with React cache() to deduplicate within a single render pass.
 */
export const getServerSession = cache(async (): Promise<Session | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session as Session | null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
});

/**
 * Require authentication - throws redirect if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session || !session.user) {
    redirect("/login");
  }
  
  return session;
}

/**
 * Require admin role - throws redirect if not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (!isAdminRole(session.user.role)) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Require super admin role - throws redirect if not super admin
 */
export async function requireSuperAdmin() {
  const session = await requireAuth();

  if (!isSuperAdminRole(session.user.role)) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getServerSession();

  if (!session || !session.user) {
    return false;
  }

  return session.user.role === role;
}

/**
 * Check if current user is admin or super admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession();

  if (!session || !session.user) {
    return false;
  }

  return isAdminRole(session.user.role);
}

/**
 * Check if current user is super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getServerSession();

  if (!session || !session.user) {
    return false;
  }

  return isSuperAdminRole(session.user.role);
}

/**
 * Get current user's role.
 * Returns null rather than casting if the DB value is not a known role.
 */
export async function getUserRole(): Promise<UserRole | null> {
  const session = await getServerSession();

  if (!session || !session.user) {
    return null;
  }

  const { role } = session.user;
  if (isAdminRole(role) || role === "CUSTOMER") return role as UserRole;
  return null;
}

/**
 * Get current user's id
 */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSession();

  if (!session || !session.user) {
    return null;
  }
  return session.user.id;
}