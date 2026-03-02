"use client";

import { useState } from "react";
import { Calendar, Mail, Package, Trash2, Loader2 } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { useRouter } from "next/navigation";
import { bulkDeleteUsers } from "@/actions/user-actions";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string | Date;
  emailVerified: boolean;
  _count: {
    orders: number;
  };
  summary?: string;
  phone?: string | null;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} user${selectedIds.size === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setBulkLoading(true);
    setBulkMessage(null);
    const result = await bulkDeleteUsers(Array.from(selectedIds));
    setBulkLoading(false);
    setSelectedIds(new Set());
    setBulkMessage({ success: result.success, text: result.message });
    if (result.success) router.refresh();
  };

  const columns: Column<User>[] = [
    {
      header: "USER",
      cell: (user) => (
        <div className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-full bg-[#00ff7f]/20 flex items-center justify-center text-[#00ff7f] font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="max-w-50 font-semibold text-white">{user.name ?? "Unknown"}</p>
            <p className="max-w-50 text-xs text-gray-500 line-clamp-1">{user.summary}</p>
          </div>
        </div>
      ),
    },
    {
      header: "EMAIL",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{user.email}</span>
        </div>
      ),
    },
    {
      header: "ROLE",
      cell: (user) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.role === "SUPER_ADMIN" ? "bg-orange-500/20 text-orange-400"
            : user.role === "ADMIN" ? "bg-purple-500/20 text-purple-400"
            : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {user.role === "SUPER_ADMIN" ?
            "Super Admin"
          : user.role === "ADMIN" ?
            "Admin"
          : "Customer"}
        </span>
      ),
    },
    {
      header: "ORDERS",
      cell: (user) => <p className="text-white font-semibold">{user._count.orders}</p>,
    },
    {
      header: "JOINED",
      className: "px-4",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: "Verfied",
      cell: (user) =>
        user.emailVerified ?
          <span className="px-3 py-1 bg-[#00ff7f]/20 text-[#00ff7f] rounded-full text-sm font-medium">Verified</span>
        : <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-medium">Not Verified</span>,
    },
  ];

  const EmptyState = (
    <>
      <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400 font-medium">No users found</p>
      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or add a new user</p>
    </>
  );

  return (
    <div className="space-y-3">
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-[#0d2820] border border-[#2a4d42] rounded-xl px-5 py-3">
          <span className="text-sm text-gray-300 font-medium">
            {selectedIds.size} user{selectedIds.size === 1 ? "" : "s"} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleBulkDelete}
              disabled={bulkLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-2 text-gray-400 hover:text-white text-sm rounded-lg hover:bg-[#2a4d42] transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {bulkMessage && (
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          bulkMessage.success ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
        }`}>
          {bulkMessage.text}
        </div>
      )}

      <DataTable
        data={users}
        columns={columns}
        emptyState={EmptyState}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        selectable
        getRowId={(u) => u.id}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}