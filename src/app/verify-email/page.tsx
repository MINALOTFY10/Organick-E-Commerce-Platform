"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Leaf, CheckCircle2, MailOpen, RefreshCw } from "lucide-react";

// ── OTP digit input component ─────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (digits: string[]) => void;
  disabled: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    // Accept only digits
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    // Auto-advance focus
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const next = [...value];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...value];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    onChange(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
            ${digit
              ? "border-(--secondary-color) bg-[#F4F9F4] text-(--primary-color)"
              : "border-gray-200 bg-gray-50/50 text-gray-900"
            }
            focus:border-(--secondary-color) focus:bg-white focus:ring-2 focus:ring-(--secondary-color)/20`}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ── Inner component (needs useSearchParams) ──────────────────────────────────
function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for "Resend code"
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const otp = digits.join("");
  const otpComplete = otp.length === 6 && digits.every(Boolean);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpComplete) return;
    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.emailOtp.verifyEmail({ email, otp });

      if (error) {
        setError(error.message || "Invalid or expired code. Please try again.");
        setDigits(Array(6).fill(""));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login?verified=1"), 2500);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setError("");
    setResending(true);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        setError(error.message || "Failed to resend code. Please try again.");
      } else {
        setResendCooldown(60); // 60 s cooldown
        setDigits(Array(6).fill(""));
      }
    } catch {
      setError("Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <CheckCircle2 className="w-16 h-16 text-(--secondary-color) mx-auto" />
        <h2 className="text-2xl font-bold text-(--primary-color) font-serif">Email Verified!</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your account is now active. Redirecting you to sign in&hellip;
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
      {/* Header */}
      <div className="text-center space-y-2">
        <MailOpen className="w-12 h-12 text-(--secondary-color) mx-auto" />
        <h2 className="text-3xl font-bold text-(--primary-color) font-serif">Check your email</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          We sent a 6-digit verification code to
          <br />
          <span className="font-semibold text-gray-700">{email || "your email address"}</span>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleVerify}>
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

        {/* If the user arrived without the email param (e.g. direct navigation) */}
        {!emailParam && (
          <div className="relative group">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)/20 focus:border-(--secondary-color) transition-all duration-200 bg-gray-50/50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {/* 6-digit OTP input */}
        <OtpInput value={digits} onChange={setDigits} disabled={loading} />

        <motion.button
          type="submit"
          disabled={loading || !otpComplete}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-linear-to-r from-(--primary-color) to-[#387086] hover:from-[#1f3a4a] hover:to-[#2c5a6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary-color) disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify Email"}
        </motion.button>
      </form>

      {/* Resend */}
      <div className="text-center space-y-1">
        <p className="text-sm text-gray-400">Didn&apos;t receive a code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || resendCooldown > 0}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--secondary-color) hover:text-(--secondary-color)/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {resending ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 pt-2">
        Wrong email?{" "}
        <Link href="/register" className="text-(--primary-color) font-medium hover:underline">
          Go back to sign up
        </Link>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex w-full bg-[#F9F8F4]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative bg-(--primary-color) items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop')",
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
            <h1 className="text-4xl font-serif text-white mb-2">Almost There</h1>
            <p className="text-white/70 text-lg">Verify your email to activate your account.</p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
        >
          <Suspense
            fallback={
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-(--secondary-color)" />
              </div>
            }
          >
            <VerifyEmailForm />
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
