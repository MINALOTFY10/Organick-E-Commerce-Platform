export default function CategoryPieChartSkeleton() {
  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6 animate-pulse">
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
    </div>
  );
}
