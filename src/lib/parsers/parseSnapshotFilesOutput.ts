import { parseJsonOutput } from "./parseJsonOutput";

export interface SnapshotFile {
  name: string | null;
  type: string | null;
  path: string | null;
  uid: number | null;
  gid: number | null;
  size: number | null;
  mode: number | null;
  permissions: string | null;
  mtime: string | null;
  atime: string | null;
  ctime: string | null;
  struct_type: string | null;
}

export function parseSnapshotFilesOutput(result: string): SnapshotFile[] {
  const data = parseJsonOutput(result);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.slice(1).map(
    (item: any): SnapshotFile => ({
      name: item.name != null ? String(item.name) : null,
      type: item.type != null ? String(item.type) : null,
      path: item.path != null ? String(item.path) : null,
      uid: item.uid != null ? Number(item.uid) : null,
      gid: item.gid != null ? Number(item.gid) : null,
      size: item.size != null ? Number(item.size) : null,
      mode: item.mode != null ? Number(item.mode) : null,
      permissions: item.permissions != null ? String(item.permissions) : null,
      mtime: item.mtime != null ? String(item.mtime) : null,
      atime: item.atime != null ? String(item.atime) : null,
      ctime: item.ctime != null ? String(item.ctime) : null,
      struct_type: item.struct_type != null ? String(item.struct_type) : null,
    })
  );
}
