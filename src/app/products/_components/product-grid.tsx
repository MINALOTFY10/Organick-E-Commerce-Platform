import { Product } from "@/types/product";
import ProductItem from "./product-item";

export default function ProductGrid({
  products,
  favouritedIds = [],
  mobileScroll = false,
}: {
  products: Product[];
  favouritedIds?: string[];
  mobileScroll?: boolean;
}) {
  const favouriteSet = new Set(favouritedIds);
  if (!products.length) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-[bounce_2s_ease-in-out_infinite]">
          <svg 
            className="w-20 h-20 mx-auto text-gray-300 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
        </div>
        <p className="text-center text-gray-500 text-sm animate-[fadeIn_1s_ease-out_0.5s_backwards]">
          No products match your filters.
        </p>
      </div>
    );
  }

  if (mobileScroll) {
    return (
      <div className="flex sm:flex-wrap sm:justify-center gap-6
        overflow-x-auto sm:overflow-visible
        snap-x snap-mandatory sm:snap-none
        scrollbar-hide pb-4 sm:pb-0
        animate-[fadeIn_0.7s_ease-out]">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="shrink-0 snap-center w-[72vw] sm:shrink sm:w-[calc(50%-1.5rem)] lg:w-[calc(33%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-87.5 animate-[fadeInUp_0.6s_ease-out_backwards]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductItem product={product} isFavourited={favouriteSet.has(product.id)} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 animate-[fadeIn_0.7s_ease-out]">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33%-2rem)] xl:w-[calc(25%-2rem)] max-w-87.5 animate-[fadeInUp_0.6s_ease-out_backwards]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProductItem product={product} isFavourited={favouriteSet.has(product.id)} />
        </div>
      ))}
    </div>
  );
}