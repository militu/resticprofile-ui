import { fetchSnapshots } from "@/actions/fetchSnapshots";
import { ServerConfig } from "@/types";
import { redirect } from "next/navigation";
import SnapshotsDisplayAlert from "./alert";
import { SnapshotsDisplayClient } from "./client";

interface SnapshotsDisplayProps {
  serverConfig: ServerConfig;
  profileName: string;
}

export default async function SnapshotsDisplay({
  serverConfig,
  profileName,
}: SnapshotsDisplayProps) {
  const snapshotsResponse = await fetchSnapshots(serverConfig, profileName);

  const handleRowClick = async (snapshotId: string) => {
    "use server";
    redirect(`/dashboard/${serverConfig.slug}/${profileName}/${snapshotId}`);
  };

  if (!snapshotsResponse.success) {
    return (
      <SnapshotsDisplayAlert
        message={snapshotsResponse.error || "Unexpected error"}
        type="error"
      />
    );
  }
  if (!snapshotsResponse.data) {
    return (
      <SnapshotsDisplayAlert
        message="No profile configuration available"
        type="warning"
      />
    );
  }
  return (
    <SnapshotsDisplayClient
      data={snapshotsResponse.data}
      onRowClick={handleRowClick}
    />
  );
}
