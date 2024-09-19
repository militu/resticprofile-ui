"use server";

import { signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function logout() {
  try {
    await signOut({ redirect: false });
    revalidatePath("/");

    return { success: "Logged out successfully" };
  } catch (err: unknown) {
    if (err instanceof AuthError) {
      return {
        error: "An unexpected authentication error occurred during logout.",
      };
    }
    return {
      error: "An unexpected error occurred during logout. Please try again.",
    };
  }
}
