import Image from "next/image";
import PrimaryButton from "@/components/ui/primary-button";

import AboutIcon1 from "@/../public/img/AboutUsFirstIcon.svg";
import AboutIcon2 from "@/../public/img/AboutUsSecondIcon.svg";
import AboutTextImg from "@/../public/img/AboutUs.png";
import AboutMainImg from "@/../public/img/AboutUsAbout.png";
import { StaticImageData } from "next/image";

interface AboutFeature {
  icon: StaticImageData;
  title: string;
  description: string;
}

const features: AboutFeature[] = [
  {
    icon: AboutIcon1,
    title: "Modern Agriculture Equipment",
    description:
      "Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
  },
  {
    icon: AboutIcon2,
    title: "No growth hormones are used",
    description:
      "Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
  },
];

export default function AboutSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16 max-w-5xl xl:max-w-6xl mx-auto w-full">
      <div className="flex-1 hidden lg:flex justify-end">
        <Image src={AboutMainImg} alt="About Us" className="rounded-xl object-cover w-full max-w-[400px] xl:max-w-[500px]" width={500} />
      </div>
      <div className="flex-1 flex flex-col gap-4 sm:gap-4 w-full">
        <Image src={AboutTextImg} alt="About Us Logo" width={80} height={20} />
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--primary-color) leading-tight">
          We do Creative <br className="hidden md:block" /> Things for Success
        </h3>
        {features.map((f, idx) => (
          <p key={idx} className="text-gray-600 mt-2 text-base sm:text-lg max-w-xl">
            {f.description}
          </p>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg border border-gray-200">
              <Image src={f.icon} alt={f.title} width={40} height={40} />
              <h5 className="text-(--primary-color) font-bold text-lg">{f.title}</h5>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <PrimaryButton className="px-8 py-3 text-base">Explore Now</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
