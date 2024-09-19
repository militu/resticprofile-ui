import React from "react";

interface SnapshotsDisplayStructureProps {
  children: React.ReactNode;
}

export default function SnapshotsDisplayStructure({
  children,
}: SnapshotsDisplayStructureProps) {
  return <div>{children}</div>;
}
