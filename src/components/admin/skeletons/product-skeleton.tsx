// Refactored Product Skeletons
import { 
  SkeletonStatCards,
  SkeletonTable,
  SkeletonPageLayout,
  SkeletonProductTableRow,
  SkeletonCard,
  Skeleton,
  SkeletonText,
  SkeletonFormField
} from '@/components/ui/skeleton-components';

/**
 * Inventory Stats Skeleton
 * Replaces: inventory-stats-skeleton.tsx
 */
export function InventoryStatsSkeleton() {
  return <SkeletonStatCards count={4} />;
}

/**
 * Product Table Skeleton
 * Replaces: product-table-skeleton.tsx
 */
export function ProductTableSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      {/* Filter Skeleton */}
      <div className="lg:col-span-1">
        <SkeletonCard className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-[#2a4d42] rounded w-16" />
            <div className="h-4 bg-[#2a4d42] rounded w-12" />
          </div>
          
          <SkeletonFormField inputHeight="h-10" />
          
          <div className="space-y-2">
            <div className="h-3 bg-[#2a4d42] rounded w-16" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 bg-[#2a4d42] rounded w-16" />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-3 bg-[#2a4d42] rounded w-20" />
            <div className="h-6 bg-[#2a4d42] rounded" />
          </div>
        </SkeletonCard>
      </div>

      {/* Table Skeleton */}
      <div className="lg:col-span-4">
        <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] overflow-hidden animate-pulse">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#2a4d42] border-b border-[#2a4d42]">
                <tr>
                  {["PRODUCT", "CATEGORY", "PRICE", "STOCK", "STATUS", "ACTIONS"].map((header) => (
                    <th key={header} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a4d42]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonProductTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Product Detail Skeleton
 * Replaces: product-skeleton.tsx
 */
export function ProductSkeleton() {
  return (
    <SkeletonPageLayout
      showHeader
      headerWithButton
      showBreadcrumb={false}
      sidebarCards={3}
      mainCards={1}
      showTable
      showImage
      formFields={4}
    />
  );
}