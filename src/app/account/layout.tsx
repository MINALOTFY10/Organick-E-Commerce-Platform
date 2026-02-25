import type { Metadata } from "next";
import AccountSidebar from "./_components/account-sidebar";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your profile, addresses, and orders.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-(--background)">
      <div className="relative overflow-hidden bg-(--primary-color) text-white py-6 md:py-8">
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/10" aria-hidden />
        <div className="relative max-w-350 mx-auto px-4 md:px-8 lg:px-16">
          <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-white/70">Account</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">My Account</h1>
          <p className="mt-3 text-white/85 text-sm md:text-base max-w-2xl">
            Manage profile, security, addresses, favourites, and orders from one place.
          </p>
        </div>
      </div>

      <div className="max-w-350 mx-auto px-4 md:px-8 lg:px-16 py-5 md:py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <AccountSidebar />
          <div className="flex-1 min-w-0 w-full">
            <div className="rounded-3xl bg-white p-5 md:p-7 shadow-sm border border-gray-100">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
