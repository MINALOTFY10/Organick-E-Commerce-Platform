import { 
  SkeletonStatCards, 
  SkeletonChart, 
  SkeletonCard,
  SkeletonTable,
  Skeleton
} from '@/components/ui/skeleton-components';

export function StatsCardSkeleton({ count = 4 }: { count?: number }) {
  return <SkeletonStatCards count={count} />;
}

export function SalesOverviewSkeleton() {
  return (
    <div className="lg:col-span-2">
      <SkeletonChart 
        height="h-[300px]"
        title="Sales Overview"
        showControls
      />
    </div>
  );
}

export function CategoryPieChartSkeleton() {
  return (
    <SkeletonCard>
      {/* Title */}
      <div className="h-6 w-48 bg-[#2a4d42] rounded mb-6" />

      {/* Pie */}
      <div className="flex justify-center mb-6">
        <div className="relative h-48 w-48 flex items-center justify-center">
          {/* Outer circle */}
          <div className="absolute w-40 h-40 rounded-full bg-[#2a4d42]" />
          {/* Inner hole */}
          <div className="absolute w-24 h-24 rounded-full bg-[#1a3d32]" />

          {/* Center text */}
          <div className="absolute flex flex-col items-center gap-2">
            <div className="h-3 w-20 bg-[#2a4d42] rounded" />
            <div className="h-5 w-10 bg-[#2a4d42] rounded" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2a4d42]" />
              <div className="h-4 w-24 bg-[#2a4d42] rounded" />
            </div>
            <div className="text-right space-y-1">
              <div className="h-4 w-16 bg-[#2a4d42] rounded" />
              <div className="h-3 w-10 bg-[#2a4d42] rounded" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

export function TopSellingProductsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <SkeletonTable
      headers={["PRODUCT", "CATEGORY", "PRICE", "SOLD", "STATUS"]}
      rows={rows}
      columns={[
        { width: "w-48" },
        { width: "w-24" },
        { width: "w-16" },
        { width: "w-10" },
        { width: "w-16" }
      ]}
    />
  );
}