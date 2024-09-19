"use server";

import { Snapshot } from "@/lib/parsers/parseSnapshotsOutput";
import { ResticprofileCommandExecutor } from "@/lib/resticprofileExecutor";
import { ActionResponse, ServerConfig } from "@/types";
import { handleActionError } from "@/types/errors";

export async function fetchSnapshots(
  serverConfig: ServerConfig,
  profileName: string
): Promise<ActionResponse<Snapshot[]>> {
  try {
    const resticExecutor = new ResticprofileCommandExecutor({ serverConfig });

    const result = await resticExecutor.fetchSnapshots(profileName);

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return handleActionError(err);
  }
}
