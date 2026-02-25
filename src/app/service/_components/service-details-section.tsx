import Image from "next/image";

import ServiceSingleImg from "@/../public/img/ServiceSingleWall.png";
import whyOrganicImg from "@/../public/img/WhyOrganic.png";
import produceImg from "@/../public/img/Produce.png";

export default function ServiceSingleSection() {
  return (
    <section className="container mx-auto px-4 xl:px-0 xl:w-9/12 mt-16">
      {/* Hero Image */}
      <Image
        src={ServiceSingleImg}
        alt="Organic Farming Services"
        className="w-[60vw] rounded-3xl mx-auto block"
        priority
      />

      <div className="xl:w-8/12 mx-auto mt-16 space-y-16">
        {/* Header */}
        <div className="text-center xl:text-left space-y-4">
          <h2 className="text-3xl md:text-[2.4rem] font-bold text-primary">
            Organic Store Services
          </h2>

          <p className="text-gray-500">
            At Organick, we provide carefully curated organic services that support healthy living and sustainable farming.
            Every product and service we offer is designed to protect your health, respect the environment, and deliver real nutritional value to your table.
          </p>

          <p className="text-gray-500">
            From soil preparation to harvest delivery, our services follow strict organic standards and eco-friendly practices,
            ensuring freshness, purity, and full traceability from farm to home.
          </p>
        </div>

        {/* Middle Cards */}
        <div className="space-y-10">
          <div className="grid xl:grid-cols-12 gap-6 items-center">
            <div className="xl:col-span-5">
              <Image
                src={whyOrganicImg}
                alt="Why Choose Organic Farming"
                className="rounded-3xl"
              />
            </div>

            <div className="xl:col-span-7 bg-[#F9F8F8] rounded-[25px] p-6">
              <h5 className="font-semibold text-lg">Why Organic</h5>
              <p className="text-gray-500 pt-2">
                Organic farming protects your body from harmful chemicals while preserving soil fertility and biodiversity.
                We rely on natural compost, clean water sources, and sustainable techniques that produce healthier crops
                with better taste and higher nutritional value.
              </p>
            </div>
          </div>

          <div className="grid xl:grid-cols-12 gap-6 items-center">
            <div className="xl:col-span-7 bg-[#F9F8F8] rounded-[25px] p-6 order-2 xl:order-1">
              <h5 className="font-semibold text-lg">Specialty Produce</h5>
              <p className="text-gray-500 pt-2">
                We grow and supply specialty fruits and vegetables selected for quality, seasonality, and freshness.
                Our produce is harvested at peak ripeness and delivered quickly to guarantee superior flavor and maximum nutrients.
              </p>
            </div>

            <div className="xl:col-span-5 order-1 xl:order-2">
              <Image
                src={produceImg}
                alt="Fresh Organic Specialty Produce"
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>

        {/* Last Section */}
        <div className="space-y-10">
          <div className="text-center xl:text-left">
            <h4 className="text-xl md:text-2xl font-bold text-primary">
              We Farm Your Land
            </h4>
            <p className="text-gray-500 mt-2">
              Our team offers professional land farming services using certified organic methods that improve soil quality,
              increase crop yield, and reduce environmental impact. Whether you own farmland or manage agricultural projects,
              we help you grow cleaner and healthier harvests.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <FeatureCard number="01" title="Premium Organic Support" />
            <FeatureCard number="02" title="100% Satisfaction Guarantee" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center bg-[#F9F8F8] rounded-[40px] px-6 py-3 w-full xl:w-fit">
      <span className="bg-[#7EB693] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
        {number}
      </span>
      <h5 className="text-[#274C5B] font-semibold">{title}</h5>
    </div>
  );
}
