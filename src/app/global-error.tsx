"use client";

// global-error.tsx replaces the ENTIRE root layout (including nav/footer)
// when an error occurs inside the root layout itself.
// It must supply its own <html> and <body> tags.
// See: https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Geist } from "next/font/google";
import PrimaryButton from "@/components/ui/primary-button";
import TransparentButton from "@/components/ui/transparent-button";
import ErrorImg from "@/../public/img/not-found.png";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <section className="relative w-full min-h-screen">
          <Image
            src={ErrorImg}
            alt="System error illustration"
            fill
            priority
            className="object-cover object-top-left"
          />

          <div className="relative z-10 flex min-h-screen items-center justify-center md:justify-end md:pr-[8%]">
            <div className="mx-4 w-full max-w-xs rounded-2xl bg-white/60 px-6 py-8 text-center backdrop-blur-sm sm:max-w-sm md:max-w-md md:bg-transparent md:backdrop-blur-none md:px-0 md:py-0">
              <span className="block select-none font-black leading-none text-[#8FA8A8]/40 text-[clamp(4rem,10vw,9rem)]">
                500
              </span>
              <h1 className="mt-2 font-bold leading-tight text-(--primary-color) text-[clamp(1.4rem,3.5vw,3rem)]">
                Unexpected Error
              </h1>
              <p className="mt-3 font-semibold text-[#757a7c] text-[clamp(0.8rem,1.1vw,1rem)]">
                We&apos;ve encountered an internal server issue. Our team has been notified,
                but you can try refreshing the page or returning home.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <TransparentButton onClick={() => reset()}>Try Again</TransparentButton>
                <Link href="/">
                  <PrimaryButton>Return Home</PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
