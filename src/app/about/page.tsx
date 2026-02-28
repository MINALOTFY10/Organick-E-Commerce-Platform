import type { Metadata } from "next";
import SectionHeader from "@/components/section-header";
import AboutView from "@/app/about/_components/about-view";
import WhyChooseUsView from "@/app/about/_components/why-choose-us-view";
import OfferProductsView from "@/app/about/_components/offer-products-view";
import OfferView from "@/app/about/_components/offer-view";
import AboutBannerImg from "@/../public/img/AboutUsBanner.png";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Organick's mission to bring fresh, certified organic produce to your table. Discover our story, values, and commitment to sustainability.",
  openGraph: {
    title: "About Us — Organick",
    description: "Learn about Organick's mission to bring fresh, certified organic produce to your table.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <SectionHeader img={AboutBannerImg} title="About Us" />
      {/* Use tighter container and more consistent vertical spacing */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 space-y-10 py-8 sm:pt-14 pb-8">
        <AboutView />
        <WhyChooseUsView />
        <OfferView />
      </div>

      <OfferProductsView />
    </main>
  );
}
