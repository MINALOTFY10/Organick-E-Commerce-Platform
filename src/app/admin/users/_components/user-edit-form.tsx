"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Shield, Mail, User } from "lucide-react";
import Link from "next/link";
import { updateUserAction } from "@/actions/user-actions";

interface UserEditFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
}

const ROLES = [
  { value: "CUSTOMER", label: "Customer", color: "bg-blue-500/20 text-blue-400" },
  { value: "ADMIN", label: "Admin", color: "bg-purple-500/20 text-purple-400" },
  { value: "SUPER_ADMIN", label: "Super Admin", color: "bg-orange-500/20 text-orange-400" },
] as const;

export default function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await updateUserAction(user.id, {
      name: formData.name,
      role: formData.role as "CUSTOMER" | "ADMIN" | "SUPER_ADMIN",
      emailVerified: formData.emailVerified,
    });

    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(result.message);
      router.refresh();
      setTimeout(() => router.push(`/admin/users/${user.id}`), 1000);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/users/${user.id}`} className="p-2 hover:bg-[#2a4d42] rounded-lg transition-colors shrink-0">
          <ArrowLeft className="w-6 h-6 text-gray-400" />
        </Link>
        <div>
          <p className="text-sm text-gray-400 mb-1">Home › Users › {user.name} › Edit</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Edit User</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-4 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-[#00ff7f]/20 border border-[#00ff7f]/30 rounded-lg text-[#00ff7f] text-sm">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0d2820] border border-[#2a4d42] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff7f] transition-colors"
                  placeholder="User's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0d2820]/60 border border-[#2a4d42] rounded-lg text-gray-400">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed from the admin panel.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: role.value }))}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                        formData.role === role.value
                          ? "border-[#00ff7f] bg-[#00ff7f]/10 text-[#00ff7f]"
                          : "border-[#2a4d42] bg-[#0d2820] text-gray-400 hover:border-[#3a5d52]"
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email Verification</label>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, emailVerified: !prev.emailVerified }))}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all w-full ${
                    formData.emailVerified
                      ? "border-[#00ff7f] bg-[#00ff7f]/10"
                      : "border-[#2a4d42] bg-[#0d2820]"
                  }`}
                >
                  <div
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      formData.emailVerified ? "bg-[#00ff7f]" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        formData.emailVerified ? "left-5" : "left-1"
                      }`}
                    />
                  </div>
                  <span className={formData.emailVerified ? "text-[#00ff7f]" : "text-gray-400"}>
                    {formData.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[#2a4d42]">
              <Link
                href={`/admin/users/${user.id}`}
                className="px-6 py-3 text-gray-400 hover:bg-[#0d2820] rounded-lg transition-colors font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-[#00ff7f] text-black rounded-lg hover:bg-[#00ff7f]/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#00ff7f]/20 flex items-center justify-center text-[#00ff7f] text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{user.name}</p>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  ROLES.find((r) => r.value === user.role)?.color ?? "bg-gray-500/20 text-gray-400"
                }`}
              >
                {ROLES.find((r) => r.value === user.role)?.label ?? user.role}
              </span>
            </div>
          </div>

          <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] p-6">
            <h3 className="text-lg font-bold text-white mb-3">User ID</h3>
            <p className="text-gray-400 font-mono text-sm break-all">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
