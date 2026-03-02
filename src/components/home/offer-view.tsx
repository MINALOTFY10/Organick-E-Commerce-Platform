import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

import OfferTaglineImg from "@/../public/img/Offer.png";

import SecondaryButton from "@/components/ui/secondary-button";
import ProductsGrid from "@/app/products/_components/product-grid";

interface OfferSectionProps {
  products: Product[];
}

export default function OfferView({ products }: OfferSectionProps) {
  // Products are already filtered to the desired categories by the data layer.
  return (
    <section className="flex flex-col items-center w-full mb-0 bg-(--primary-color) py-25 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-60 h-60 border-4 border-white/5 rounded-full" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 border-4 border-white/5 rounded-full" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center w-[90%] sm:w-[80%] justify-between mb-7 gap-4 sm:gap-0 relative z-10 animate-[fadeInUp_0.7s_ease-out]">
        <div className="flex flex-col mb-2 text-start">
          <div className="animate-[floatRotate_6s_ease-in-out_infinite]">
            <Image src={OfferTaglineImg} alt="Offer" width={70} height={70} />
          </div>
          <h1 className="text-3xl font-bold text-white mt-1 relative animate-[fadeInUp_0.7s_ease-out_0.3s_backwards]">
            Clean, Organic Animal Products
            <span className="absolute -bottom-1 left-0 h-0.5 bg-white/60 animate-[slideInRight_1s_ease-out_0.5s_backwards]" style={{ width: '75%' }} />
          </h1>
        </div>
        <Link href="/products?category=Meat" className="mb-3 group relative animate-[fadeInUp_0.7s_ease-out_0.4s_backwards]">
          <SecondaryButton>
            <span className="flex items-center gap-2">
              Shop Now
            </span>
          </SecondaryButton>
        </Link>
      </div>

      <div className="w-[90%] sm:w-[80%] relative z-10 animate-[fadeInUp_0.7s_ease-out_0.6s_backwards]">
        <ProductsGrid products={products} isOfferView={true}/>
      </div>
    </section>
  );
}