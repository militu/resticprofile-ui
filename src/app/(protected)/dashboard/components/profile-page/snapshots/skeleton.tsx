import { Skeleton } from "@/components/ui/skeleton";
import { FileJson } from "lucide-react";
import SnapshotsDisplayStructure from "./structure";

export function SnapshotsDisplaySkeleton() {
  return (
    <SnapshotsDisplayStructure>
      <div className="w-full border rounded-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileJson className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-4 w-6 rounded-full" />
        </div>
      </div>
    </SnapshotsDisplayStructure>
  );
}
