import { getUserByEmail } from "@/lib/users";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./app/(auth)/components/schemas";
import {
  apiAuthPrefix,
  authRoutes,
  dashboardRoute,
  loginRoute,
  publicRoutes,
} from "./routes";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user;

      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);
      const isRootRoute = nextUrl.pathname === "/";
      const loginUrl = new URL(loginRoute, nextUrl.origin);
      const dashboardUrl = new URL(dashboardRoute, nextUrl.origin);

      if (isApiAuthRoute) {
        return true;
      }

      if (isRootRoute) {
        if (isAuthenticated) {
          return Response.redirect(dashboardUrl);
        } else {
          return Response.redirect(loginUrl);
        }
      }

      if (isAuthRoute) {
        if (isAuthenticated) {
          return Response.redirect(dashboardUrl);
        }
        return true;
      }

      if (!isAuthenticated && !isPublicRoute) {
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          // Use bcrypt to compare the provided password with the stored hash
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            return user;
          } else {
            return null;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
