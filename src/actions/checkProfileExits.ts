"use server";

import { ResticprofileCommandExecutor } from "@/lib/resticprofileExecutor";
import { ActionResponse, ServerConfig } from "@/types";
import { handleActionError } from "@/types/errors";

export async function checkProfileExists(
  serverConfig: ServerConfig,
  profileName: string
): Promise<ActionResponse<boolean>> {
  try {
    const resticExecutor = new ResticprofileCommandExecutor({ serverConfig });

    await resticExecutor.checkProfileExists(profileName);
    return { success: true, data: true };
  } catch (err) {
    return handleActionError(err);
  }
}
