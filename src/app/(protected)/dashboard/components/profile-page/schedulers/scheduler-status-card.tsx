import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SchedulerError } from "@/lib/parsers/parseSchedulerErrorOutput";
import { SchedulerStatus } from "@/lib/systemctlExecutor";
import { timestampToDate } from "@/lib/time";
import { ActionResponse } from "@/types";
import { AlertCircle } from "lucide-react";
import React from "react";

interface SchedulerStatusCardProps {
  actionResponse: ActionResponse<SchedulerStatus>;
  title: string;
}

const SchedulerStatusCard: React.FC<SchedulerStatusCardProps> = ({
  actionResponse,
  title,
}) => {
  if (!actionResponse.success || !actionResponse.data) {
    return null;
  }

  const { data } = actionResponse;
  const hasErrors = data.errors && data.errors.length > 0;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {title} scheduler
          {hasErrors && (
            <Badge variant="destructive" className="ml-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {data.errors.length} Error{data.errors.length > 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell>
                <Badge
                  variant={
                    data.units?.active === "active" ? "default" : "destructive"
                  }
                >
                  {data.units?.load}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Last Run</TableCell>
              <TableCell>
                {data.timers?.last ? timestampToDate(data.timers.last) : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Next Run</TableCell>
              <TableCell>
                {data.timers?.last ? timestampToDate(data.timers.next) : "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-4">
          <h4 className="font-semibold mb-2 flex items-center">
            Error Logs
            {hasErrors && (
              <Badge variant="destructive" className="ml-2">
                {data.errors.length} Error{data.errors.length > 1 ? "s" : ""}
              </Badge>
            )}
          </h4>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {hasErrors ? (
              data.errors.map((error: SchedulerError, index: number) => (
                <div key={index} className="mb-4 p-3 rounded-md">
                  <strong className="text-red-700">Date:</strong>{" "}
                  {timestampToDate(error.timestamp)}
                  <br />
                  <strong className="text-red-700">Unit:</strong>{" "}
                  {error.unit || "N/A"}
                  <br />
                  <strong className="text-red-700">Message:</strong>{" "}
                  {error.message || "N/A"}
                </div>
              ))
            ) : (
              <p className="text-green-600">No errors</p>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulerStatusCard;
