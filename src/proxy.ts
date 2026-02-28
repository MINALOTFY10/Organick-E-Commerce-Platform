import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Use Node.js runtime so we can call auth.api.getSession() directly,
// eliminating the HTTP loopback round trip that the Edge runtime requires.
export const runtime = "nodejs";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRouteNeedsAuthentication =
    pathname.startsWith("/admin") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/");

  if (!protectedRouteNeedsAuthentication) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  } catch {
    // Auth lookup failed (e.g. DB unavailable during cold start).
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// // Run middleware only on routes that actually need auth.
// // This avoids a session lookup on every public page, API route, and asset.
// export const config = {
//   matcher: ["/admin/:path*", "/checkout", "/checkout/:path*", "/profile", "/profile/:path*", "/account", "/account/:path*"],
// };
