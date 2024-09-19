"use server";

import { LoginFormValues, LoginSchema } from "@/app/(auth)/components/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function login(values: LoginFormValues, callbackUrl?: string) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (response?.error) {
      // Handle CredentialSignin error
      if (response.error === "CredentialsSignin") {
        return { error: "Invalid email or password. Please try again." };
      }

      // Generic error message for other cases
      return { error: "An error occurred during sign in. Please try again." };
    }
    revalidatePath("/");
    return {
      success: "Logged in successfully",
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    };
  } catch (err) {
    // Check if the error is an instance of AuthError
    if (err instanceof AuthError) {
      // Handle specific AuthError types if needed
      if (err.type === "CredentialsSignin") {
        return { error: "Invalid email or password. Please try again." };
      }
    }

    return {
      error: "An unexpected error occurred during login. Please try again.",
    };
  }
}
