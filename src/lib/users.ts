"use server";

import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
}

export async function checkIsFirstUser(): Promise<boolean> {
  try {
    const userCount = await prisma.user.count();
    return userCount === null || userCount === 0;
  } catch (error) {
    console.error("Failed to check for users:", error);
    return true;
  }
}
