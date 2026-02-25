import Image, { StaticImageData } from "next/image";

interface MainBannerProps {
  img: StaticImageData;
  title: string;
}

export default function SectionHeader({ img, title }: MainBannerProps) {
  return (
    <div className="relative w-full">
      <Image src={img} alt="" className="w-full max-h-[35vh] min-h-[18vh] object-cover" aria-hidden="true" />
      {/* Semi-transparent overlay for text readability */}
      <div className="absolute inset-0 bg-white/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-(--primary-color) text-4xl font-bold text-center md:text-7xl sm:text-4xl drop-shadow-sm">
          {title}
        </h1>
      </div>
    </div>
  );
}
