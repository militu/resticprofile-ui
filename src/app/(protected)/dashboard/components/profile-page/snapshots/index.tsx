import { fetchSnapshots } from "@/actions/fetchSnapshots";
import { ServerConfig } from "@/types";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DataTableAlert from "../../common/data-table-alert";
import { DataTableSkeleton } from "../../common/data-table-skeleton";
import { SnapshotsDisplayClient } from "./client";

interface SnapshotsDisplayProps {
  serverConfig: ServerConfig;
  profileName: string;
}

export default function SnapshotsDisplay({
  serverConfig,
  profileName,
}: SnapshotsDisplayProps) {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <SnapshotsDisplayContent
        serverConfig={serverConfig}
        profileName={profileName}
      />
    </Suspense>
  );
}

async function SnapshotsDisplayContent({
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
      <DataTableAlert
        message={snapshotsResponse.error || "Unexpected error"}
        type="error"
      />
    );
  }
  if (!snapshotsResponse.data) {
    return (
      <DataTableAlert
        message="No profile configuration available"
        type="warning"
      />
    );
  }
  return (
    <SnapshotsDisplayClient
      title={`Browsing snapshots in profile "${profileName}"`}
      data={snapshotsResponse.data}
      onRowClick={handleRowClick}
    />
  );
}
