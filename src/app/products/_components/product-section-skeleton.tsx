export default function ProductSectionSkeleton({size = 8}: {size?: number}) {
  return (
    <section className="flex flex-col items-center w-full mt-4 mb-0 max-w-[80%] mx-auto animate-pulse">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-6 bg-gray-200 rounded mb-2" />
        <div className="w-48 h-8 bg-gray-300 rounded" />
      </div>

      {/* Products */}
      <div
        className="
          flex 
          flex-nowrap 
          overflow-x-auto 
          snap-x 
          snap-mandatory 
          w-full 
          px-4 
          gap-4
          pb-4 
          md:flex-wrap 
          md:justify-center 
          md:overflow-hidden 
          md:px-0
          no-scrollbar
        "
      >
        {Array.from({ length: size }).map((_, i) => (
          <div
            key={i}
            className="
              snap-center 
              shrink-0 
              w-[85%] 
              sm:w-[300px] 
              md:w-auto
            "
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-8 w-40 h-12 bg-gray-300 rounded-full" />
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex justify-center h-full max-w-[250px] mx-auto">
      <div className="p-4 px-8 rounded-2xl w-full bg-white flex flex-col">
        {/* Badge */}
        <div className="w-20 h-5 bg-gray-200 rounded mb-3" />

        {/* Image */}
        <div className="w-full h-48 bg-gray-200 rounded-md mb-3" />

        {/* Title */}
        <div className="w-full h-5 bg-gray-300 rounded mb-3" />

        <hr className="my-2" />

        {/* Footer */}
        <div className="mt-auto pt-2 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-10 h-4 bg-gray-200 rounded" />
            <div className="w-12 h-4 bg-gray-300 rounded" />
          </div>

          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
