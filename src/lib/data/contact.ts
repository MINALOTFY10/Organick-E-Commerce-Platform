/**
 * Data access functions for the ContactMessage domain.
 */

import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ContactMessageInput {
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** All contact messages, most recent first. */
export async function findContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/** Paginated contact messages. */
export async function findContactMessagesPaginated({
  page = 1,
  pageSize = 20,
  search,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { message: { contains: search, mode: "insensitive" as const } },
          { company: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [messages, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return {
    messages,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/** Single contact message by id. */
export async function findContactMessageById(id: string) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

/** Total count for stats. */
export async function countContactMessages() {
  return prisma.contactMessage.count();
}

// ── Write ─────────────────────────────────────────────────────────────────────

/** Create a new contact message. */
export async function createContactMessage(data: ContactMessageInput) {
  return prisma.contactMessage.create({ data });
}

/** Delete a contact message by id. */
export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}
