"use server";

import {
  RegisterFormValues,
  RegisterSchema,
} from "@/app/(auth)/components/schemas";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/lib/users";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function registerUser(
  values: RegisterFormValues,
  callbackUrl?: string
) {
  try {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      console.error("Validation error:", validatedFields.error);
      return { error: "Invalid fields. Please check your input." };
    }

    const { name, email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already exists. Please use a different email." };
    }

    const hashedPassword = await hashPassword(password);
    await prisma?.user.create({
      data: { name, email, password: hashedPassword },
    });

    const loginResponse = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (loginResponse?.error) {
      console.error(
        "Server-side: Registration successful, but login failed:",
        loginResponse.error
      );
      return {
        error:
          "Registration successful, but login failed. Please try logging in manually.",
      };
    }

    revalidatePath("/");
    return {
      success: "Registered and logged in successfully",
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    };
  } catch (err) {
    console.error("Detailed error in registerUser:", err);
    if (err instanceof AuthError) {
      return {
        error:
          "An authentication error occurred during registration. Please try again.",
      };
    }
    if (err instanceof Error) {
      return {
        error: `An unexpected error occurred during registration: ${err.message}`,
      };
    }
    return {
      error:
        "An unexpected error occurred during registration. Please try again.",
    };
  }
}
