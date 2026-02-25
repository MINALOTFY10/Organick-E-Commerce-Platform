"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { withAdmin } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import {
  findAdminDashboardStats,
  findUsers,
  findUserRoleStats,
  updateUser as dbUpdateUser,
  deleteUser as dbDeleteUser,
  bulkDeleteUsers as dbBulkDeleteUsers,
} from "@/lib/data/user";
import type { FindUsersParams, UpdateUserInput } from "@/lib/data/user";
import type { ActionResult } from "@/types/action-result";
import { revalidatePath } from "next/cache";

// Re-export so callers don't need to import from lib/data
export type { FindUsersParams, UpdateUserInput } from "@/lib/data/user";

/** High-level stats for the admin dashboard. */
export async function getUserStats() {
  await requireAdmin();
  return findAdminDashboardStats();
}

/** User counts grouped by role — admin user page stats cards. */
export async function getUserRoleStats() {
  await requireAdmin();
  return findUserRoleStats();
}

/** Paginated user list with order counts — admin user table. */
export async function getUsers(params: FindUsersParams = {}) {
  await requireAdmin();
  return findUsers(params);
}

/** Update a user's name, role, or verification status. */
export const updateUserAction = withAdmin(
  async (_session, id: string, data: UpdateUserInput): Promise<ActionResult> =>
    tryCatch(async () => {
      await dbUpdateUser(id, data);
      revalidatePath("/admin/users");
      revalidatePath(`/admin/users/${id}`);
      return "User updated successfully.";
    }, "Failed to update user."),
);

/** Delete a single user by id. */
export const deleteUserAction = withAdmin(
  async (_session, id: string): Promise<ActionResult> =>
    tryCatch(async () => {
      if (!id?.trim()) throw new Error("User id is required.");
      await dbDeleteUser(id);
      revalidatePath("/admin/users");
      return "User deleted.";
    }, "Failed to delete user."),
);

/** Delete multiple users by id. */
export const bulkDeleteUsers = withAdmin(
  async (_session, ids: string[]): Promise<ActionResult> =>
    tryCatch(async () => {
      if (!ids.length) throw new Error("No users selected.");
      await dbBulkDeleteUsers(ids);
      revalidatePath("/admin/users");
      return `${ids.length} user${ids.length === 1 ? "" : "s"} deleted.`;
    }, "Failed to delete users."),
);