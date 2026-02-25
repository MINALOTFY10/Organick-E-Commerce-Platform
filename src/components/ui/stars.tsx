import Star from "./star";

interface StarsProps {
  rating: number; // 0 → 10
}

export default function Stars({ rating }: StarsProps) {
  rating = rating || 0;
  const stars = (rating / 10) * 5;
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${stars.toFixed(1)} out of 5 stars`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={"f" + i} type="full" />
      ))}

      {/* Half star */}
      {hasHalfStar && <Star type="half" />}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={"e" + i} type="empty" />
      ))}
    </div>
  );
}
