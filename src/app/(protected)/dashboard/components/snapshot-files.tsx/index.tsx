import { fetchSnapshotFiles } from "@/actions/fetchSnapshotFiles";
import { ServerConfig } from "@/types";
import { DataTableContainer } from "../table/data-table-container";
import { SnapshotFilesTable } from "./snapshot-files-table";

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
  const actionResponse = await fetchSnapshotFiles(
    serverConfig,
    profileName,
    snapshotId
  );

  return (
    <DataTableContainer
      title={`Snapshot files for ${profileName}`}
      isLoading={false}
      actionResponse={actionResponse}
      emptyMessage="There are no snapshot files available for the selected snapshot."
    >
      {(data) => <SnapshotFilesTable data={data} />}
    </DataTableContainer>
  );
}
