import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "@/components/ui/primary-button";

import WhatweGrowImg from "@/../public/img/What we Grow.png";
import ContentImg from "@/../public/img/ContentImage.png";

import DairyIcon from "@/../public/img/DairyIcon.svg";
import StoreIcon from "@/../public/img/StoreIcon.svg";
import DeliveryIcon from "@/../public/img/DeliveryIcon.svg";
import AgriculturalIcon from "@/../public/img/AgriculturalIcon.svg";
import OrganicIcon from "@/../public/img/OrganicIcon.svg";
import FreshIcon from "@/../public/img/FreshIcon.svg";

interface ServiceItemType {
  image: string;
  title: string;
  description: string;
  position?: "left" | "right";
}

const serviceItems: ServiceItemType[] = [
  {
    image: DairyIcon,
    title: "Dairy Products",
    description:
      "Discover a wide range of delicious dairy products. From creamy milk to artisan cheeses, we offer the freshest and finest selections.",
  },
  {
    image: StoreIcon,
    title: "Store Services",
    description:
      "Explore our store services designed to make your shopping experience exceptional.",
  },
  {
    image: DeliveryIcon,
    title: "Delivery Services",
    description:
      "Experience hassle-free delivery services that bring your favorite products right to your doorstep.",
  },
  {
    image: AgriculturalIcon,
    title: "Agricultural Services",
    description:
      "Innovative agricultural services that help farmers maximize yields and ensure sustainability.",
  },
  {
    image: OrganicIcon,
    title: "Organic Products",
    description:
      "Certified organic products carefully sourced for quality and healthy living.",
  },
  {
    image: FreshIcon,
    title: "Fresh Vegetables",
    description:
      "Farm-fresh vegetables sourced locally to elevate your meals.",
  },
];

export default function ServiceSection() {
  return (
    <section className="container mx-auto px-4 py-0 text-center xl:text-left">
      {/* Header */}
      <div className="text-center">
        <Image src={WhatweGrowImg} alt="What We Grow" className="mx-auto w-28 mb-2" />
        <h2 className="text-3xl md:text-4xl font-bold text-(--primary-color)">
          Better Agriculture for <br /> Better Future
        </h2>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-center">
        {/* Left */}
        <div className="flex flex-col gap-4 xl:text-right">
          {serviceItems.slice(0, 3).map((item, i) => (
            <ServiceItem key={i} {...item} position="left" />
          ))}
        </div>

        {/* Center Image */}
        <div className="flex justify-center">
          <Image src={ContentImg} alt="Content" className="w-1/2 xl:w-full" />
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 text-left">
          {serviceItems.slice(3).map((item, i) => (
            <ServiceItem key={i + 3} {...item} position="right" />
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="mt-3 flex justify-center">
        <Link href="service/details">
          <PrimaryButton>Explore More</PrimaryButton>
        </Link>
      </div>
    </section>
  );
}

function ServiceItem({ image, title, description, position }: ServiceItemType) {
  return (
    <div>
      <Image src={image} alt={title} className={`w-14 mb-2 mx-auto xl:mx-0 ${position === "right" ? "xl:mr-auto" : "xl:ml-auto"}`} />
      <h5 className="font-bold text-lg text-(--primary-color)">{title}</h5>
      <p className="text-[14px] text-gray-500">{description}</p>
    </div>
  );
}
