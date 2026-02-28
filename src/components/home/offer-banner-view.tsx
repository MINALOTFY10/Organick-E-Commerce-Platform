"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface BannerData {
  image: string;
  slogan: [string, string, string];
  styles: { color: string } | string;
  altText: string;
}

const OfferCard = ({ banner, index }: { banner: BannerData; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative overflow-hidden rounded-2xl group min-w-[70vw] sm:min-w-[48vw] md:min-w-0"
    >
      {/* Image */}
      <div className="relative">
        <Image
          src={banner.image}
          alt={banner.altText}
          width={700}
          height={400}
          className="w-full object-cover max-h-52 md:max-h-none transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-start pl-4 sm:pl-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
        >
          <Image 
            src={banner.slogan[0]} 
            alt="" 
            width={100} 
            height={40} 
            className="mb-1 w-14 sm:w-24 object-contain" 
            aria-hidden="true"
          />
        </motion.div>

        <motion.h3
          className={`${typeof banner.styles === "string" ? banner.styles : ""} font-bold md:font-extrabold text-xl lg:text-2xl leading-5 sm:leading-7`}
          style={typeof banner.styles === "object" ? banner.styles : {}}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
        >
          {banner.slogan[1]} <br />
          {banner.slogan[2]}
        </motion.h3>
      </div>

      {/* Subtle hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none rounded-2xl" />
    </motion.div>
  );
};

export default function OfferBannerView() {
  const bannerData: BannerData[] = [
    {
      image: "/img/first-offer.png",
      slogan: ["/img/natural-phrase.png", "Get Garden", "Fresh Fruits"],
      styles: "text-white",
      altText: "Garden fresh fruits offer",
    },
    {
      image: "/img/second-offer.png",
      slogan: ["/img/offer-phrase.png", "Get 10% off", "on Vegetables"],
      styles: "text-(--secondary-color)",
      altText: "10% off vegetables offer",
    },
  ];

  return (
    <section
      className="max-w-230 mx-auto px-4 py-6 sm:pt-16 flex gap-6 overflow-x-auto md:grid md:grid-cols-2 md:gap-8 md:overflow-x-visible scrollbar-hide"
      aria-label="Current offers"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {bannerData.map((banner, index) => (
        <OfferCard
          key={index}
          banner={banner}
          index={index}
        />
      ))}
    </section>
  );
}