import { Route } from "next";

export const loginRoute = "/login";
export const signUpRoute = "/signup";
export const settingsRoute = "/settings";
export const dashboardRoute = "/dashboard";

export const publicRoutes: Route[] = [];

export const authRoutes: Route[] = [loginRoute, signUpRoute];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = dashboardRoute;
