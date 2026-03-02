"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import OrganicJuiceImg from "@/../public/img/orange-juice.jpg";
import OrganicFoodImg from "@/../public/img/organic-food.jpg";
import NutsCookiesImg from "@/../public/img/nuts-food.jpg";

const options = [
  {
    id: 1,
    title: "Beverages",
    category: "Beverages",
    image: OrganicJuiceImg,
    alt: "Hand holding organic yellow juice bottle",
  },
  {
    id: 2,
    title: "Organic Food",
    category: "Fruits",
    image: OrganicFoodImg,
    alt: "Green organic vegetables flatlay",
  },
  {
    id: 3,
    title: "Nuts Cookies",
    category: "Nuts",
    image: NutsCookiesImg,
    alt: "Cookies and marshmallows pattern",
  },
];

const OptionCard = ({ option, index }: { option: (typeof options)[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/products?category=${option.category}`} className="block">
        <div className="group relative h-100 w-full overflow-hidden cursor-pointer rounded-xl">
          {/* Image — simple hover zoom, no Ken Burns */}
          <Image
            src={option.image}
            alt={option.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/15 to-transparent transition-colors duration-300 group-hover:from-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-8 py-3.5 rounded-xl text-base font-bold text-(--primary-color) shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
              {option.title}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function OptionsView() {
  return (
    <section className="bg-[#fcfdfd] py-20 relative overflow-hidden" aria-label="Product categories">
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-(--primary-color) mb-4">
            Explore Our Categories
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-(--secondary-color) to-(--accent-color) mx-auto rounded-full" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 px-4">
          {options.map((option, index) => (
            <OptionCard key={option.id} option={option} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}