import { 
  SkeletonPageHeader,
  SkeletonFilters,
  SkeletonTable,
  SkeletonCard,
  SkeletonInfoCard,
  Skeleton,
  SkeletonText
} from '@/components/ui/skeleton-components';
import { ArrowLeft } from "lucide-react";

export function OrderHeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
      <div className="flex-1">
        <div className="h-9 bg-[#2a4d42] rounded w-64 mb-2" />
        <div className="h-5 bg-[#2a4d42] rounded w-48" />
      </div>
      <div className="flex gap-3">
        <div className="h-11 bg-[#2a4d42] rounded-xl w-28" />
      </div>
    </div>
  );
}

export function OrderFiltersSkeleton() {
  return <SkeletonFilters showSearch filterCount={4} />;
}

export function OrderTableSkeleton() {
  return (
    <SkeletonTable
      headers={["ORDER ID", "CUSTOMER", "AMOUNT", "CREATED AT", "STATUS", "ACTION"]}
      rows={7}
      columns={[
        { width: "w-24" },
        { width: "w-32" },
        { width: "w-16" },
        { width: "w-24" },
        { width: "w-20" },
        { width: "w-6" }
      ]}
    />
  );
}

export function OrderPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 p-5 rounded-2xl">
        <div className="p-2 bg-[#244c40]/50 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="h-8 bg-[#2a4d42] rounded-lg w-48" />
          <div className="h-4 bg-[#2a4d42] rounded w-64" />
        </div>

        <div className="h-10 w-32 bg-[#2a4d42] rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <SkeletonCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 bg-[#2a4d42] rounded w-42" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#18372e] border border-[#2a4d42]">
                  <div className="w-20 h-20 bg-[#244c40]/50 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-[#2a4d42] rounded w-3/4" />
                    <div className="h-4 bg-[#2a4d42] rounded w-24" />
                    <div className="h-4 bg-[#2a4d42] rounded w-32" />
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-[#2a4d42] rounded w-20 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Summary Card */}
          <SkeletonCard>
            <div className="h-6 bg-[#2a4d42] rounded w-40 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-[#2a4d42] rounded w-20" />
                <div className="h-4 bg-[#2a4d42] rounded w-16" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-[#2a4d42] rounded w-20" />
                <div className="h-4 bg-[#2a4d42] rounded w-12" />
              </div>
              <div className="pt-3 border-t border-[#2a4d42]">
                <div className="flex justify-between">
                  <div className="h-6 bg-[#2a4d42] rounded w-16" />
                  <div className="h-6 bg-[#2a4d42] rounded w-20" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SkeletonInfoCard rows={1} title="Order Status" />
          <SkeletonInfoCard rows={3} title="Customer Information" />
          <SkeletonInfoCard rows={3} title="Shipping Address" />
        </div>
      </div>
    </div>
  );
}