"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminGlobalSearch } from "./admin-global-search";
import { AdminNotifications } from "./admin-notifications";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName?: string | null;
}

export function AdminLayoutClient({ children, userName }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d2820] flex">
      {/* Mobile sidebar overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-60 min-w-0">
        <header className="bg-[#0d2820] border-b border-[#1a3d32] px-4 md:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger button — mobile only */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-[#1a3d32] rounded-lg shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global search */}
            <div className="flex-1 min-w-0">
              <AdminGlobalSearch />
            </div>

            {/* Right-side controls */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <AdminNotifications />
              <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-[#1a3d32]">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium text-white">{userName ?? "Admin"}</p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                  {userName?.charAt(0).toUpperCase() ?? "A"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
