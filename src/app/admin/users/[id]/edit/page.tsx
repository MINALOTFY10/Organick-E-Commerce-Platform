import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { Suspense } from "react";
import { SkeletonPageLayout } from "@/components/ui/skeleton-components";
import UserEditForm from "../../_components/user-edit-form";

async function UserEditFetcher({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
    },
  });

  if (!user) notFound();

  return <UserEditForm user={user} />;
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  return (
    <Suspense
      fallback={
        <SkeletonPageLayout
          showHeader
          formFields={4}
          sidebarCards={2}
        />
      }
    >
      <UserEditFetcher params={params} />
    </Suspense>
  );
}
