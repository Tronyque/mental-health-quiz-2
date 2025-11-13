// proxy.ts (RACINE)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1) Forcer HTTPS en prod (évite en local)
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }

  // 2) Rediriger "/" vers "/intro"
  if (pathname === "/") {
    url.pathname = "/intro";
    return NextResponse.redirect(url);
  }

  // 3) Protéger /quiz : nécessite mhq-consent=true
  if (pathname.startsWith("/quiz")) {
    const consent = request.cookies.get("mhq-consent")?.value;
    if (consent !== "true") {
      url.pathname = "/intro";
      return NextResponse.redirect(url);
    }
  }

  // 4) Caching long pour assets statiques
  if (pathname.startsWith("/_next/static") || pathname.startsWith("/images")) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return res;
  }

  // 5) Cookie bannière (technique) — ne pas poser sur /privacy
  const res = NextResponse.next();
  const hasCookieBanner = request.cookies.get("cookie_consent");
  if (!hasCookieBanner && !pathname.startsWith("/privacy")) {
    res.cookies.set("cookie_consent", "pending", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      httpOnly: false,
      sameSite: "lax",
    });
  }

  return res;
}

// S'applique à tout sauf API & assets gérés
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
