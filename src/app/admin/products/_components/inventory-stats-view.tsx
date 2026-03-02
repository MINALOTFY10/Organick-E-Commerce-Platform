import { StatsCard } from "@/app/admin/_components/stats-card";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface StatsProps {
  stats: { totalProductsCount: number; inStock: number; lowStock: number; outOfStock: number };
}

export function InventoryStatsView({ stats }: StatsProps) {
  const cards = [
    { label: "Total Products", value: stats.totalProductsCount, icon: Package, color:  "bg-blue-500/20" },
    { label: "In Stock", value: stats.inStock, icon: CheckCircle, color: "bg-[#00ff7f]/20" },
    { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, color: "bg-yellow-500/20" },
    { label: "Out of Stock", value: stats.outOfStock, icon: XCircle, color: "bg-red-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <StatsCard cards={cards} />
    </div>
  );
}