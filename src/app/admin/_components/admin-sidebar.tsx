"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Layers, Settings, LogOut, Package, Newspaper, MessageSquare, Star, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inventory", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers  },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Blogs", href: "/admin/blogs", icon: Newspaper },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <aside
      className={`w-60 bg-[#0a1f1a] text-white min-h-screen flex flex-col fixed left-0 top-0 border-r border-[#1a3d32] z-30 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 bg-[#00ff7f] rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Organick</h2>
            <p className="text-xs text-emerald-400 uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
        {/* Close button — mobile only */}
        <button
          className="md:hidden p-1 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="mb-3 px-3 text-xs font-semibold text-emerald-400/60 uppercase tracking-wider">Main Menu</div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive ? "bg-[#00ff7f] text-black font-medium" : "text-gray-400 hover:bg-[#1a3d32] hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 mb-3 px-3 text-xs font-semibold text-emerald-400/60 uppercase tracking-wider">Settings</div>
        <div className="space-y-1">
          <Link
            href="/admin/settings"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              pathname === "/admin/settings" ? "bg-[#00ff7f] text-black font-medium" : "text-gray-400 hover:bg-[#1a3d32] hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1a3d32] hover:text-white w-full rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

    </aside>
  );
}
