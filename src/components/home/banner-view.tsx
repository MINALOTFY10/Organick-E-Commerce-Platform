"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

import naturalFoodImg from "@/../public/img/natural-food.png";
import bannerImg from "@/../public/img/banner.png";
import SecondaryButton from "@/components/ui/secondary-button";

// Lightweight floating particle — only a few used
const FloatingParticle = ({ delay, prefersReducedMotion }: { delay: number; prefersReducedMotion: boolean }) => {
  if (prefersReducedMotion) return null;
  return (
    <motion.div
      className="absolute w-2 h-2 bg-(--secondary-color)/20 rounded-full"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        y: [0, -80, 0],
        scale: [0, 1, 0],
        opacity: [0, 0.5, 0],
      }}
      transition={{
        duration: 10 + (delay % 4),
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      style={{
        left: `${15 + delay * 12}%`,
        top: `${30 + delay * 8}%`,
      }}
    />
  );
};

export default function BannerView() {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.6]);

  return (
    <section ref={ref} className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden" aria-label="Hero banner">
      {/* Parallax Background */}
      <motion.div style={prefersReducedMotion ? undefined : { y }} className="absolute inset-0">
        <Image src={bannerImg} alt="" fill priority className="object-cover" aria-hidden="true" />
      </motion.div>

      {/* Floating Particles — reduced to 6 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 1.2} prefersReducedMotion={prefersReducedMotion} />
        ))}
      </div>

      {/* Gradient Overlay */}
      <motion.div style={prefersReducedMotion ? undefined : { opacity }} className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent" />

      {/* Content */}
      <div className="absolute left-1/2 md:left-[40%] w-3/4 top-1/2 md:w-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Natural Food Image */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image src={naturalFoodImg} alt="Natural food" width={180} height={80} className="mb-3 w-[22vw] md:w-[12vw] lg:w-[9.5vw] object-contain" />
        </motion.div>

        {/* Heading — static text (no typewriter, better for a11y & SEO) */}
        <motion.h1
          className="text-[8vw] sm:text-[6vw] md:text-[4.6vw] lg:text-[3.7vw] font-bold leading-tight text-(--primary-color)"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Choose the best
          <br />
          healthier way
          <br />
          of life
        </motion.h1>

        {/* CTA Button */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 inline-block"
        >
          <Link href="/products">
            <SecondaryButton>Explore Now</SecondaryButton>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
