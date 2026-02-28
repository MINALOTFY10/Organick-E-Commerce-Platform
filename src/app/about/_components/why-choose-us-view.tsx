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
    <section className="bg-gray-50">
      <div className="flex flex-col lg:flex-row items-center gap-8 xl:gap-16 max-w-5xl xl:max-w-6xl mx-auto w-full">
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 w-full">
          <Image src={WhyWordImg} alt="Why Choose Us" width={145} height={30}  />
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-(--primary-color)">
            We do not buy from the <br className="hidden md:block" /> open market & traders.
          </h3>
          <p className="text-gray-500 mb-4 text-base sm:text-lg max-w-xl">
            Simply dummy text of the printing and typesetting industry. Lorem had ceased to been the industry&apos;s standard the 1500s, when an unknown
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2 bg-gray-200 p-4 rounded-2xl border border-gray-300">
                  <Image src={RingIcon} alt="" width={18} height={18} />
                  <h5 className="text-(--primary-color) font-bold text-base">{r.title}</h5>
                </div>
                <p className="ml-6 mt-2 text-gray-600 text-sm sm:text-base">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end w-full max-md:hidden">
          <Image src={WhyImg} alt="Why Choose Us Image" className="rounded-xl object-cover w-full max-w-[350px] xl:max-w-[400px]" width={400} />
        </div>
      </div>
    </section>
  );
}
