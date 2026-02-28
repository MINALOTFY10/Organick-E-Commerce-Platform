import Image from "next/image";

import WhoWeAreCard from "./who-we-are-card";

import WhoAreWeImg from "@/../public/img/who-are-you.png";
import EcoFriendlyImg from "@/../public/img/ecofriendly-tagline.png";

interface ParagraphItem {
  title: string;
  text: string;
}

const paragraphData: ParagraphItem[] = [
  {
    title: "Our Mission",
    text: "At Organick, we are dedicated to providing fresh, organic products sourced from trusted farmers. Our goal is to make healthy living for everyone.",
  },
  {
    title: "Empowering Healthy Choices",
    text: "We educate our customers on the benefits of organic foods and offer guidance on incorporating natural.",
  },
  {
    title: "Sustainable Farming Practices",
    text: "We collaborate with farmers who follow eco-friendly techniques, protecting the environment, and ensuring product meets the highest quality standards.",
  },
];

export default function OurMissionView() {
  return (
    <section className="flex flex-col xl:flex-row w-full bg-white cursor-default">
      <div className="hidden xl:block xl:flex-1 relative min-h-150">
        <Image src={WhoAreWeImg} alt="Who Are We" fill className="object-cover" priority />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center relative py-8 sm:py-12 xl:py-0 bg-[#f9f9f9] xl:bg-transparent">
        <WhoWeAreCard>
          <div className="mb-2">
            <Image src={EcoFriendlyImg} alt="Eco Friendly Tag" width={100} height={40} className="object-contain" />
          </div>
          <h2 className="text-[#274c5b] text-3xl md:text-[2.5rem] font-extrabold leading-tight mb-8 max-w-[80%]">
            Organick is a Friendly Organic Store
          </h2>

          <div className="space-y-6">
            {paragraphData.map((item, index) => (
              <div key={index} className="group">
                <h4 className="text-[#274c5b] font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-[#7d7d7d] text-sm md:text-base leading-tight group-hover:text-(--primary-color) transition">{item.text}</p>
              </div>
            ))}
          </div>
        </WhoWeAreCard>
      </div>
    </section>
  );
}
