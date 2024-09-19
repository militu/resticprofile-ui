"use server";

import { ResticprofileCommandExecutor } from "@/lib/resticprofileExecutor";
import { ActionResponse, ServerConfig } from "@/types";
import { handleActionError } from "@/types/errors";

export async function checkSnapshotExits(
  serverConfig: ServerConfig,
  profileName: string,
  snapshotId: string
): Promise<ActionResponse<boolean>> {
  try {
    const resticExecutor = new ResticprofileCommandExecutor({ serverConfig });

    await resticExecutor.checkSnapshotExists(profileName, snapshotId);
    return { success: true, data: true };
  } catch (err) {
    return handleActionError(err);
  }
}
