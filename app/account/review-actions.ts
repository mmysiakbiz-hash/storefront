"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function insertReview(bookingId: string, rating: number, text: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const s = createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user?.email) return { ok: false, error: "Please sign in." };
    const email = user.email.toLowerCase();
    const admin = createAdminClient();
    const { data: b } = await admin.from("bookings").select("guest_email, guest_name, studio_id").eq("id", bookingId).maybeSingle();
    if (!b || String((b as any).guest_email || "").toLowerCase() !== email) return { ok: false, error: "That isn't your visit." };
    const r = Math.min(5, Math.max(1, Math.round(rating)));
    const { error } = await admin.from("reviews").insert({
      studio_id: (b as any).studio_id, booking_id: bookingId, guest_email: email,
      guest_name: (b as any).guest_name, rating: r, text: (text || "").trim() || null,
    });
    if (error) return { ok: false, error: (error as any).code === "23505" ? "You already reviewed this visit." : error.message };
    revalidatePath("/account");
    return { ok: true };
  } catch (e: any) { return { ok: false, error: e?.message || "Couldn't submit review." }; }
}
