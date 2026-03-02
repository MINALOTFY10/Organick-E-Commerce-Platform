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
    <section className="bg-(--primary-color) py-15">
      <div className="flex flex-col items-center gap-2 mb-10">
        <Image src={AboutLogoImg} alt="About Us" width={100} />
        <h2 className="text-white text-3xl font-bold">What We Offer for You</h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto gap-4">
        {products.map((p, idx) => (
          <div key={idx} className="group flex flex-col items-center">
            <div className="bg-white rounded-3xl flex items-center justify-center w-52 h-56 overflow-hidden">
              {idx === products.length - 1 ? (
                <Image src={p.img} alt={p.title} width={180} height={200} className="object-contain px-5" />
              ) : (
                <Image src={p.img} alt={p.title} width={200} height={200} className="object-contain" />
              )}
            </div>
            <h5 className="text-white font-bold text-lg mt-2">{p.title}</h5>
          </div>
        ))}
      </div>
    </section>
  );
}
