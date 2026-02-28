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
        <nav aria-label="Account navigation" className="flex flex-col h-full rounded-3xl border border-gray-200/60 bg-white p-2 md:p-4 shadow-sm">
          <div className="hidden lg:block px-3 pb-4 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Navigation</p>
            <p className="text-sm text-gray-900 mt-1 font-semibold">Account Settings</p>
          </div>

          {/* Added 'scrollbar-width: none' via standard CSS or Tailwind plugin approach */}
          <ul className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 px-2 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {ACCOUNT_LINKS.map((link) => {
              const isActive = link.href === "/account" ? pathname === "/account" : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <li key={link.href} className="shrink-0 lg:shrink-auto">
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                        isActive ? "bg-white/15" : "bg-gray-100 group-hover:bg-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`} />
                    </span>
                    <div className="flex flex-col leading-tight min-w-0 pr-2">
                      <span className="font-semibold">{link.name}</span>
                      <span className={`text-[11px] ${isActive ? "text-gray-300" : "text-gray-400"}`}>{link.subtitle}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block mt-4 pt-4 border-t border-gray-100 px-2">
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}