import { fetchSnapshotFiles } from "@/actions/fetchSnapshotFiles";
import { ServerConfig } from "@/types";
import AlertMessage from "../alert-message";
import SnapshotFilesDisplayClient from "./client";

interface SnapshotFilesProps {
  serverConfig: ServerConfig;
  profileName: string;
  snapshotId: string;
}

export default async function SnapshotFiles({
  serverConfig,
  profileName,
  snapshotId,
}: SnapshotFilesProps) {
  const snapshotFilesResponse = await fetchSnapshotFiles(
    serverConfig,
    profileName,
    snapshotId
  );

  if (!snapshotFilesResponse.success) {
    return (
      <AlertMessage
        message={snapshotFilesResponse.error || "Unexpected error"}
        type="error"
      />
    );
  }

  if (!snapshotFilesResponse.data || snapshotFilesResponse.data.length === 0) {
    return (
      <AlertMessage
        message="There are no snapshot files available for the selected snapshot."
        type="warning"
      />
    );
  }

  return (
    <SnapshotFilesDisplayClient
      files={snapshotFilesResponse.data}
      title={`Browsing files in snapshot "${snapshotId.substring(0, 8)}"`}
    />
  );
}
