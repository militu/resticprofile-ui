"use client";

import { Button } from "@/components/ui/button";
import { Snapshot } from "@/lib/parsers/parseSnapshotsOutput";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../common/data-table";
import { DataTableStructure } from "../../common/data-table-structure";

const columns: ColumnDef<Snapshot>[] = [
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "Time",
      defaultToggle: true,
    },
    cell: ({ row }) => (
      <div>{new Date(row.getValue("time")).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "short_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Short ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "Short ID",
      defaultToggle: true,
    },
    cell: ({ row }) => <div>{row.getValue("short_id")}</div>,
  },
  {
    accessorKey: "tree",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tree
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "Tree",
      defaultToggle: false,
    },
    cell: ({ row }) => <div>{row.getValue("tree")}</div>,
  },
  {
    accessorKey: "paths",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paths
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "Paths",
      defaultToggle: true,
    },
    cell: ({ row }) => (
      <div>{((row.getValue("paths") as string[]) ?? []).join(", ")}</div>
    ),
  },
  {
    accessorKey: "hostname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hostname
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "Hostname",
      defaultToggle: true,
    },
    cell: ({ row }) => <div>{row.getValue("hostname")}</div>,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "Username",
      defaultToggle: false,
    },
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "uid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "UID",
      defaultToggle: false,
    },
    cell: ({ row }) => <div>{row.getValue("uid")}</div>,
  },
  {
    accessorKey: "gid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          GID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "GID",
      defaultToggle: false,
    },
    cell: ({ row }) => <div>{row.getValue("gid")}</div>,
  },
  {
    accessorKey: "excludes",
    header: "Excludes",
    cell: ({ row }) => (
      <div title={((row.getValue("excludes") as string[]) ?? []).join(", ")}>
        {((row.getValue("excludes") as string[]) ?? []).join(", ")} items
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    meta: {
      defaultToggle: true,
    },
    cell: ({ row }) => (
      <div>{((row.getValue("tags") as string[]) ?? []).join(", ")}</div>
    ),
  },
  {
    accessorKey: "program_version",
    header: "Program Version",
    cell: ({ row }) => <div>{row.getValue("program_version")}</div>,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      label: "ID",
      defaultToggle: true,
    },
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
];

interface SnapshotsDisplayClientProps {
  title: string;
  data: Snapshot[];
  onRowClick: (id: string) => void;
}

export function SnapshotsDisplayClient({
  title,
  data,
  onRowClick,
}: SnapshotsDisplayClientProps) {
  return (
    <DataTableStructure title={title}>
      <DataTable
        columns={columns}
        data={data}
        onRowClick={(row) => onRowClick(row.id)}
        filterColumn="hostname"
      />
    </DataTableStructure>
  );
}
