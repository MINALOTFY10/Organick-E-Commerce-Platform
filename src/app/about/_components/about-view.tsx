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
    <div className="flex flex-col lg:flex-row items-center gap-16 py-6 max-w-[1400px] xl:pe-10 mx-auto">
      <div className="flex-1 hidden lg:flex justify-end">
        <Image src={AboutMainImg} alt="About Us" className="rounded-lg" width={900} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <Image src={AboutTextImg} alt="About Us Logo" width={80} height={20} />
        <h3 className="text-4xl font-bold text-(--primary-color)">
          We do Creative <br /> Things for Success
        </h3>
        {features.map((f, idx) => (
          <p key={idx} className="text-gray-600 mt-2">
            {f.description}
          </p>
        ))}

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
              <Image src={f.icon} alt={f.title} width={50} height={50} />
              <h5 className="text-(--primary-color) font-bold text-xl">{f.title}</h5>
            </div>
          ))}
        </div>

        <div>
          <PrimaryButton>Explore Now</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
