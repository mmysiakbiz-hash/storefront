import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/brevo";
import { templates } from "@/lib/emails";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const key = new URL(req.url).searchParams.get("key");
  if (secret && auth !== `Bearer ${secret}` && key !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ skipped: "no db" });

  const admin = createAdminClient();
  const now = Date.now();
  let sent = 0;

  async function run(kind: "24h" | "2h", loMs: number, hiMs: number) {
    const col = kind === "24h" ? "reminded_24h" : "reminded_2h";
    const { data } = await admin.from("booking_times")
      .select("id, guest_email, guest_name, service_name, studio_name, starts_at")
      .eq("status", "confirmed").eq(col, false)
      .gte("starts_at", new Date(now + loMs).toISOString())
      .lte("starts_at", new Date(now + hiMs).toISOString());
    for (const b of (data as any[]) || []) {
      if (b.guest_email) {
        try {
          const when = new Date(b.starts_at).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Indian/Mahe" });
          const t = templates.reminder({ guest: b.guest_name || "there", studio: b.studio_name, service: b.service_name, when, kind });
          await sendEmail({ to: [{ email: b.guest_email, name: b.guest_name || "" }], subject: t.subject, html: t.html });
        } catch { /* keep going */ }
      }
      await admin.from("bookings").update({ [col]: true }).eq("id", b.id);
      sent++;
    }
  }

  await run("24h", 23 * 3600e3, 25 * 3600e3);
  await run("2h", 1 * 3600e3, 3 * 3600e3);
  return NextResponse.json({ ok: true, sent });
}
