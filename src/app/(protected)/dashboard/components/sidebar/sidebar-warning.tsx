"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export function SidebarWarning() {
  const { isCollapsed } = useSidebar();

  const content = (
    <>
      <AlertCircle className="text-warning" size={isCollapsed ? 24 : 20} />
      {!isCollapsed && (
        <span className="text-sm font-medium">No profiles available</span>
      )}
    </>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-center p-2">{content}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>No profiles available</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center space-x-2 p-4 bg-warning/20 rounded-md">
      {content}
    </div>
  );
}
