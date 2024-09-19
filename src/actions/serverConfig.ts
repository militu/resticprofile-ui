"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dashboardRoute } from "@/routes";
import { ActionResponse, ServerConfig } from "@/types";
import {
  AuthError,
  DuplicateSlugError,
  ResourceNotFoundError,
  handleActionError,
} from "@/types/errors";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new AuthError("User not authenticated");
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new AuthError("User not found");
  }
  return user.id;
}

export async function getServerConfigs(): Promise<
  ActionResponse<Omit<ServerConfig, "userId">[]>
> {
  try {
    const userId = await getUserId();
    const configs = await prisma.serverConfig.findMany({
      where: { userId: userId },
      select: {
        id: true,
        name: true,
        slug: true,
        workDir: true,
        host: true,
        port: true,
        username: true,
        privateKeyPath: true,
      },
    });
    return { success: true, data: configs };
  } catch (error) {
    console.error("Error fetching server configs:", error);
    return handleActionError(error);
  }
}

export async function getServerConfigBySlug(
  configSlug: string
): Promise<ActionResponse<Omit<ServerConfig, "userId">>> {
  try {
    const userId = await getUserId();
    const config = await prisma.serverConfig.findFirst({
      where: {
        userId: userId,
        slug: configSlug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        workDir: true,
        host: true,
        port: true,
        username: true,
        privateKeyPath: true,
      },
    });

    if (!config) {
      throw new ResourceNotFoundError("ServerConfig", configSlug);
    }

    return { success: true, data: config };
  } catch (error) {
    console.error(`Error fetching server config '${configSlug}':`, error);
    return handleActionError(error);
  }
}

export async function addServerConfig(
  data: Omit<ServerConfig, "id" | "userId" | "slug">
): Promise<ActionResponse<ServerConfig>> {
  try {
    const userId = await getUserId();
    const slug = generateSlug(data.name);

    // Check if a config with the same slug already exists
    const existingConfig = await prisma.serverConfig.findFirst({
      where: { userId, slug },
    });

    if (existingConfig) {
      throw new DuplicateSlugError(
        `A config with the name '${data.name}' already exists.`
      );
    }

    const result = await prisma.serverConfig.create({
      data: {
        ...data,
        userId: userId,
        slug,
      },
    });
    revalidatePath(dashboardRoute);
    return { success: true, data: result };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return handleActionError(
        new DuplicateSlugError(
          `A config with the name '${data.name}' already exists.`
        )
      );
    }
    console.error("Error adding server config:", error);
    return handleActionError(error);
  }
}

export async function updateServerConfig(
  id: string,
  data: Omit<ServerConfig, "id" | "userId" | "slug">
): Promise<ActionResponse<ServerConfig>> {
  try {
    const userId = await getUserId();
    const slug = generateSlug(data.name);

    // Check if another config with the same slug already exists
    const existingConfig = await prisma.serverConfig.findFirst({
      where: {
        userId,
        slug,
        NOT: { id },
      },
    });

    if (existingConfig) {
      throw new DuplicateSlugError(
        `A config with the name '${data.name}' already exists.`
      );
    }

    const result = await prisma.serverConfig.update({
      where: { id, userId },
      data: {
        ...data,
        userId,
        slug,
      },
    });
    revalidatePath(dashboardRoute);
    return { success: true, data: result };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return handleActionError(
        new DuplicateSlugError(
          `A config with the name '${data.name}' already exists.`
        )
      );
    }
    console.error("Error updating server config:", error);
    return handleActionError(error);
  }
}

export async function deleteServerConfig(
  id: string
): Promise<ActionResponse<void>> {
  try {
    const userId = await getUserId();
    await prisma.serverConfig.delete({
      where: { id, userId },
    });
    revalidatePath(dashboardRoute);
    return { success: true };
  } catch (error) {
    console.error("Error deleting server config:", error);
    return handleActionError(error);
  }
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};
