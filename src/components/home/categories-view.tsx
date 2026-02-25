import Image from "next/image";
import Link from "next/link";

// Decorative product images cycled across category cards
import fruitsCategoryImg from "@/../public/img/fruits_category.png";
import dairyCategoryImg from "@/../public/img/dairy_category.png";
import bakeryCategoryImg from "@/../public/img/bakery_category.png";
import vegetablesCategoryImg from "@/../public/img/vegetables_category.png";
import frozenCategoryImg from "@/../public/img/frozen_category.png";
import nutsCategoryImg from "@/../public/img/nuts_category.png";
import meatsCategoryImg from "@/../public/img/meats_category.png";
import oilsCategoryImg from "@/../public/img/oils_category.png";
import condimentsCategoryImg from "@/../public/img/condiments_category.png";
import seafoodCategoryImg from "@/../public/img/seafood_category.png";
import grainsCategoryImg from "@/../public/img/grains_category.png";
import beveragesCategoryImg from "@/../public/img/beverages_category.png";

const CARD_IMAGES = [
  fruitsCategoryImg,
  dairyCategoryImg,
  bakeryCategoryImg,
  vegetablesCategoryImg,
  frozenCategoryImg,
  nutsCategoryImg,
  meatsCategoryImg,
  oilsCategoryImg,
  condimentsCategoryImg,
  seafoodCategoryImg,
  grainsCategoryImg,
  beveragesCategoryImg
];

// Soft pastel backgrounds cycling through the card grid
const CARD_COLORS = [
  "bg-[#EEF3F5]", // light steel blue
  "bg-[#E8F5F0]", // light mint
  "bg-[#FFF8E8]", // light yellow
  "bg-[#FFF0EE]", // light blush
  "bg-[#F0F0FF]", // light lavender
  "bg-[#F5F5F0]", // light sage
  "bg-[#FFF5F0]", // light peach
];

interface Category {
  id: string;
  name: string;
}

export default function CategoriesView({ categories }: { categories: Category[] }) {
  return (
    <section className="w-full max-w-[80%] mx-auto my-12 animate-[fadeInUp_0.7s_ease-out]">
      {/* Section header */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        All categories
        <span className="block h-1 w-16 bg-(--primary-color) rounded-full mt-2" />
      </h2>

      {/* Category grid */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 xs:grid-cols-4">
        {categories.map((category, index) => {
          const bgColor = CARD_COLORS[index % CARD_COLORS.length];
          const imgSrc = CARD_IMAGES[index % CARD_IMAGES.length];

          return (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className={`
                relative flex flex-col rounded-2xl overflow-hidden
                ${bgColor} p-5 min-h-45 group
                transition-transform duration-300 hover:-translate-y-1 hover:shadow-md
              `}
            >
              {/* Category name */}
              <span className="text-xl font-bold text-gray-800 z-10 leading-snug max-w-[65%]">
                {category.name}
              </span>

              {/* Decorative image — bottom-right, clipped by card edges */}
              <div className="absolute bottom-0 right-0 w-54 h-54 translate-x-12 translate-y-12 transition-transform duration-300 group-hover:translate-y-10 group-hover:translate-x-6">
                <Image
                  src={imgSrc}
                  alt={category.name}
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="208px"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
