"use client";

import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Leaf, CheckCircle2, Github } from "lucide-react";

const SOCIAL_PROVIDERS = [
  {
    id: "google",
    label: "Continue with Google",
    enabled: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true",
  },
  {
    id: "github",
    label: "Continue with GitHub",
    enabled: process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true",
  },
] as const;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const justVerified = searchParams.get("verified") === "1";
  const enabledSocialProviders = SOCIAL_PROVIDERS.filter((provider) => provider.enabled);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign in
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        const stringError = typeof error === "object" ? JSON.stringify(error) : String(error);
        setError(stringError || "Failed to sign in");
        setLoading(false);
        return;
      }

      // 2. Custom Redirect Logic
      // If a specific callbackUrl exists (e.g., user tried to visit /admin), respect it.
      const hasCallback = searchParams.get("callbackUrl");

      if (hasCallback) {
        router.push(hasCallback);
      } else {
        // No callback? Check role to decide destination.
        // We cast data.user to 'any' to access role safely if TS complains
        const userRole = (data?.user as Record<string, unknown>)?.role;

        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }

      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError("");
    setSocialLoading(provider);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    });

    if (error) {
      setError(error.message || `Failed to sign in with ${provider}`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="max-sm:my-10 sm:min-h-screen flex w-full bg-[#F9F8F4]">
      {/* LEFT SIDE - Visual/Brand Area */}
      <div className="hidden lg:flex w-1/2 relative bg-(--primary-color) items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1490474504059-bfd894906737?q=80&w=2080&auto=format&fit=crop')", // Organic food image
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Animated Decorative Circle */}
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

      {/* RIGHT SIDE - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 lg:p-16 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-(--primary-color) font-serif">Welcome Back!</h2>
            <p className="mt-2 text-sm text-gray-500">Please enter your details to sign in.</p>
          </div>

          {enabledSocialProviders.length > 0 && (
            <div className="space-y-3">
              {enabledSocialProviders.map((provider) => (
                <motion.button
                  key={provider.id}
                  type="button"
                  disabled={loading || socialLoading !== null}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin(provider.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-(--primary-color) bg-white hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {socialLoading === provider.id ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : provider.id === "github" ? (
                    <Github className="h-4 w-4" />
                  ) : (
                    <span className="h-4 w-4 rounded-full bg-(--secondary-color)" />
                  )}
                  {provider.label}
                </motion.button>
              ))}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence>
              {justVerified && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="rounded-lg bg-green-50 p-4 border border-green-100 flex items-center gap-3 overflow-hidden"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">Email verified! You can now sign in.</p>
                </motion.div>
              )}
            </AnimatePresence>
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

            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-(--secondary-color) transition-colors" />
                </div>
                <input
                  id="email-address"
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

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-(--secondary-color) transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--secondary-color)/20 focus:border-(--secondary-color) transition-all duration-200 bg-gray-50/50 focus:bg-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">{/* Optional: Add 'Remember me' checkbox here if needed */}</div>
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-(--secondary-color) hover:text-(--secondary-color)/80 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-linear-to-r from-(--primary-color) to-[#387086] hover:from-[#1f3a4a] hover:to-[#2c5a6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--secondary-color) disabled:opacity-70 disabled:cursor-not-allowed shadow-lg transition-all duration-200 cursor-pointer"
            >
              {loading ?
                <Loader2 className="animate-spin h-5 w-5" />
              : <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              }
            </motion.button>

            <div className="text-center mt-4">
              <span className="text-gray-500 text-sm">Don&apos;t have an account? </span>
              <a href="/register" className="font-bold text-(--primary-color) hover:text-(--primary-color)/80 transition-colors text-sm">
                Sign up for free
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
          <Loader2 className="animate-spin h-8 w-8 text-(--secondary-color)" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
