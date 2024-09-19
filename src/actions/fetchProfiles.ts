"use server";

import { Profile } from "@/lib/parsers/parseProfilesOutput";
import { ResticprofileCommandExecutor } from "@/lib/resticprofileExecutor";
import { ActionResponse, ServerConfig } from "@/types";
import { handleActionError } from "@/types/errors";

export async function fetchProfiles(
  serverConfig: ServerConfig
): Promise<ActionResponse<Profile[]>> {
  try {
    const resticExecutor = new ResticprofileCommandExecutor({ serverConfig });
    const result = await resticExecutor.fetchProfiles();

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return handleActionError(err);
  }
}
