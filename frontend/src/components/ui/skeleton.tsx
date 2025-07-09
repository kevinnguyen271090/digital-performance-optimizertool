import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
        "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
        "animate-pulse-slow",
        className
      )}
      {...props}
    />
  )
}

// Modern Card Skeleton
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

// Modern Chart Skeleton
function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="mt-6 flex space-x-2">
        <Skeleton className="h-32 w-8 rounded-full" />
        <Skeleton className="h-24 w-8 rounded-full" />
        <Skeleton className="h-40 w-8 rounded-full" />
        <Skeleton className="h-28 w-8 rounded-full" />
        <Skeleton className="h-36 w-8 rounded-full" />
        <Skeleton className="h-20 w-8 rounded-full" />
        <Skeleton className="h-44 w-8 rounded-full" />
      </div>
    </div>
  )
}

// Modern Table Skeleton
function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Modern Dashboard Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      {/* Table */}
      <TableSkeleton />
    </div>
  )
}

export { Skeleton, CardSkeleton, ChartSkeleton, TableSkeleton, DashboardSkeleton } 