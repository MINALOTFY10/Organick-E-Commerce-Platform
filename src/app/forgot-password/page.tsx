"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Leaf, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        // better-auth will append ?token=xxx to this URL
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message || "Failed to send reset email. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-4"
              >
                <CheckCircle2 className="w-16 h-16 text-(--secondary-color) mx-auto" />
                <h2 className="text-2xl font-bold text-(--primary-color) font-serif">Check your inbox</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  If <span className="font-medium text-gray-700">{email}</span> is associated with an
                  Organick account, you&apos;ll receive a password reset link within a few minutes.
                </p>
                <p className="text-gray-400 text-xs">
                  Didn&apos;t receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setEmail("");
                    }}
                    className="text-(--secondary-color) underline underline-offset-2 hover:text-(--secondary-color)/80 transition-colors"
                  >
                    try again
                  </button>
                  .
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-(--primary-color) hover:text-(--primary-color)/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-(--primary-color) font-serif">Forgot Password?</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
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

                  {/* Email Input */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-(--secondary-color) transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)/20 focus:border-(--secondary-color) transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-linear-to-r from-(--primary-color) to-[#387086] hover:from-[#1f3a4a] hover:to-[#2c5a6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary-color) disabled:opacity-70 disabled:cursor-not-allowed shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </motion.button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-sm font-medium text-(--primary-color) hover:text-(--primary-color)/80 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile footer */}
        <div className="absolute bottom-6 text-center lg:hidden">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Organick Foods</p>
        </div>
      </div>
    </div>
  );
}
