import { CategoriesStatsType } from "@/app/admin/page";
import { formatCents } from "@/lib/constants/currency";

export function CategoriesDynamicLegend({ stats }: { stats: CategoriesStatsType }) {
  return (
    <div className="space-y-3">
      {stats.salesByCategory.slice(0, 5).map((cat) => (
        <div key={cat.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
            <span className="text-sm text-gray-300">{cat.name}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-white block">{formatCents(cat.value)}</span>
            <span className="text-[10px] text-gray-500 uppercase">{stats.revenue > 0 ? ((cat.value / stats.revenue) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>
      ))}

      {stats.salesByCategory.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No sales data available</p>}
    </div>
  );
}
