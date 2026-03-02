import { requireAdmin } from "@/lib/auth-utils";
import { AdminLayoutClient } from "@/app/admin/_components/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AdminLayoutClient userName={session.user.name}>
      {children}
    </AdminLayoutClient>
  );
}