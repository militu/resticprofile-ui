import { parseJsonOutput } from "./parseJsonOutput";

export interface Snapshot {
  time: string | null;
  tree: string | null;
  paths: string[] | null;
  hostname: string | null;
  username: string | null;
  uid: number | null;
  gid: number | null;
  excludes: string[] | null;
  tags: string[] | null;
  program_version: string | null;
  id: string;
  short_id: string | null;
}

export function parseSnapshotsOutput(result: string): Snapshot[] {
  const data = parseJsonOutput(result);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(
    (item: any): Snapshot => ({
      time: item.time != null ? String(item.time) : null,
      tree: item.tree != null ? String(item.tree) : null,
      paths: Array.isArray(item.paths) ? item.paths.map(String) : null,
      hostname: item.hostname != null ? String(item.hostname) : null,
      username: item.username != null ? String(item.username) : null,
      uid: item.uid != null ? Number(item.uid) : null,
      gid: item.gid != null ? Number(item.gid) : null,
      excludes: Array.isArray(item.excludes) ? item.excludes.map(String) : null,
      tags: Array.isArray(item.tags) ? item.tags.map(String) : null,
      program_version:
        item.program_version != null ? String(item.program_version) : null,
      id: String(item.id),
      short_id: item.short_id != null ? String(item.short_id) : null,
    })
  );
}
