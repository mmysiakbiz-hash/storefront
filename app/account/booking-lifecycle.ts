"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const TZ = "+04:00", DEF_OPEN = 9 * 60, DEF_CLOSE = 18 * 60, STEP = 30;
const iso = (dateStr: string, m: number) => `${dateStr}T${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:00${TZ}`;

async function mine(bookingId: string) {
  const s = createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user?.email) throw new Error("Please sign in.");
  const admin = createAdminClient();
  const { data } = await admin.from("bookings").select("id, guest_email, staff_id, service_id").eq("id", bookingId).maybeSingle();
  if (!data || String((data as any).guest_email || "").toLowerCase() !== user.email.toLowerCase()) throw new Error("That isn't your booking.");
  return { admin, b: data as any };
}

export async function cancelBooking(bookingId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { admin } = await mine(bookingId);
    const { data: bt } = await admin.from("booking_times").select("starts_at").eq("id", bookingId).maybeSingle();
    const start = bt ? new Date((bt as any).starts_at).getTime() : 0;
    if (start && start - Date.now() < 12 * 3600 * 1000) return { ok: false, error: "Within 12h of the visit — please contact the studio directly." };
    await admin.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
    revalidatePath("/account");
    return { ok: true };
  } catch (e: any) { return { ok: false, error: e?.message || "Couldn't cancel." }; }
}

export async function getAvailabilityFor(studioId: string, staffId: string, dateStr: string, durationMin: number): Promise<string[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("booking_times").select("starts_at, ends_at, status").eq("studio_id", studioId).eq("staff_id", staffId).neq("status", "cancelled").gte("starts_at", `${dateStr}T00:00:00${TZ}`).lte("starts_at", `${dateStr}T23:59:59${TZ}`);
    const busy = ((data as any[]) || []).map((b) => ({ s: new Date(b.starts_at).getTime(), e: new Date(b.ends_at).getTime() }));
    const { data: hoursRows } = await admin.from("business_hours").select("day_of_week, open_min, close_min").eq("studio_id", studioId);
    const hours = (hoursRows as any[]) || [];
    let OPEN = DEF_OPEN, CLOSE = DEF_CLOSE;
    if (hours.length) { const dow = new Date(`${dateStr}T12:00:00${TZ}`).getDay(); const h = hours.find((x) => x.day_of_week === dow); if (!h) return []; OPEN = h.open_min; CLOSE = h.close_min; }
    const now = Date.now(); const out: string[] = [];
    for (let m = OPEN; m + durationMin <= CLOSE; m += STEP) { const st = new Date(iso(dateStr, m)).getTime(); const en = st + durationMin * 60000; if (st < now) continue; if (!busy.some((b) => st < b.e && en > b.s)) out.push(iso(dateStr, m).slice(11, 16)); }
    return out;
  } catch { return []; }
}

export async function rescheduleBooking(bookingId: string, dateStr: string, time: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { admin, b } = await mine(bookingId);
    const { data: svc } = await admin.from("services").select("duration_min").eq("id", b.service_id).maybeSingle();
    const dur = (svc as any)?.duration_min || 60;
    const [hh, mm] = time.split(":").map(Number);
    const startMin = hh * 60 + mm;
    const { error } = await admin.from("bookings").update({ during: `[${iso(dateStr, startMin)},${iso(dateStr, startMin + dur)})`, reminded_24h: false, reminded_2h: false }).eq("id", bookingId);
    if (error) return { ok: false, error: (error as any).code === "23P01" ? "That time is taken — pick another." : error.message };
    revalidatePath("/account");
    return { ok: true };
  } catch (e: any) { return { ok: false, error: e?.message || "Couldn't reschedule." }; }
}
