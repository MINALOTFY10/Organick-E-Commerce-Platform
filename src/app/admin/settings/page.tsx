import { requireAdmin } from "@/lib/auth-utils";
import { Suspense } from "react";
import { SkeletonPageLayout } from "@/components/ui/skeleton-components";
import SettingsView from "./_components/settings-view";
import { prisma } from "@/lib/prisma";

async function SettingsFetcher() {
  const [userCount, orderCount, productCount, categoryCount, blogCount, messageCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.blog.count(),
      prisma.contactMessage.count(),
    ]);

  return (
    <SettingsView
      stats={{
        users: userCount,
        orders: orderCount,
        products: productCount,
        categories: categoryCount,
        blogs: blogCount,
        messages: messageCount,
      }}
    />
  );
}

export default async function SettingsPage() {
  await requireAdmin();

  return (
    <Suspense fallback={<SkeletonPageLayout showHeader mainCards={3} />}>
      <SettingsFetcher />
    </Suspense>
  );
}
