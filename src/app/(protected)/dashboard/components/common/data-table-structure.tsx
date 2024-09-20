import React from "react";

interface DataTableStructureProps {
  children: React.ReactNode;
  title?: string;
}

export function DataTableStructure({
  children,
  title,
}: DataTableStructureProps) {
  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
