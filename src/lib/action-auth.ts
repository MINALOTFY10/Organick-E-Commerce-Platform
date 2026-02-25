import { requireAuth, requireAdmin, requireSuperAdmin } from "./auth-utils";
import type { Session } from "./auth";
import type { ActionResult } from "@/types/action-result";

/**
 * Action-level auth decorators.
 *
 * These wrap server-action functions so that authorization is enforced
 * before the action body runs. Using these instead of manual
 * requireAdmin() calls makes it impossible to forget an auth check.
 *
 * Usage:
 *   export const deleteProduct = withAdmin(async (session, productId: string) => { ... });
 *   export const updateCart    = withAuth(async (session, itemId: string) => { ... });
 *
 * Return type is `TReturn | ActionResult` — on auth failure the decorator
 * short-circuits with an `ActionResult` failure object; otherwise the wrapped
 * function's own return value passes through unchanged.
 */

/**
 * Require an authenticated session. Redirects to /login if missing.
 */
export function withAuth<TArgs extends unknown[], TReturn>(
  fn: (session: Session, ...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn | ActionResult> => {
    const session = await requireAuth();
    return fn(session, ...args);
  };
}

/**
 * Require ADMIN or SUPER_ADMIN role. Redirects to /unauthorized if insufficient.
 */
export function withAdmin<TArgs extends unknown[], TReturn>(
  fn: (session: Session, ...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn | ActionResult> => {
    const session = await requireAdmin();
    return fn(session, ...args);
  };
}

/**
 * Require SUPER_ADMIN role. Redirects to /unauthorized if insufficient.
 */
export function withSuperAdmin<TArgs extends unknown[], TReturn>(
  fn: (session: Session, ...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn | ActionResult> => {
    const session = await requireSuperAdmin();
    return fn(session, ...args);
  };
}

/**
 * Verify that the authenticated user owns the resource.
 * Pass a lookup function that returns the owner's userId given the resource identifier.
 * Returns { success: false, message } if ownership check fails (does not redirect).
 */
export function withOwnership<TArgs extends unknown[], TReturn>(
  getOwnerId: (...args: TArgs) => Promise<string | null>,
  fn: (session: Session, ...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn | ActionResult> => {
    const session = await requireAuth();
    const ownerId = await getOwnerId(...args);

    if (!ownerId || ownerId !== session.user.id) {
      return { success: false, message: "You do not have permission to modify this resource." };
    }

    return fn(session, ...args);
  };
}
