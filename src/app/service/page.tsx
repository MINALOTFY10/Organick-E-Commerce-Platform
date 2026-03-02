import type { Metadata } from "next";
import ServiceBannerImg from "@/../public/img/ServiceBanner.jpg";
import SectionHeader from "@/components/section-header";
import ServiceSection from "@/app/service/_components/service-section";
import WallSection from "@/app/service/_components/wall-section";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore the services Organick offers — from organic product delivery and farm partnerships to personalised nutrition guidance.",
  openGraph: {
    title: "Our Services — Organick",
    description: "Explore the full range of services offered by Organick.",
    type: "website",
  },
};

export default function ServicePage() {
  return (
    <>
      <SectionHeader img={ServiceBannerImg} title="Our Services" />
      <div className="px-0 xs:px-10 sm:px-20 mt-20">
        <ServiceSection />
      </div>
      <WallSection />
    </>
  );
}
