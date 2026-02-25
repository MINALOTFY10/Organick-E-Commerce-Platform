import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Organick account to start shopping for fresh organic products, save your addresses, and track your orders.",
  openGraph: {
    title: "Create Account — Organick",
    description: "Create a free Organick account.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
