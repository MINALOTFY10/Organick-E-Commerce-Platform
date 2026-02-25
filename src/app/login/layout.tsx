import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Organick account to manage orders, track deliveries, and access your wishlist.",
  openGraph: {
    title: "Sign In — Organick",
    description: "Sign in to your Organick account.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
