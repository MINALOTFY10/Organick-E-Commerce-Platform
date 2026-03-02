import { Layers, Package, BarChart3, Crown } from "lucide-react";
import { Category } from "./categories-view";
import { StatsCard } from "@/components/admin/dashboard/stats-card";

export default function CategoryStats({ categories }: { categories: Category[] }) {
  const totalProducts = categories.reduce((s, c) => s + c._count.products, 0);

  const largestCategory = categories.length ? categories.reduce((prev, curr) => (curr._count.products > prev._count.products ? curr : prev)) : null;

  const cards = [
    {
      label: "Total Categories",
      value: categories.length,
      icon: Layers,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Avg Products/Category",
      value: categories.length ? Math.round(totalProducts / categories.length) : 0,
      icon: BarChart3,
      color: "from-orange-500 to-amber-500",
    },
    {
      label: "Largest Category",
      value: largestCategory ? largestCategory.name : "N/A",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatsCard cards={cards} />
    </div>
  );
}
