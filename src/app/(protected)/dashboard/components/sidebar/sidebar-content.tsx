"use client";

import { SidebarProps } from ".";
import { useSidebar } from "./sidebar-context";
import { SidebarItem } from "./sidebar-item";
import { SidebarWarning } from "./sidebar-warning";

export function SidebarContent({
  profiles,
  handleProfileSelect,
  selectedProfile,
}: SidebarProps) {
  const { isCollapsed } = useSidebar();

  if (profiles.length === 0) {
    return <SidebarWarning />;
  }
  return (
    <ul className={"space-y-1 p-2"}>
      {profiles.map((profile) => (
        <SidebarItem
          key={profile.name}
          profile={profile.name}
          onSelect={() => handleProfileSelect(profile.name)}
          isSelected={profile.name === selectedProfile}
        />
      ))}
    </ul>
  );
}
