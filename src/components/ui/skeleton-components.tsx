import clsx from "clsx";

// ============================================================================
// BASE SKELETON COMPONENTS
// ============================================================================

type SkeletonProps = {
  className?: string;
};

/**
 * Base skeleton component with pulse animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-[#2a4d42]",
        className
      )}
    />
  );
}

/**
 * Skeleton for text lines
 */
export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={clsx("h-4 w-full", className)} />;
}

/**
 * Skeleton for card containers
 */
export function SkeletonCard({ className, children }: React.PropsWithChildren<SkeletonProps>) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-[#2a4d42] bg-[#1a3d32] p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// COMPOSITE SKELETON COMPONENTS
// ============================================================================

/**
 * Skeleton for page headers with breadcrumb and title
 */
export function SkeletonPageHeader({ 
  showBreadcrumb = true,
  showButton = false 
}: { 
  showBreadcrumb?: boolean;
  showButton?: boolean;
}) {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1">
          {showBreadcrumb && <SkeletonText className="w-48 mb-2" />}
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
      {showButton && <Skeleton className="w-32 h-12 rounded-xl" />}
    </div>
  );
}

/**
 * Skeleton for stat cards (metrics/KPIs)
 */
export function SkeletonStatCard() {
  return (
    <div className="bg-[#1a3d32] rounded-2xl p-6 border border-[#2a4d42] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#2a4d42]" />
        <div className="h-4 w-14 rounded bg-[#2a4d42]" />
      </div>
      <div className="h-4 w-24 bg-[#2a4d42] rounded mb-2" />
      <div className="h-8 w-32 bg-[#2a4d42] rounded" />
    </div>
  );
}

/**
 * Grid of stat cards
 */
export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonStatCard key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function SkeletonTableRow({ 
  columns 
}: { 
  columns: { width: string }[] 
}) {
  return (
    <tr className="border-b border-[#2a4d42]">
      {columns.map((col, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className={clsx("h-4", col.width)} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Complete table skeleton with header
 */
export function SkeletonTable({ 
  headers,
  rows = 5,
  columns
}: { 
  headers: string[];
  rows?: number;
  columns: { width: string }[];
}) {
  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0d2820] border-b border-[#2a4d42]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-xs font-bold text-gray-400 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a4d42]">
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonTableRow key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Skeleton for product/item in a table with image
 */
export function SkeletonProductTableRow() {
  return (
    <tr className="border-b border-[#2a4d42] last:border-0">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2a4d42] rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[#2a4d42] rounded" />
            <div className="h-3 w-24 bg-[#2a4d42] rounded" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-[#2a4d42] rounded w-20" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-[#2a4d42] rounded w-16" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-[#2a4d42] rounded w-12" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-[#2a4d42] rounded w-20" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <div className="w-9 h-9 bg-[#2a4d42] rounded-lg" />
          <div className="w-9 h-9 bg-[#2a4d42] rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

/**
 * Skeleton for a form field
 */
export function SkeletonFormField({ 
  hasLabel = true,
  inputHeight = "h-10" 
}: { 
  hasLabel?: boolean;
  inputHeight?: string;
}) {
  return (
    <div className="space-y-2">
      {hasLabel && <SkeletonText className="w-20" />}
      <Skeleton className={clsx("w-full", inputHeight)} />
    </div>
  );
}

/**
 * Skeleton for a chart/graph area
 */
export function SkeletonChart({ 
  height = "h-[300px]",
  title,
  showControls = false
}: { 
  height?: string;
  title?: string;
  showControls?: boolean;
}) {
  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-6 animate-pulse lg:col-span-2">
      {(title || showControls) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <div className="space-y-2">
              <div className="h-5 w-40 bg-[#2a4d42] rounded" />
              <div className="h-4 w-56 bg-[#2a4d42] rounded" />
            </div>
          )}
          {showControls && <div className="h-9 w-24 bg-[#2a4d42] rounded-lg" />}
        </div>
      )}
      <div className={clsx(height, "w-full bg-[#2a4d42] rounded-xl relative overflow-hidden")}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a list item with icon and text
 */
export function SkeletonListItem({ 
  hasIcon = true,
  hasSecondaryText = false 
}: { 
  hasIcon?: boolean;
  hasSecondaryText?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      {hasIcon && <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        {hasSecondaryText && <Skeleton className="h-3 w-1/2" />}
      </div>
    </div>
  );
}

/**
 * Skeleton for filter/search bar
 */
export function SkeletonFilters({ 
  showSearch = true,
  filterCount = 4 
}: { 
  showSearch?: boolean;
  filterCount?: number;
}) {
  return (
    <div className="bg-[#1a3d32] rounded-2xl border border-[#2a4d42] p-5 animate-pulse">
      {showSearch && (
        <div className="relative w-full max-w-2xl mb-6">
          <div className="h-12 bg-[#2a4d42] border border-[#2a4d42] rounded-xl" />
        </div>
      )}
      <div className="flex flex-wrap gap-2 border-b border-[#2a4d42] pb-5">
        {Array.from({ length: filterCount }).map((_, i) => (
          <div key={i} className="h-9 bg-[#2a4d42]/50 rounded-lg w-32" />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for sidebar info cards
 */
export function SkeletonInfoCard({ 
  rows = 3,
  title 
}: { 
  rows?: number;
  title?: string;
}) {
  return (
    <SkeletonCard>
      {title && <div className="h-6 bg-[#2a4d42] rounded w-32 mb-4" />}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-[#2a4d42] rounded w-16" />
              <div className="h-5 bg-[#2a4d42] rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

// ============================================================================
// PAGE-LEVEL SKELETON LAYOUTS
// ============================================================================

/**
 * Generic page skeleton with customizable layout
 */
export function SkeletonPageLayout({
  showHeader = true,
  headerWithButton = false,
  showBreadcrumb = true,
  sidebarCards = 3,
  mainCards = 2,
  showTable = true,
  showImage = false,
  formFields = 4,
}: {
  showHeader?: boolean;
  headerWithButton?: boolean;
  showBreadcrumb?: boolean;
  sidebarCards?: number;
  mainCards?: number;
  showTable?: boolean;
  showImage?: boolean;
  formFields?: number;
}) {
  return (
    <div className="space-y-6 animate-pulse">
      {showHeader && (
        <SkeletonPageHeader 
          showBreadcrumb={showBreadcrumb}
          showButton={headerWithButton}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Cards */}
          {Array.from({ length: mainCards }).map((_, i) => (
            <SkeletonCard key={i}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {showImage && i === 0 && (
                  <Skeleton className="aspect-square rounded-lg bg-[#0f2920]" />
                )}
                <div className="space-y-6">
                  {Array.from({ length: formFields }).map((_, j) => (
                    <SkeletonFormField key={j} />
                  ))}
                </div>
              </div>
            </SkeletonCard>
          ))}

          {/* Table */}
          {showTable && <SkeletonCard className="h-64" />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {Array.from({ length: sidebarCards }).map((_, i) => (
            <SkeletonCard key={i} className="h-60" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Management Page Skeleton
 */
export function SpecificSkeletonPageLayout({
  showHeader = true,
  showButton = true,
  statsCards = 3,
  tableRows = 6,
  showTable = true,
}: {
  showHeader?: boolean;
  showButton?: boolean;
  statsCards?: number;
  tableRows?: number;
  showTable?: boolean;
}) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ===== Header ===== */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-40 bg-[#0f2920]" />
            <Skeleton className="h-8 w-72 bg-[#0f2920]" />
            <Skeleton className="h-4 w-64 bg-[#0f2920]" />
          </div>

          {showButton && (
            <Skeleton className="h-12 w-40 rounded-xl bg-[#0f2920]" />
          )}
        </div>
      )}

      {/* ===== Stats Section ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: statsCards }).map((_, i) => (
          <div
            key={i}
            className="bg-[#1a3d32] p-6 rounded-xl border border-[#2a4d42]"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-lg bg-[#0f2920]" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 bg-[#0f2920]" />
                <Skeleton className="h-7 w-20 bg-[#0f2920]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Table ===== */}
      {showTable && (
        <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f2920]">
                <tr>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="py-4 px-6">
                      <Skeleton className="h-4 w-24 bg-[#1a3d32]" />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: tableRows }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#2a4d42]"
                  >
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-4 px-6">
                        <Skeleton className="h-4 w-full bg-[#0f2920]" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Dashboard-specific skeleton layout
 */
export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="h-9 w-32 bg-[#2a4d42] rounded animate-pulse" />
      
      <SkeletonStatCards count={4} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonChart showControls title="Sales Overview" />
        </div>
        <SkeletonCard>
          <div className="h-6 w-48 bg-[#2a4d42] rounded mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2a4d42]" />
                  <div className="h-4 w-24 bg-[#2a4d42] rounded" />
                </div>
                <div className="h-4 w-16 bg-[#2a4d42] rounded" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
      
      <SkeletonTable 
        headers={["PRODUCT", "CATEGORY", "PRICE", "SOLD", "STATUS"]}
        rows={5}
        columns={[
          { width: "w-48" },
          { width: "w-24" },
          { width: "w-16" },
          { width: "w-10" },
          { width: "w-16" }
        ]}
      />
    </div>
  );
}



/**
 * Table page skeleton (for products, orders, users lists)
 */
export function SkeletonTablePage({
  showStats: _showStats = false,
  showFilters = true,
  statsCount: _statsCount = 4,
  filterCount = 4,
  tableHeaders,
  tableColumns,
  tableRows = 7
}: {
  showStats?: boolean;
  showFilters?: boolean;
  statsCount?: number;
  filterCount?: number;
  tableHeaders: string[];
  tableColumns: { width: string }[];
  tableRows?: number;
}) {
  return (
    <div className="space-y-6">
      {showFilters && <SkeletonFilters filterCount={filterCount} />}
      
      <SkeletonTable 
        headers={tableHeaders}
        rows={tableRows}
        columns={tableColumns}
      />
    </div>
  );
}