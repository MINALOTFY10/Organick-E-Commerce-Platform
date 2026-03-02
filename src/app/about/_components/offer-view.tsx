import Image, { StaticImageData } from "next/image";
import PrimaryButton from "@/components/ui/primary-button";

// Assets
import AboutIcon1 from "@/../public/img/AboutUsFirstIcon.svg";
import AboutIcon2 from "@/../public/img/AboutUsSecondIcon.svg";
import AboutTextImg from "@/../public/img/AboutUs.png";
import AboutMainImg from "@/../public/img/AboutUsAbout.png";

interface Feature {
  icon: StaticImageData;
  title: string;
}

const FEATURES: Feature[] = [
  { icon: AboutIcon1, title: "Modern Agriculture Equipment" },
  { icon: AboutIcon2, title: "No growth hormones are used" },
];

const DESCRIPTION = "Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.";

export default function AboutView() {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-12 xl:gap-24">
      {/* Hero Image Section */}
      <div className="flex-1 w-full hidden lg:block">
        <Image 
          src={AboutMainImg} 
          alt="About our farm" 
          className="rounded-3xl object-cover w-full h-auto"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="space-y-4">
          <Image src={AboutTextImg} alt="Label" width={80} height={20} />
          <h2 className="text-4xl md:text-5xl font-extrabold text-(--primary-color) leading-tight">
            We do Creative <br className="hidden md:block" /> Things for Success
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl">
            {DESCRIPTION}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 transition-hover hover:shadow-sm"
            >
              <div className="shrink-0">
                <Image src={feature.icon} alt={feature.title} width={45} height={45} />
              </div>
              <h4 className="text-(--primary-color) font-bold text-lg leading-snug">
                {feature.title}
              </h4>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <PrimaryButton className="px-10 py-4">Explore Now</PrimaryButton>
        </div>
      </div>
    </section>
  );
}