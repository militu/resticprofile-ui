import { Skeleton } from "@/components/ui/skeleton";
import { SidebarBase } from "./sidebar-base";

export function SidebarSkeleton() {
  return (
    <SidebarBase showCollapseButton={false}>
      <ul className="space-y-1 p-2">
        {[...Array(5)].map((_, index) => (
          <li key={index} className="flex items-center space-x-2 p-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </li>
        ))}
      </ul>
    </SidebarBase>
  );
}
