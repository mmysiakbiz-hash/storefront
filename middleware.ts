import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "book.sey.la";
// subdomeny, które NIE są studiami:
const RESERVED = new Set(["www", "book", "app", "api", "admin", "mail"]);

export async function middleware(req: NextRequest) {
  const hostname = (req.headers.get("host") || "").split(":")[0];

  // {slug}.book.sey.la  →  /studio/{slug}
  if (hostname.endsWith("." + ROOT)) {
    const sub = hostname.slice(0, -(("." + ROOT).length));
    if (sub && !sub.includes(".") && !RESERVED.has(sub)) {
      const url = req.nextUrl.clone();
      if (!url.pathname.startsWith("/studio/")) {
        url.pathname = `/studio/${sub}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Jeśli env Supabase jeszcze nie ustawiony (np. pierwszy deploy) — nie wywalaj się.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  return await updateSession(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
