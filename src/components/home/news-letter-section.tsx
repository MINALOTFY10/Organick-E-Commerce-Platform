"use client";

import React, { useState } from "react";
import Image from "next/image";
import PrimaryButton from "@/components/ui/primary-button";

import newsletterImg from "@/../public/img/newsletter.png";

export default function NewsLetterSection() {
  const sectionClasses =
    "relative mx-auto rounded-[35px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden";

  return (
    <div className="container mx-auto py-13 px-4 max-w-300">
      <section
        className={sectionClasses}
        style={{
          backgroundImage: `url(${newsletterImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content goes here */}
        <h2 className="text-white text-3xl md:text-4xl font-bold z-10">
          Subscribe to <br /> our Newsletter
        </h2>

        <form className="flex flex-col sm:flex-row gap-2 z-10 w-full md:w-auto mt-6 md:mt-0" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter subscription">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Your Email Address"
            autoComplete="email"
            className="py-2.5 px-4 rounded-lg w-full md:w-80 outline-none bg-white focus-visible:ring-2 focus-visible:ring-(--secondary-color)"
          />
          <PrimaryButton>Subscribe</PrimaryButton>
        </form>
      </section>
    </div>
  );
};

