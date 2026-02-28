import Image from "next/image";

import FruitsImg from "@/../public/img/WeOfferFruits.png";
import NutsImg from "@/../public/img/WeOfferNuts.png";
import SpicyImg from "@/../public/img/WeOfferSpicy.png";
import VeggiesImg from "@/../public/img/WeOfferVegetable.png";
import AboutLogoImg from "@/../public/img/AboutUs.png";

const products = [
  { title: "Fruits", img: FruitsImg },
  { title: "Nuts & Seeds", img: NutsImg },
  { title: "Spicy", img: SpicyImg },
  { title: "Vegetables", img: VeggiesImg },
];

export default function OfferProductsView() {
  return (
    <section className="bg-(--primary-color) py-10 sm:py-14">
      <div className="flex flex-col items-center gap-2 mb-8">
        <Image src={AboutLogoImg} alt="About Us" width={80} className="mb-2" />
        <h2 className="text-white text-2xl sm:text-3xl font-bold">What We Offer for You</h2>
      </div>
      <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl xl:max-w-5xl mx-auto w-full px-4 sm:px-0 snap-x snap-mandatory pb-4">
        {products.map((p, idx) => (
          <div key={idx} className="group flex flex-col items-center shrink-0 snap-center">
            <div className="bg-white rounded-2xl flex items-center justify-center w-40 h-44 sm:w-48 sm:h-52 overflow-hidden">
              <Image src={p.img} alt={p.title} width={160} height={180} className="object-contain" />
            </div>
            <h5 className="text-white font-bold text-base sm:text-lg mt-2">{p.title}</h5>
          </div>
        ))}
      </div>
    </section>
  );
}