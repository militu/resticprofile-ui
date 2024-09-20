"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SnapshotFile } from "@/lib/parsers/parseSnapshotFilesOutput";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, File, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "../common/data-table";
import { DataTableStructure } from "../common/data-table-structure";

interface SnapshotFilesDisplayClientProps {
  title?: string;
  files: SnapshotFile[];
}

export default function SnapshotFilesDisplayClient({
  title,
  files,
}: SnapshotFilesDisplayClientProps) {
  const [currentPath, setCurrentPath] = useState("/");

  const columns: ColumnDef<SnapshotFile>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        meta: {
          label: "Name",
        },
        cell: ({ row }) => (
          <div className="flex items-center">
            {row.original.type === "dir" ? (
              <Folder className="mr-2 h-4 w-4" />
            ) : (
              <File className="mr-2 h-4 w-4" />
            )}
            {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        enableSorting: false,
      },
      {
        accessorKey: "size",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Size
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        meta: {
          label: "Size",
        },
        cell: ({ row }) => <div>{formatBytes(row.original.size || 0)}</div>,
      },
      {
        accessorKey: "mtime",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Modified time
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        meta: {
          label: "Modified time",
        },
        cell: ({ row }) => new Date(row.original.mtime || "").toLocaleString(),
      },
    ],
    []
  );

  const currentFiles = useMemo(() => {
    return files.filter((file) => {
      const filePath = file.path?.split("/").slice(0, -1).join("/") || "/";
      return filePath === currentPath;
    });
  }, [files, currentPath]);

  const navigateUp = () => {
    const parentPath = currentPath.split("/").slice(0, -1).join("/") || "/";
    setCurrentPath(parentPath);
  };

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };

  return (
    <DataTableStructure title={title}>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Button onClick={navigateUp} disabled={currentPath === "/"}>
            <ChevronUp className="mr-2 h-4 w-4" />
            Up
          </Button>
          <Input
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            className="ml-4 flex-grow"
          />
        </div>
        <DataTable
          columns={columns}
          data={currentFiles}
          onRowClick={(row) => {
            if (row.type === "dir") {
              navigateToFolder(row.path || "/");
            }
          }}
          filterColumn="name"
          isRowClickable={(row) => row.type === "dir"}
        />
      </div>
    </DataTableStructure>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "--";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
