import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const now = Date.now();
const tempEmail = `smoke-review-${now}@example.com`;
let tempUserId = null;
let reviewId = null;

try {
  const product = await prisma.product.findFirst({ select: { id: true, name: true } });
  if (!product) {
    throw new Error("No products found. Seed at least one product before smoke testing.");
  }

  const user = await prisma.user.create({
    data: {
      name: "Smoke Review User",
      email: tempEmail,
      role: "CUSTOMER",
    },
    select: { id: true },
  });
  tempUserId = user.id;

  const created = await prisma.productReview.upsert({
    where: {
      productId_userId: {
        productId: product.id,
        userId: user.id,
      },
    },
    create: {
      productId: product.id,
      userId: user.id,
      rating: 5,
      comment: "Smoke test review for moderation flow.",
      status: "PENDING",
    },
    update: {
      rating: 5,
      comment: "Smoke test review for moderation flow.",
      status: "PENDING",
    },
    select: { id: true, status: true },
  });
  reviewId = created.id;

  if (created.status !== "PENDING") {
    throw new Error(`Expected PENDING after submit, got ${created.status}`);
  }

  const approved = await prisma.productReview.update({
    where: { id: reviewId },
    data: { status: "APPROVED" },
    select: { status: true, productId: true },
  });

  if (approved.status !== "APPROVED") {
    throw new Error(`Expected APPROVED after moderation, got ${approved.status}`);
  }

  const aggregate = await prisma.productReview.aggregate({
    where: { productId: approved.productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: { _all: true },
  });

  console.log("✅ Smoke test passed");
  console.log({
    productId: approved.productId,
    approvedReviewCount: aggregate._count._all,
    approvedAverageRating: Number(aggregate._avg.rating ?? 0),
  });
} catch (error) {
  console.error("❌ Smoke test failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  try {
    if (reviewId) {
      await prisma.productReview.delete({ where: { id: reviewId } });
    }
  } catch {}

  try {
    if (tempUserId) {
      await prisma.user.delete({ where: { id: tempUserId } });
    }
  } catch {}

  await prisma.$disconnect();
}
