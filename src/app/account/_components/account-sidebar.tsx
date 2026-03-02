"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { User, MapPin, ShoppingBag, Heart, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import ConfirmDialog from "@/components/main-navigation/confirm-dialog";

const ACCOUNT_LINKS = [
  { name: "Profile & Security", href: "/account", icon: User, subtitle: "Personal details" },
  { name: "Favourites", href: "/account/favourites", icon: Heart, subtitle: "Saved products" },
  { name: "Addresses", href: "/account/addresses", icon: MapPin, subtitle: "Delivery locations" },
  { name: "Orders", href: "/account/orders", icon: ShoppingBag, subtitle: "Purchases & tracking" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setConfirmOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSignOut}
        title="Confirm Sign Out"
        message="Are you sure you want to log out of your account?"
      />

      <aside className="w-full lg:w-72 shrink-0">
        <nav aria-label="Account navigation" className="flex flex-col h-full rounded-3xl border border-gray-100 bg-white p-3 md:p-4 shadow-sm">
          <div className="px-2 pb-3 border-b border-gray-100 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted-foreground)">Navigation</p>
            <p className="text-sm text-(--primary-color) mt-1 font-medium">Account Settings</p>
          </div>

          <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
            {ACCOUNT_LINKS.map((link) => {
              const isActive = link.href === "/account" ? pathname === "/account" : pathname.startsWith(link.href);

              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm transition-all duration-200 whitespace-nowrap border ${
                      isActive
                        ? "bg-(--primary-color) text-white border-(--primary-color) shadow-sm"
                        : "text-(--primary-color) border-transparent hover:bg-(--primary-color)/5"
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                        isActive ? "bg-white/20" : "bg-(--primary-color)/10"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-(--primary-color)"}`} />
                    </span>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="font-medium">{link.name}</span>
                      <span className={`text-xs ${isActive ? "text-white/80" : "text-(--muted-foreground)"}`}>{link.subtitle}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </div>

          {/* Mobile sign out */}
          <li className="lg:hidden list-none">
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </li>
        </nav>
      </aside>
    </>
  );
}
