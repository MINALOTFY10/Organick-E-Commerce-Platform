import React from "react";
import Link from "next/link";
import PrimaryButton from "@/components/ui/primary-button";

const UnauthorizedPage: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-extrabold text-[clamp(4rem,10vw,9rem)] leading-none text-[#8FA8A8]">
        403
      </h1>
      <h2 className="font-bold text-[clamp(1.4rem,3vw,2.5rem)] leading-tight text-(--primary-color) mb-3">
        Access Denied
      </h2>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        You don&apos;t have permission to view this page. If you believe this is
        a mistake, please contact an administrator.
      </p>
      <Link href="/">
        <PrimaryButton>Back to Home</PrimaryButton>
      </Link>
    </section>
  );
};

export default UnauthorizedPage;
