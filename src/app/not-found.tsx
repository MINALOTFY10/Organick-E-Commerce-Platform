import React from "react";
import NotFoundImg from "@/../public/img/not-found.png";
import Image from "next/image";
import PrimaryButton from "@/components/ui/primary-button";
import Link from "next/link";

const NotFoundSection: React.FC = () => {
  return (
    <section className="relative w-full">
      {/* Background Image */}
      <Image src={NotFoundImg} alt="Not Found Image" priority className="w-full object-cover" />

      {/* Text Content */}
      <div className="absolute left-[50%] md:left-[70%] w-3/4 top-[46%] md:w-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1
            className="
                font-extrabold leading-none text-[#8FA8A8]
                text-[clamp(4rem,10vw,11rem)]
                "
        >
          404
        </h1>
        <h1
            className="
                font-bold mb-2 leading-tight text-(--primary-color)
                text-[clamp(1.6rem,4vw,3.5rem)]
                "
        >
          Page not found
        </h1>
        <p
            className="
                font-semibold text-[#757a7c]
                text-[clamp(0.75rem,0.9vw,1.1rem)]
                "
        >
          The page you are looking for doesn&apos;t exist or has been moved
        </p>

        <Link href="/" className="mt-10 me-auto inline-block">
          <PrimaryButton>Go Back Home</PrimaryButton>
        </Link>
      </div>
    </section>
  );
};

export default NotFoundSection;
