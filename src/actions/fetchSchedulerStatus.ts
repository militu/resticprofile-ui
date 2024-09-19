"use server";

import {
  SchedulerStatus,
  SystemctlCommandExecutor,
} from "@/lib/systemctlExecutor";
import { ActionResponse, ServerConfig } from "@/types";
import { handleActionError } from "@/types/errors";

export async function fetchSchedulerStatus(
  serverConfig: ServerConfig,
  profileName: string,
  type: string
): Promise<ActionResponse<SchedulerStatus>> {
  try {
    const systemctlExecutor = new SystemctlCommandExecutor({ serverConfig });

    const result = await systemctlExecutor.fetchSchedulerStatus(
      profileName,
      type
    );

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return handleActionError(err);
  }
}
