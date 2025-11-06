import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1️⃣ Forcer HTTPS en production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }

  // 2️⃣ Rediriger la racine vers /intro
  if (pathname === "/") {
    url.pathname = "/intro";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Protéger /quiz : exiger le cookie de consentement "mhq-consent=true"
  if (pathname.startsWith("/quiz")) {
    const consent = request.cookies.get("mhq-consent")?.value;
    if (consent !== "true") {
      url.pathname = "/intro";
      return NextResponse.redirect(url);
    }
  }

  // 4️⃣ Cache long pour les assets statiques
  if (pathname.startsWith("/_next/static") || pathname.startsWith("/images")) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return res;
  }

  // 5️⃣ Cookie bannière (consentement cookie technique)
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

// Appliquer à tout sauf API et assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
