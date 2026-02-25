"use client";

import { useState, useTransition } from "react";
import { deleteOwnAccountAction, updateProfileAction } from "@/actions/profile-actions";
import { authClient } from "@/lib/auth-client";
import { User, Phone, Mail, Save, Loader2, Lock, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";

interface ProfileFormProps {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    createdAt: Date;
  };
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await updateProfileAction({ name, phone: phone || undefined });
      if (result && "success" in result) {
        setFeedback({ text: result.message, success: result.success });
      }
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmNewPassword = confirmNewPassword.trim();

    if (!trimmedCurrentPassword) {
      setFeedback({ text: "Current password is required.", success: false });
      return;
    }

    if (trimmedNewPassword.length < 8) {
      setFeedback({ text: "New password must be at least 8 characters.", success: false });
      return;
    }

    if (!/\d/.test(trimmedNewPassword)) {
      setFeedback({
        text: "New password must include at least one number.",
        success: false,
      });
      return;
    }

    if (trimmedNewPassword !== trimmedConfirmNewPassword) {
      setFeedback({ text: "New password and confirm password do not match.", success: false });
      return;
    }

    startPasswordTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: trimmedCurrentPassword,
        newPassword: trimmedNewPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setFeedback({
          text: error.message || "Failed to change password. Please try again.",
          success: false,
        });
        return;
      }

      setFeedback({ text: "Password changed successfully.", success: true });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    });
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (deleteConfirmation.trim() !== "DELETE") {
      setFeedback({ text: 'Type "DELETE" exactly to confirm account deletion.', success: false });
      return;
    }

    if (!window.confirm("Delete your account permanently? This cannot be undone.")) {
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteOwnAccountAction(deleteConfirmation);
      if (!result || !("success" in result)) return;

      if (!result.success) {
        setFeedback({ text: result.message, success: false });
        return;
      }

      await authClient.signOut();
      window.location.href = "/";
    });
  };

  return (
    <div className="space-y-7">
      <div className="rounded-2xl border border-gray-100 bg-(--primary-color)/5 p-4 md:p-5">
        <p className="text-sm font-semibold text-(--primary-color)">Profile Details</p>
        <p className="text-xs text-(--muted-foreground) mt-1">Keep your personal information up to date.</p>
      </div>

      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            feedback.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-gray-100 p-4 md:p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-base font-semibold text-(--primary-color)">Personal Information</h3>
            <p className="text-sm text-(--muted-foreground) mt-1">These details are visible in your account.</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-(--primary-color) mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-(--muted-foreground) mt-1">Email cannot be changed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-(--primary-color) mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-(--primary-color) mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent transition-all"
                placeholder="Your phone number (optional)"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-(--muted-foreground)">
          Member since{" "}
          {new Date(profile.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-(--primary-color) text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="rounded-2xl border border-gray-100 p-4 md:p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-base font-semibold text-(--primary-color)">Security</h3>
            <p className="text-sm text-(--muted-foreground) mt-1">Choose a strong password you don’t use elsewhere.</p>
          </div>

          <div>
            <label htmlFor="currentPassword" className="flex items-center gap-2 text-sm font-medium text-(--primary-color) mb-2">
              <Lock className="w-4 h-4" />
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium text-(--primary-color) mb-2">
                <ShieldCheck className="w-4 h-4" />
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent transition-all"
              />
              <p className="text-xs text-(--muted-foreground) mt-1">Minimum 8 characters and at least one number.</p>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="flex items-center gap-2 text-sm font-medium text-(--primary-color) mb-2">
                <ShieldCheck className="w-4 h-4" />
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--secondary-color) focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPasswordPending}
            className="flex items-center gap-2 bg-(--primary-color) text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPasswordPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {isPasswordPending ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>

      <form onSubmit={handleDeleteAccount} className="space-y-4">
        <div className="rounded-2xl border border-red-200 p-4 md:p-6 space-y-4 bg-red-50/40">
          <div>
            <h3 className="text-base font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h3>
            <p className="text-sm text-red-700/90 mt-1">
              Permanently delete your account and personal data (GDPR right-to-erasure).
            </p>
          </div>

          <div>
            <label htmlFor="deleteConfirmation" className="text-sm font-medium text-red-800 mb-2 block">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              id="deleteConfirmation"
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
              className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isDeletePending || deleteConfirmation.trim() !== "DELETE"}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeletePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {isDeletePending ? "Deleting…" : "Delete Account"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
