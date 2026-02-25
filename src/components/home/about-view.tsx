"use client";

import React, { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

import PrimaryButton from "@/components/ui/primary-button";

import aboutusTagline from "@/../public/img/about-us-tagline.png";
import AboutImg from "@/../public/img/about-section.png";
import OrganicFoodsIcon from "@/../public/img/organic-foods-icon.png";
import QualityStandardsIcon from "@/../public/img/quality-standards-icon.png";

interface AboutFeature {
  icon: StaticImageData;
  title: string;
  text: string;
}

const ABOUT_FEATURES: AboutFeature[] = [
  {
    icon: OrganicFoodsIcon,
    title: "100% Organic Produce",
    text: "We source all our fruits, vegetables, and grains from certified organic farms, ensuring no harmful pesticides or chemicals.",
  },
  {
    icon: QualityStandardsIcon,
    title: "Highest Quality Standards",
    text: "Every product undergoes rigorous quality checks, guaranteeing freshness, safety, and the nutritional value you can trust.",
  },
];

// Animated percentage counter
const CounterAnimation = ({ target }: { target: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}%</span>;
};

const AboutTag: React.FC<AboutFeature & { index: number }> = ({ icon, title, text, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="flex items-start mb-8 group transition-transform duration-300"
    >
      <div className="shrink-0 mr-4 hidden sm:block">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.2 + 0.2,
            type: "spring",
            stiffness: 200 
          }}
          whileHover={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: 1.1 
          }}
        >
          <Image 
            src={icon} 
            alt="" 
            width={80} 
            height={80} 
            className="object-contain" 
            aria-hidden="true" 
          />
        </motion.div>
      </div>
      <div>
        <motion.h4 
          className="text-[#274c5b] font-bold text-xl mb-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.2 + 0.3 }}
        >
          {title === "100% Organic Produce" ? (
            <>
              <CounterAnimation target={100} /> Organic Produce
            </>
          ) : (
            title
          )}
        </motion.h4>
        <motion.p 
          className="text-[#525c60cf] leading-relaxed max-w-md"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.2 + 0.4 }}
        >
          {text}
        </motion.p>

        {/* Animated underline */}
        <motion.div
          className="h-0.5 bg-[#7EB693] mt-2"
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default function AboutView() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect for image
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section 
      ref={sectionRef}
      className="bg-[#f0eded] flex flex-col lg:flex-row items-center py-10 lg:py-20 px-6 md:px-10 mt-15 overflow-hidden relative"
    >
      {/* Image Section with Parallax */}
      <div className="hidden lg:flex w-1/2 justify-end pr-10 relative">
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Image 
              src={AboutImg} 
              alt="Farmer working in an organic field" 
              width={700} 
              height={600} 
              className="w-4/5 h-auto object-contain transition-transform duration-500" 
              priority 
            />

            {/* Organic badge */}
            <div
              className="absolute top-10 right-10 bg-white rounded-full p-4 shadow-xl"
            >
              <span className="text-2xl font-bold text-(--secondary-color)">
                <CounterAnimation target={100} />
              </span>
              <p className="text-xs text-(--primary-color) font-semibold">Organic</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-[45%] flex flex-col items-start text-left py-10 lg:py-0 relative z-10">
        <header className="mb-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src={aboutusTagline} 
              alt="About Us" 
              height={20} 
              className="object-contain" 
            />
          </motion.div>

          <motion.h2 
            className="text-[#274c5b] text-3xl md:text-4xl font-extrabold leading-tight mt-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We Believe in Working <br />
            With Trusted Farmers
          </motion.h2>
        </header>

        <motion.p 
          className="text-[#525c60cf] text-base md:text-md mb-8 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          At Organick, we partner with certified organic farmers to bring you fresh, healthy, and sustainably grown produce.
        </motion.p>

        <div className="w-full">
          {ABOUT_FEATURES.map((feature, index) => (
            <AboutTag key={index} {...feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4"
        >
          <Link href="/about" aria-label="Learn more about our organic mission">
            <PrimaryButton>Explore</PrimaryButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}