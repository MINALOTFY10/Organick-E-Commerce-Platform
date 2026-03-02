"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { withAdmin } from "@/lib/action-auth";
import { tryCatch } from "@/lib/action-utils";
import * as db from "@/lib/data/contact";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import type { ActionResult } from "@/types/action-result";

// ── Public mutations ──────────────────────────────────────────────────────────

/** Submit a contact form (no auth required). */
export async function submitContactForm(formData: FormData): Promise<ActionResult> {
  const fullName = formData.get("fullName") as string | null;
  const email = formData.get("email") as string | null;
  const company = formData.get("company") as string | null;
  const phone = formData.get("phone") as string | null;
  const message = formData.get("message") as string | null;

  // Basic validation
  const errors: Record<string, string[]> = {};

  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = ["Full name is required (min 2 characters)."];
  } else if (fullName.length > 200) {
    errors.fullName = ["Full name is too long (max 200 characters)."];
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["A valid email address is required."];
  } else if (email.length > 320) {
    errors.email = ["Email address is too long."];
  }

  if (!message || message.trim().length < 10) {
    errors.message = ["Message must be at least 10 characters."];
  } else if (message.length > 5000) {
    errors.message = ["Message is too long (max 5000 characters)."];
  }

  if (company && company.length > 200) {
    errors.company = ["Company name is too long (max 200 characters)."];
  }

  if (phone && phone.length > 30) {
    errors.phone = ["Phone number is too long (max 30 characters)."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the highlighted errors.",
      errors,
    };
  }

  return tryCatch(async () => {
    await db.createContactMessage({
      fullName: fullName!.trim(),
      email: email!.trim(),
      company: company?.trim() || undefined,
      phone: phone?.trim() || undefined,
      message: message!.trim(),
    });
    revalidatePath("/admin/messages");
    return "Your message has been sent successfully! We'll get back to you soon.";
  }, "Failed to send message. Please try again later.");
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export async function getAllContactMessages() {
  await requireAdmin();
  return db.findContactMessages();
}

export async function getContactMessages(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  await requireAdmin();
  return db.findContactMessagesPaginated({
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 20,
    search: params?.search,
  });
}

export async function getContactMessageById(id: string) {
  await requireAdmin();
  const msg = await db.findContactMessageById(id);
  if (!msg) notFound();
  return msg;
}

export async function getContactMessageStats() {
  await requireAdmin();
  const total = await db.countContactMessages();
  return { total };
}

// ── Admin mutations ───────────────────────────────────────────────────────────

export const deleteContactMessage = withAdmin(
  async (_session, id: string): Promise<ActionResult> =>
    tryCatch(async () => {
      await db.deleteContactMessage(id);
      revalidatePath("/admin/messages");
      return "Message deleted successfully.";
    }, "Failed to delete message."),
);
