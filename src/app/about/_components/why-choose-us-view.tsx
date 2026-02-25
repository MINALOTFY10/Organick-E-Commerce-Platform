import Image from "next/image";

import WhyWordImg from "@/../public/img/WhyChooseUsWord.png";
import WhyImg from "@/../public/img/WhyChooseUs.png";
import RingIcon from "@/../public/img/RingIcon.png";

const reasons = [
  { title: "100% Natural Product", description: "Simply dummy text of the printing and typesetting industry Lorem Ipsum" },
  { title: "Increases Resistance", description: "Filling, and temptingly healthy, our Biona Organic Granola with Wild Berries is just the thing" },
];

export default function WhyChooseUsView() {
  return (
    <section className="bg-gray-50 py-0">
      <div className="flex flex-col lg:flex-row items-center xl:gap-8 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col gap-4">
          <Image src={WhyWordImg} alt="Why Choose Us" width={145} height={30} />
          <h3 className="text-[40px] font-bold leading-11 text-(--primary-color)">
            We do not buy from the <br /> open market & traders.
          </h3>
          <p className="text-gray-500 mb-4">
            Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry&apos;s standard the 1500s, when an unknown
          </p>
          <div className="flex flex-col gap-4">
            {reasons.map((r, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 bg-gray-200 p-4 rounded-3xl max-w-fit pe-40">
                  <Image src={RingIcon} alt="" width={14} height={14} />
                  <h5 className="text-primary font-bold">{r.title}</h5>
                </div>
                <p className="ml-6 mt-2 text-gray-600">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end max-md:hidden">
          <Image src={WhyImg} alt="Why Choose Us Image" className="rounded-lg p-15" />
        </div>
      </div>
    </section>
  );
}
