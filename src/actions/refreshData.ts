"use server";
import { dashboardRoute } from "@/routes";
import { revalidatePath, revalidateTag } from "next/cache";
import { COMMAND_EXECUTION_TAG } from "../lib/sshExecutor";

export async function refreshDataCommand() {
  revalidateTag(COMMAND_EXECUTION_TAG);
  revalidatePath(dashboardRoute);
}
