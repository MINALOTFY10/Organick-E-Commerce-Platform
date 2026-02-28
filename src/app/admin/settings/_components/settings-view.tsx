"use client";

import {
  Database,
  Users,
  ShoppingBag,
  Package,
  Layers,
  Newspaper,
  MessageSquare,
  Shield,
  Globe,
  Server,
} from "lucide-react";
import AdminPageHeader from "@/app/admin/_components/admin-page-header";

interface Props {
  stats: {
    users: number;
    orders: number;
    products: number;
    categories: number;
    blogs: number;
    messages: number;
  };
}

export default function SettingsView({ stats }: Props) {
  return (
    <>
      <AdminPageHeader
        title="Settings"
        subtitle="System overview and configuration."
        breadcrumb="Home › Settings"
      />

      <div className="space-y-6 mt-6">
        {/* System Overview */}
        <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-[#00ff7f]" />
            <h3 className="text-lg font-bold text-white">System Overview</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Users", value: stats.users, icon: Users, color: "text-blue-400" },
              { label: "Orders", value: stats.orders, icon: ShoppingBag, color: "text-green-400" },
              { label: "Products", value: stats.products, icon: Package, color: "text-purple-400" },
              { label: "Categories", value: stats.categories, icon: Layers, color: "text-amber-400" },
              { label: "Blogs", value: stats.blogs, icon: Newspaper, color: "text-pink-400" },
              { label: "Messages", value: stats.messages, icon: MessageSquare, color: "text-cyan-400" },
            ].map((item) => (
              <div key={item.label} className="bg-[#0d2820] rounded-lg p-4 text-center">
                <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-gray-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Server className="w-5 h-5 text-[#00ff7f]" />
              <h3 className="text-lg font-bold text-white">Application Info</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: "Framework", value: "Next.js (App Router)" },
                { label: "Database", value: "PostgreSQL + Prisma" },
                { label: "Authentication", value: "Better Auth" },
                { label: "Payments", value: "Stripe" },
                { label: "Styling", value: "Tailwind CSS" },
              ].map((info) => (
                <div key={info.label} className="flex justify-between items-center py-2 border-b border-[#2a4d42] last:border-b-0">
                  <span className="text-gray-400 text-sm">{info.label}</span>
                  <span className="text-white text-sm font-medium">{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#00ff7f]" />
              <h3 className="text-lg font-bold text-white">Security</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: "Auth Method", value: "Email & Password" },
                { label: "Email Verification", value: "Configurable via ENV" },
                { label: "Admin Guard", value: "Layout + Action level" },
                { label: "Role System", value: "Customer / Admin / Super Admin" },
                { label: "Session Storage", value: "Database-backed" },
              ].map((info) => (
                <div key={info.label} className="flex justify-between items-center py-2 border-b border-[#2a4d42] last:border-b-0">
                  <span className="text-gray-400 text-sm">{info.label}</span>
                  <span className="text-white text-sm font-medium">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-[#00ff7f]" />
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Manage Users", href: "/admin/users", description: "View and edit user accounts" },
              { label: "Manage Products", href: "/admin/products", description: "Add, edit, or remove products" },
              { label: "View Orders", href: "/admin/orders", description: "Track and manage customer orders" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block p-4 bg-[#0d2820] rounded-lg border border-[#2a4d42] hover:border-[#00ff7f]/50 transition-all group"
              >
                <p className="text-white font-medium group-hover:text-[#00ff7f] transition-colors">
                  {link.label}
                </p>
                <p className="text-gray-500 text-sm mt-1">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
