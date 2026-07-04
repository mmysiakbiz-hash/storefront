"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertOwns(studioId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();
  if (!email) throw new Error("Not signed in.");
  const admin = createAdminClient();
  const { data } = await admin.from("studios").select("owner_email, owner_id").eq("id", studioId).maybeSingle();
  const owns = data && (String((data as any).owner_email || "").toLowerCase() === email || (data as any).owner_id === user!.id);
  if (!owns) throw new Error("Not your studio.");
}

export async function updateProfile(studioId: string, formData: FormData): Promise<void> {
  await assertOwns(studioId);
  const admin = createAdminClient();
  await admin.from("studios").update({
    tagline: (formData.get("tagline") as string)?.trim() || null,
    bio: (formData.get("bio") as string)?.trim() || null,
    whatsapp: (formData.get("whatsapp") as string)?.trim() || null,
    address: (formData.get("address") as string)?.trim() || null,
  }).eq("id", studioId);
  revalidatePath("/panel");
}

export async function addService(studioId: string, formData: FormData): Promise<void> {
  await assertOwns(studioId);
  const name = ((formData.get("name") as string) || "").trim();
  if (!name) return;
  const admin = createAdminClient();
  await admin.from("services").insert({
    studio_id: studioId,
    name,
    duration_min: Number(formData.get("duration_min")) || 30,
    price_eur: Number(formData.get("price_eur")) || 0,
  });
  revalidatePath("/panel");
}

export async function deleteService(studioId: string, serviceId: string): Promise<void> {
  await assertOwns(studioId);
  const admin = createAdminClient();
  await admin.from("services").delete().eq("id", serviceId).eq("studio_id", studioId);
  revalidatePath("/panel");
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/account");
}

export async function saveLoyalty(studioId: string, formData: FormData): Promise<void> {
  await assertOwns(studioId);
  const admin = createAdminClient();
  const stamps = Math.min(20, Math.max(2, Number(formData.get("stamps_required")) || 5));
  await admin.from("loyalty_programs").upsert({
    studio_id: studioId,
    stamps_required: stamps,
    reward: ((formData.get("reward") as string) || "A free service").trim(),
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/panel");
}

function hhmmToMin(v: FormDataEntryValue | null): number | null {
  const s = String(v || "").trim();
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return null;
  const min = Number(m[1]) * 60 + Number(m[2]);
  return min >= 0 && min <= 1440 ? min : null;
}

export async function saveHours(studioId: string, formData: FormData): Promise<void> {
  await assertOwns(studioId);
  const admin = createAdminClient();
  const rows: { studio_id: string; day_of_week: number; open_min: number; close_min: number }[] = [];
  for (let d = 0; d < 7; d++) {
    const open = hhmmToMin(formData.get(`d${d}_open`));
    const close = hhmmToMin(formData.get(`d${d}_close`));
    if (open !== null && close !== null && close > open) rows.push({ studio_id: studioId, day_of_week: d, open_min: open, close_min: close });
  }
  await admin.from("business_hours").delete().eq("studio_id", studioId);
  if (rows.length) await admin.from("business_hours").insert(rows);
  revalidatePath("/panel");
}

export async function redeemReward(studioId: string, email: string): Promise<void> {
  await assertOwns(studioId);
  const admin = createAdminClient();
  await admin.from("loyalty_redemptions").insert({ studio_id: studioId, guest_email: email });
  revalidatePath("/panel");
}

export async function saveGoogle(studioId: string, formData: FormData): Promise<void> {
  await assertOwns(studioId);
  const admin = createAdminClient();
  const placeId = ((formData.get("google_place_id") as string) || "").trim() || null;
  const urlManual = ((formData.get("google_url") as string) || "").trim() || null;
  const ratingManual = formData.get("google_rating") ? Number(formData.get("google_rating")) : null;
  const countManual = formData.get("google_review_count") ? Number(formData.get("google_review_count")) : null;

  let update: any = { google_place_id: placeId, google_url: urlManual, google_rating: ratingManual, google_review_count: countManual };

  if (placeId) {
    try {
      const { fetchGooglePlace } = await import("@/lib/google");
      const g = await fetchGooglePlace(placeId);
      if (g) update = { google_place_id: placeId, google_url: g.url || urlManual, google_rating: g.rating ?? ratingManual, google_review_count: g.count ?? countManual, google_reviews: g.reviews };
    } catch { /* brak klucza → zostaje tryb ręczny */ }
  }
  await admin.from("studios").update(update).eq("id", studioId);
  revalidatePath("/panel");
}

export async function cancelBookingSalon(studioId: string, bookingId: string): Promise<void> {
  await assertOwns(studioId);
  const admin = createAdminClient();
  await admin.from("bookings").update({ status: "cancelled" }).eq("id", bookingId).eq("studio_id", studioId);
  revalidatePath("/panel");
}
