import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNavigation } from "@/components/main-navigation/main-navigation";
import FooterSection from "@/components/home/footer-section";
import { UserRole } from "@/lib/auth";
import { getServerSession } from "@/lib/auth-utils";
import { getCartCount } from "@/actions/cart-actions";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),

  title: {
    default: "Organick — Organic Food Store",
    template: "%s | Organick",
  },

  description:
    "Organick is a modern organic food e-commerce platform designed to showcase healthy products, promote sustainable living, and deliver a smooth shopping experience.",

  keywords: ["organic food", "healthy products", "organic store", "eco friendly", "fresh vegetables", "online grocery", "Organick shop"],

  authors: [{ name: "Organick Team" }],

  creator: "Organick",

  openGraph: {
    title: "Organick — Organic Food Store",
    description: "Discover fresh, healthy, and eco-friendly organic products with Organick. A modern platform for sustainable shopping.",
    url: "",
    siteName: "Organick",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Organick Organic Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Organick — Organic Food Store",
    description: "Shop fresh organic products and enjoy a clean, modern experience with Organick.",
    images: ["/og-image.png"],
    creator: "@organick",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const role = (session?.user?.role as UserRole) ?? "CUSTOMER";
  const isAdminUser = role === "ADMIN" || role === "SUPER_ADMIN";

  const cartCount = isAdminUser ? 0 : await getCartCount();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isAdminUser ? null : <MainNavigation cartCount={cartCount} />}
        <main id="main-content">
          {children}
        </main>
        {isAdminUser ? null : (
          <>
            <FooterSection />
          </>
        )}
      </body>
    </html>
  );
}
