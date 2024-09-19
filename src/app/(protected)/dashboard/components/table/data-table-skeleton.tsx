import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-10 w-[250px] mb-4" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  {Array(6)
                    .fill(0)
                    .map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
