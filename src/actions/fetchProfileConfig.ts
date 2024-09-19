"use server";

import { ProfileConfig } from "@/lib/parsers/parseProfileConfigOutput";
import { ResticprofileCommandExecutor } from "@/lib/resticprofileExecutor";
import { ActionResponse, ServerConfig } from "@/types";
import { handleActionError } from "@/types/errors";

export async function fetchProfileConfig(
  serverConfig: ServerConfig,
  profileName: string
): Promise<ActionResponse<ProfileConfig>> {
  try {
    const resticExecutor = new ResticprofileCommandExecutor({ serverConfig });

    const result = await resticExecutor.fetchProfileConfig(profileName);

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return handleActionError(err);
  }
}
