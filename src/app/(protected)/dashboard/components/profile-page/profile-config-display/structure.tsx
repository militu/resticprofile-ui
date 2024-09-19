import React from "react";

interface ProfileConfigDisplayStructureProps {
  children: React.ReactNode;
}

export default function ProfileConfigDisplayStructure({
  children,
}: ProfileConfigDisplayStructureProps) {
  return <div>{children}</div>;
}
