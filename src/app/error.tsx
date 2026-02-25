"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import PrimaryButton from "@/components/ui/primary-button";
import ErrorImg from "@/../public/img/not-found.png";
import TransparentButton from "@/components/ui/transparent-button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image 
        src={ErrorImg} 
        alt="System error illustration" 
        priority 
        className="w-full object-cover" 
      />

      {/* Text Content */}
      <div className="absolute left-1/2 top-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 text-center md:left-[70%] md:w-1/2">
        <span className="block font-black leading-none text-[#8FA8A8]/40 text-[clamp(4rem,12vw,12rem)] select-none">
          500
        </span>
        
        <h1 className="mt-2 font-bold leading-tight text-(--primary-color) text-[clamp(1.5rem,2.5vw,2.5rem)]">
          Unexpected Error
        </h1>
        
        <p className="mx-auto mt-4 max-w-md font-medium text-[#757a7c] text-[clamp(0.875rem,1vw,1.1rem)]">
          We’ve encountered an internal server issue. Our team has been notified, 
          but you can try refreshing the page or returning home.
        </p>

        <div className="mt-10 flex flex-row flex-wrap justify-center gap-4">
          {/* reset() should generally be called directly to attempt a re-render */}
          <TransparentButton onClick={() => reset()}>
            Try Again
          </TransparentButton>

          <Link href="/">
            <PrimaryButton>Return Home</PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  );
}