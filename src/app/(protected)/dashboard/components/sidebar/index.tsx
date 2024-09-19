"use client";

import { Profile } from "@/lib/parsers/parseProfilesOutput";
import { SidebarBase } from "./sidebar-base";
import { SidebarContent } from "./sidebar-content";
import { SidebarProvider, useSidebar } from "./sidebar-context";

export interface SidebarProps {
  profiles: Profile[];
  handleProfileSelect: (profileName: string) => void;
  selectedProfile?: string;
}
function SidebarWithContext(props: SidebarProps) {
  const { isCollapsed, toggleCollapse } = useSidebar();
  return (
    <SidebarBase
      isCollapsed={isCollapsed}
      toggleCollapse={toggleCollapse}
      showCollapseButton={true}
    >
      <SidebarContent {...props} />
    </SidebarBase>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <SidebarProvider>
      <SidebarWithContext {...props} />
    </SidebarProvider>
  );
}
