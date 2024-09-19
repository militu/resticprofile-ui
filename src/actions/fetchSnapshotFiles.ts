"use server";

import { SnapshotFile } from "@/lib/parsers/parseSnapshotFilesOutput";
import { ResticprofileCommandExecutor } from "@/lib/resticprofileExecutor";
import { ActionResponse, ServerConfig } from "@/types";
import { handleActionError } from "@/types/errors";

export async function fetchSnapshotFiles(
  serverConfig: ServerConfig,
  profileName: string,
  snapshotId: string
): Promise<ActionResponse<SnapshotFile[]>> {
  try {
    const resticExecutor = new ResticprofileCommandExecutor({ serverConfig });

    const result = await resticExecutor.fetchSnapshotFiles(
      profileName,
      snapshotId
    );

    return {
      success: true,
      data: result.slice(1),
    };
  } catch (err) {
    return handleActionError(err);
  }
}
