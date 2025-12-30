// proxy.ts
import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

function shouldRefreshSession(pathname: string) {
  // Only run the Supabase cookie/session refresh on routes that need auth state
  // Keeps public pages fast and prevents "auth page won't load" when Supabase is timing out.
  return (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth/onboarding") ||
    pathname.startsWith("/api") // keep if your API routes rely on cookies in dev
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!shouldRefreshSession(pathname)) {
    return NextResponse.next();
  }

  try {
    return await updateSession(request);
  } catch (err) {
    // CRITICAL: never crash the request pipeline due to upstream timeouts
    console.error("[proxy] updateSession failed:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Keep your original matcher (excludes static files/images/favicon)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
