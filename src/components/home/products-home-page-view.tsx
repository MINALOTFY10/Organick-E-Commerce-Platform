import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product";
import CategoriesPhraseImg from "@/../public/img/categories-phrase.png";


import PrimaryButton from "@/components/ui/primary-button";
import ProductGrid from "@/app/products/_components/product-grid";

export default function ProductsHomePageView({ products }: { products: Product[] }) {
  return (
    <section className="flex flex-col items-center w-full mt-4 mb-0 max-w-[80%] mx-auto relative overflow-hidden">

      <div className="flex flex-col items-center mb-6 relative z-10 animate-[fadeInUp_0.7s_ease-out]">
        <div className="animate-[gentleBounce_3s_ease-in-out_infinite]">
          <Image src={CategoriesPhraseImg} alt="Categories" width={100} height={100} />
        </div>
        <h1 className="text-4xl font-bold text-(--primary-color) mt-1 relative animate-[fadeInUp_0.7s_ease-out_0.3s_backwards]">
          Our Products
          <span className="absolute -bottom-2 left-0 h-1 bg-linear-to-r from-[#2D5356] via-[#2D5356]/50 to-transparent animate-[slideInRight_1s_ease-out_0.5s_backwards]" style={{ width: '100%' }} />
        </h1>
      </div>

      <div className="w-full relative z-10">
        <ProductGrid products={products} />
      </div>

      <Link href="/products" className="mt-8 relative z-10 group animate-[fadeInUp_0.7s_ease-out_0.7s_backwards]">
        <div className="relative">
          <PrimaryButton>
            <span className="flex items-center gap-2">
              Learn More
            </span>
          </PrimaryButton>
        </div>
      </Link>
    </section>
  );
}