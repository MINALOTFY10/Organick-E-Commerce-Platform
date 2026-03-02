import { Product } from "@/types/product";
import ProductItem from "./product-item";

export default function ProductGrid({
  products,
  favouritedIds = [],
  mobileScroll = false,
  isOfferView = false,
}: {
  products: Product[];
  favouritedIds?: string[];
  mobileScroll?: boolean;
  isOfferView?: boolean;
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

  return (
    <div
      className={`animate-[fadeIn_0.7s_ease-out] ${
        isOfferView
          ? "flex xl:grid overflow-x-auto xl:overflow-visible scrollbar-hide gap-3 sm:gap-4 pb-4 snap-x snap-mandatory xl:grid-cols-6 xl:gap-6"
          : "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-6 pb-4"
      }`}
      style={isOfferView ? undefined : { gridAutoRows: '1fr' }}
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`animate-[fadeInUp_0.6s_ease-out_backwards] ${
            isOfferView ? "shrink-0 w-50 sm:w-52 xl:w-auto snap-start" : "w-full h-full"
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProductItem product={product} isFavourited={favouriteSet.has(product.id)} />
        </div>
      ))}
    </div>
  );
}