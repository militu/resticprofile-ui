"use client";

import { refreshDataCommand } from "@/actions/refreshData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTransition } from "react";

export function RefreshButton() {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshDataCommand();
    });
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      className="flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    >
      <RefreshCw className={`h-5 w-5 ${isPending ? "animate-spin" : ""}`} />
      <span>{isPending ? "Refreshing data..." : "Refetch data"}</span>
    </Button>
  );
}
