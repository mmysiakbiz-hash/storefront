"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const TZ = "+04:00";            // Seszele (SCT, bez DST)
const DEF_OPEN = 9 * 60, DEF_CLOSE = 18 * 60, STEP = 30;

function iso(dateStr: string, minutes: number): string {
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${dateStr}T${hh}:${mm}:00${TZ}`;
}

export async function getAvailability(studioId: string, staffId: string, dateStr: string, durationMin: number): Promise<string[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("booking_times")
      .select("starts_at, ends_at, status")
      .eq("studio_id", studioId).eq("staff_id", staffId).neq("status", "cancelled")
      .gte("starts_at", `${dateStr}T00:00:00${TZ}`).lte("starts_at", `${dateStr}T23:59:59${TZ}`);
    const busy = ((data as any[]) || []).map((b) => ({ s: new Date(b.starts_at).getTime(), e: new Date(b.ends_at).getTime() }));

    // okno pracy z business_hours (fallback 09-18, gdy salon nie ustawił godzin)
    const { data: hoursRows } = await admin.from("business_hours").select("day_of_week, open_min, close_min").eq("studio_id", studioId);
    const hours = (hoursRows as any[]) || [];
    let OPEN = DEF_OPEN, CLOSE = DEF_CLOSE;
    if (hours.length) {
      const dow = new Date(`${dateStr}T12:00:00${TZ}`).getDay();
      const h = hours.find((x) => x.day_of_week === dow);
      if (!h) return []; // dzień zamknięty
      OPEN = h.open_min; CLOSE = h.close_min;
    }

    const now = Date.now();
    const out: string[] = [];
    for (let m = OPEN; m + durationMin <= CLOSE; m += STEP) {
      const s = new Date(iso(dateStr, m)).getTime();
      const e = s + durationMin * 60000;
      if (s < now) continue;
      if (!busy.some((b) => s < b.e && e > b.s)) out.push(iso(dateStr, m).slice(11, 16));
    }
    return out;
  } catch { return []; }
}

export async function bookSlot(input: {
  studioId: string; serviceId: string; staffId: string; dateStr: string; time: string;
  durationMin: number; priceEur: number; name: string; email: string; phone: string;
  studioName?: string; serviceName?: string; staffName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!input.name?.trim()) return { ok: false, error: "Please add your name." };
    const [hh, mm] = input.time.split(":").map(Number);
    const startMin = hh * 60 + mm;
    const startISO = iso(input.dateStr, startMin);
    const endISO = iso(input.dateStr, startMin + input.durationMin);

    const admin = createAdminClient();
    const { error } = await admin.from("bookings").insert({
      studio_id: input.studioId, service_id: input.serviceId, staff_id: input.staffId,
      during: `[${startISO},${endISO})`, status: "confirmed", price_eur: input.priceEur,
      guest_name: input.name.trim(), guest_email: input.email?.trim() || null, guest_phone: input.phone?.trim() || null,
    });
    if (error) {
      if ((error as any).code === "23P01") return { ok: false, error: "That time was just taken — please pick another slot." };
      return { ok: false, error: error.message };
    }

    try {
      const { sendEmail } = await import("@/lib/brevo");
      const { templates } = await import("@/lib/emails");
      if (input.email?.trim()) {
        const t = templates.bookingConfirmed({
          guest: input.name.trim(),
          studio: input.studioName || "your studio",
          service: input.serviceName || "your treatment",
          staff: input.staffName,
          when: `${input.dateStr} at ${input.time}`,
        });
        await sendEmail({ to: [{ email: input.email.trim(), name: input.name.trim() }], subject: t.subject, html: t.html });
      }
    } catch { /* email best-effort */ }

    return { ok: true };
  } catch (e: any) { return { ok: false, error: e?.message || "Couldn't complete the booking." }; }
}
