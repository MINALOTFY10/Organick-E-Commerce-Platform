import React from "react";
import NotFoundImg from "@/../public/img/not-found.png";
import Image from "next/image";
import PrimaryButton from "@/components/ui/primary-button";
import Link from "next/link";

const NotFoundSection: React.FC = () => {
  return (
    <section className="fixed inset-0 z-50 overflow-auto bg-white">
      {/* Background Image */}
      <Image
        src={NotFoundImg}
        alt="Not Found Image"
        fill
        priority
        className="object-cover object-top-left"
      />

      {/* Text Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center md:justify-end md:pr-[8%]">
        <div className="mx-4 w-full max-w-xs rounded-2xl bg-white/60 px-6 py-8 text-center backdrop-blur-sm sm:max-w-sm md:max-w-md md:bg-transparent md:backdrop-blur-none md:px-0 md:py-0">
          <h1 className="font-extrabold leading-none text-[#8FA8A8] text-[clamp(4rem,10vw,9rem)]">
            404
          </h1>
          <h2 className="font-bold mb-3 leading-tight text-(--primary-color) text-[clamp(1.4rem,3.5vw,3rem)]">
            Page not found
          </h2>
          <p className="font-semibold text-[#757a7c] text-[clamp(0.8rem,1.1vw,1rem)]">
            The page you are looking for doesn&apos;t exist or has been moved
          </p>
          <Link href="/" className="mt-8 inline-block">
            <PrimaryButton>Go Back Home</PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundSection;
