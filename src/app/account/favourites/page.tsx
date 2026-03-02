import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { getUserFavourites } from "@/actions/favourite-actions";
import { getServerSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { formatCents } from "@/lib/constants/currency";
import FavouriteButton from "@/app/products/_components/favourite-button";

export const metadata = {
  title: "My Favourites",
  description: "Products you have saved to your favourites.",
};

export default async function FavouritesPage() {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/login");

  const favourites = await getUserFavourites(session.user.id);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-(--primary-color)/5 p-4 md:p-5">
        <h2 className="text-2xl font-bold text-(--primary-color)">My Favourites</h2>
        <p className="text-sm text-(--muted-foreground) mt-1">
          {favourites.length === 0
            ? "You haven't saved any products yet."
            : `${favourites.length} saved product${favourites.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {favourites.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 shadow-sm border border-gray-100 text-center">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="font-medium text-(--primary-color)">No favourites yet</p>
          <p className="text-sm text-(--muted-foreground) mt-1">
            Tap the heart icon on any product to save it here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 bg-(--primary-color) text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favourites.map(({ id, product }) => (
            <div
              key={id}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Remove button */}
              <div className="absolute top-3 right-3 z-10">
                <FavouriteButton
                  productId={product.id}
                  isFavourited={true}
                />
              </div>

              {/* Image */}
              <Link href={`/products/${product.id}`} className="block">
                <div className="mx-3 mt-3 rounded-xl overflow-hidden bg-gray-50 aspect-square">
                  <img
                    src={product.imageUrl ?? "/img/product-example.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex flex-col flex-1 p-4 gap-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {product.category.name}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="font-semibold text-gray-900 text-sm leading-snug hover:text-(--primary-color) transition-colors line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{product.summary}</p>

                <div className="flex items-center justify-between mt-auto pt-3">
                  <span className="text-base font-bold text-gray-900">
                    {formatCents(product.price)}
                  </span>
                  {product.stock === 0 ? (
                    <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2.5 py-0.5">
                      Sold out
                    </span>
                  ) : (
                    <Link
                      href={`/products/${product.id}`}
                      className="text-xs font-semibold bg-(--primary-color) text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
