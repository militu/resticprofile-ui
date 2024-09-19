import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // Check if this is a server action request
  if (req.headers.get("next-action")) {
    // For server actions, don't modify headers
    return NextResponse.next();
  }

  // For non-server-action requests, add your custom header
  const headers = new Headers(req.headers);
  headers.set("x-current-path", req.nextUrl.pathname);
  return NextResponse.next({ headers });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
