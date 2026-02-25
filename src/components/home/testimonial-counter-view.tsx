"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";

import Circle from "@/components/ui/circle";
import TestimonialTagline from "@/../public/img/testimonial-phrase.png";
import TestimonialBg from "@/../public/img/testimonial-counter.png";
import SaraAvatar from "@/../public/img/avatar-review.png";
import Stars from "@/components/ui/stars";

const STATS_DATA = [
  { heading: "100%", text: "Organic", target: 100, suffix: "%" },
  { heading: "285", text: "Active Product", target: 285, suffix: "" },
  { heading: "350+", text: "Organic Orchards", target: 350, suffix: "+" },
  { heading: "25+", text: "Farming Years", target: 25, suffix: "+" },
];

const TESTIMONIALS_LIST = [
  {
    name: "Sara Taylor",
    role: "Customer",
    rating: 8,
    avatar: SaraAvatar,
    content: "Organick has completely changed the way I shop for fresh produce. The quality is exceptional, and I love knowing that everything I buy is 100% organic.",
  },
  {
    name: "John Doe",
    role: "Health Coach",
    rating: 10,
    avatar: SaraAvatar,
    content: "I recommend Organick to all my clients. The transparency of their farming process and the nutritional density is simply unmatched in the market.",
  },
  {
    name: "Mila Kunis",
    role: "Farmer",
    rating: 9,
    avatar: SaraAvatar,
    content: "As someone who grows food for a living, I can tell these guys put heart and soul into their soil. The taste is authentic and reminds me of home.",
  },
];

// Animated counter component
const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let current = 0;
      const increment = target / 60;
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

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// Enhanced Circle component with counter
const EnhancedCircle = ({ stat, index }: { stat: typeof STATS_DATA[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="relative bg-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-lg border-4 border-(--secondary-color)/20 group-hover:border-(--secondary-color) transition-colors duration-300">
        <h3 className="text-3xl font-extrabold text-(--primary-color)">
          <AnimatedCounter target={stat.target} suffix={stat.suffix} />
        </h3>
        <p className="text-sm text-[#7d7d7d] font-medium">{stat.text}</p>
      </div>
    </motion.div>
  );
};

export default function TestimonialCounterView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-play logic
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_LIST.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <section className="relative w-full py-12 sm:py-24 overflow-hidden bg-white">
      {/* Background with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0 select-none pointer-events-none"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image 
          src={TestimonialBg} 
          alt="" 
          fill 
          className="object-cover opacity-90" 
          priority 
        />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center border-b border-[#D4D4D4] pb-20 mb-20 text-center">
          {/* Header */}
          <motion.header 
            className="mb-6"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src={TestimonialTagline} 
              alt="Testimonials" 
              width={110} 
              height={40} 
            />
          </motion.header>

          <motion.h2 
            className="text-3xl md:text-5xl font-extrabold text-[#274C5B] mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What Our Customer Saying?
          </motion.h2>

          {/* 3D Carousel */}
          <div className="relative w-full max-w-3xl h-96 perspective-1000">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="absolute inset-0 flex flex-col items-center px-4"
              >
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mb-5 ring-4 ring-white rounded-full shadow-xl"
                >
                  <Image 
                    src={TESTIMONIALS_LIST[activeIndex].avatar} 
                    alt={TESTIMONIALS_LIST[activeIndex].name} 
                    width={95} 
                    height={95} 
                    className="rounded-full" 
                  />
                </motion.div>

                {/* Stars */}
                <Stars rating={TESTIMONIALS_LIST[activeIndex].rating} />

                {/* Quote */}
                <motion.blockquote 
                  className="mt-6 mb-8 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Quote marks */}
                  <motion.span
                    className="absolute -top-4 -left-4 text-6xl text-[#7EB693]/20 font-serif"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    &ldquo;
                  </motion.span>
                  <p className="text-[#525C60] text-lg md:text-xl italic leading-relaxed">
                    {TESTIMONIALS_LIST[activeIndex].content}
                  </p>
                  <motion.span
                    className="absolute -bottom-4 -right-4 text-6xl text-[#7EB693]/20 font-serif"
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    &rdquo;
                  </motion.span>
                </motion.blockquote>

                {/* Author */}
                <motion.cite
                  className="not-italic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h5 className="text-xl font-bold text-[#274C5B]">
                    {TESTIMONIALS_LIST[activeIndex].name}
                  </h5>
                  <p className="text-sm font-medium text-[#7d7d7d]">
                    {TESTIMONIALS_LIST[activeIndex].role}
                  </p>
                </motion.cite>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex gap-2 mt-0" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS_LIST.map((testimonial, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Testimonial from ${testimonial.name}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondary-color) ${
                  idx === activeIndex 
                    ? "bg-(--primary-color) w-8" 
                    : "bg-(--muted-color) w-2.5 hover:bg-(--secondary-color)"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 justify-items-center">
          {STATS_DATA.map((stat, index) => (
            <EnhancedCircle key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}