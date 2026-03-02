import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Organick",
  description: "Choose a new password for your Organick account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
