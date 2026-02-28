import { requireAdmin } from "@/lib/auth-utils";
import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import { AdminGlobalSearch } from "@/app/admin/_components/admin-global-search";
import { AdminNotifications } from "@/app/admin/_components/admin-notifications";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin(); 

  return (
    <div className="min-h-screen bg-[#0d2820] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-60">
        <header className="bg-[#0d2820] border-b border-[#1a3d32] px-8 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <AdminGlobalSearch />
            <div className="flex items-center gap-4">
              <AdminNotifications />
              <div className="flex items-center gap-3 pl-4 border-l border-[#1a3d32]">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{session.user.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}