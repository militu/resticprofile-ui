import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface SidebarBaseProps {
  children: React.ReactNode;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
  showCollapseButton?: boolean;
}

export function SidebarBase({
  children,
  isCollapsed,
  toggleCollapse,
  showCollapseButton = true,
}: SidebarBaseProps) {
  return (
    <div
      className={`bg-gradient-to-b from-primary/30 to-primary/50 text-foreground transition-all duration-300 ease-in-out 
        ${isCollapsed ? "w-16" : "w-64"} 
        flex flex-col min-h-screen rounded-r-2xl shadow-lg overflow-hidden`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border/50 bg-background/50 backdrop-blur-sm">
        {(!isCollapsed || !showCollapseButton) && (
          <h1 className="text-xl font-bold">Profiles</h1>
        )}
        {showCollapseButton && (
          <Button
            onClick={toggleCollapse}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20 transition-colors duration-200 ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </Button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <div
          className={`p-2 ${isCollapsed ? "flex flex-col items-center" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
