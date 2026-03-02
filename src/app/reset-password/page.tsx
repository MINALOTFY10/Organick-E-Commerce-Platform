"use client";

import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, Leaf, CheckCircle2, AlertTriangle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password strength helpers
  const meetsMinLength = password.length >= 8;
  const meetsUppercase = /[A-Z]/.test(password);
  const meetsNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const isFormValid =
    token && meetsMinLength && meetsUppercase && meetsNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(
          error.message ||
            "Failed to reset password. The link may have expired — please request a new one."
        );
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Redirect to login after a short delay
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Guard: no token in URL
  if (!token) {
    return (
      <div className="text-center space-y-4">
        <AlertTriangle className="w-14 h-14 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-(--primary-color) font-serif">Invalid Link</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          This password reset link is missing or invalid. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block mt-2 text-sm font-bold text-(--secondary-color) hover:text-(--secondary-color)/80 transition-colors"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <CheckCircle2 className="w-16 h-16 text-(--secondary-color) mx-auto" />
        <h2 className="text-2xl font-bold text-(--primary-color) font-serif">Password Updated!</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your password has been reset successfully. Redirecting you to sign in&hellip;
        </p>
        <Link
          href="/login"
          className="inline-block text-sm font-bold text-(--primary-color) hover:text-(--primary-color)/80 transition-colors"
        >
          Go to Sign In
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-(--primary-color) font-serif">New Password</h2>
        <p className="mt-2 text-sm text-gray-500">Choose a strong password for your account.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="rounded-lg bg-red-50 p-4 border border-red-100 flex items-center gap-3 overflow-hidden"
            >
              <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Password */}
        <div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-(--secondary-color) transition-colors" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)/20 focus:border-(--secondary-color) transition-all duration-200 bg-gray-50/50 focus:bg-white"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Strength hints */}
          {password.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 space-y-1 overflow-hidden"
            >
              {[
                { ok: meetsMinLength, label: "At least 8 characters" },
                { ok: meetsUppercase, label: "At least one uppercase letter" },
                { ok: meetsNumber, label: "At least one number" },
              ].map(({ ok, label }) => (
                <li key={label} className={`flex items-center gap-2 text-xs ${ok ? "text-green-600" : "text-gray-400"}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-gray-300"}`} />
                  {label}
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-(--secondary-color) transition-colors" />
          </div>
          <input
            id="confirm-password"
            name="confirm-password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/50 focus:bg-white ${
              confirmPassword.length > 0 && !passwordsMatch
                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                : "border-gray-200 focus:ring-(--secondary-color)/20 focus:border-(--secondary-color)"
            }`}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-500 -mt-3">Passwords do not match.</p>
        )}

        <motion.button
          type="submit"
          disabled={loading || !isFormValid}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-linear-to-r from-(--primary-color) to-[#387086] hover:from-[#1f3a4a] hover:to-[#2c5a6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary-color) disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Set New Password"}
        </motion.button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-(--primary-color) hover:text-(--primary-color)/80 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex w-full bg-[#F9F8F4]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative bg-(--primary-color) items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490474504059-bfd894906737?q=80&w=2080&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-96 h-96 rounded-full border border-(--secondary-color)/30 bg-(--primary-color)/20 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="text-center p-8">
            <Leaf className="w-16 h-16 text-(--secondary-color) mx-auto mb-4" />
            <h1 className="text-4xl font-serif text-white mb-2">Organick</h1>
            <p className="text-white/70 text-lg">Natural goodness, straight to your doorstep.</p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* useSearchParams must be inside a Suspense boundary */}
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-(--secondary-color)" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>

        {/* Mobile footer */}
        <div className="absolute bottom-6 text-center lg:hidden">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Organick Foods</p>
        </div>
      </div>
    </div>
  );
}
