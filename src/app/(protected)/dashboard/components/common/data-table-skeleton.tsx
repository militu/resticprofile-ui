import { Skeleton } from "@/components/ui/skeleton";
import { DataTableStructure } from "./data-table-structure";

interface DataTableSkeletonProps {
  rows?: number;
  showIcon?: boolean;
  title?: string;
}

export function DataTableSkeleton({
  rows = 5,
  showIcon = true,
  title,
}: DataTableSkeletonProps) {
  return (
    <DataTableStructure title={title}>
      <div className="w-full border rounded-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showIcon && <Skeleton className="h-4 w-4 rounded-full" />}
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-4 w-6 rounded-full" />
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="mt-4 flex items-center space-x-4">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </DataTableStructure>
  );
}
