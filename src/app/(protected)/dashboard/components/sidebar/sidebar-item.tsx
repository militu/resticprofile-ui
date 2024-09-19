"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FolderOpen } from "lucide-react";
import { useSidebar } from "./sidebar-context";

interface SidebarItemProps {
  profile: string;
  onSelect: () => void;
  isSelected: boolean;
}

export function SidebarItem({
  profile,
  onSelect,
  isSelected,
}: SidebarItemProps) {
  const { isCollapsed } = useSidebar();

  const content = isCollapsed ? (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
        isSelected ? "bg-muted text-primary-foreground" : ""
      }`}
    >
      {profile.charAt(0).toUpperCase()}
    </div>
  ) : (
    <>
      <FolderOpen size={20} className="mr-3" />
      <div className="text-sm">{profile}</div>
    </>
  );

  const button = (
    <Button
      onClick={onSelect}
      variant="ghost"
      className={`w-full justify-start p-2 text-foreground/50 hover:text-foreground ${
        isCollapsed ? "h-10 w-10" : ""
      } ${isSelected ? "bg-muted text-foreground" : ""}`}
    >
      {content}
    </Button>
  );

  return (
    <li className="p-1">
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{profile}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}
    </li>
  );
}
