"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type ServiceRow = { name: string; duration_min: number; price_eur: number; category?: string };
export type ClientRow = { name: string; phone?: string; email?: string; staff?: string };
export type StaffRow = { name: string };

export type IntakeData = {
  name: string;
  owner_email?: string;
  category: string;
  island: string;
  address?: string;
  whatsapp?: string;
  tagline?: string;
  bio?: string;
  photos: string[];
  staff: StaffRow[];
  services: ServiceRow[];
  clients: ClientRow[];
};

function slugify(name: string): string {
  const base =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "studio";
  const suffix = Math.random().toString(36).slice(2, 6);
  return base + "-" + suffix;
}

export async function submitIntake(
  data: IntakeData
): Promise<{ ok: boolean; slug?: string; error?: string }> {
  try {
    if (!data.name?.trim()) return { ok: false, error: "Brak nazwy obiektu." };
    const supabase = createAdminClient();
    const slug = slugify(data.name);

    const { data: studio, error } = await supabase
      .from("studios")
      .insert({
        name: data.name.trim(),
        owner_email: data.owner_email ? data.owner_email.trim().toLowerCase() : null,
        category: data.category,
        island: data.island,
        address: data.address || null,
        whatsapp: data.whatsapp || null,
        tagline: data.tagline || null,
        bio: data.bio || null,
        photos: data.photos || [],
        slug,
        status: "pending",
      })
      .select("id, slug")
      .single();
    if (error) throw error;

    const studioId = studio.id as string;
    const staffMap = new Map<string, string>(); // lowercased name → staff id

    if (data.staff?.length) {
      const PALETTE = ["#A8503F", "#6F8265", "#B2925F", "#7C6A8A", "#4E7C8A", "#C0705E"];
      const rows = data.staff
        .filter((s) => s.name?.trim())
        .map((s, i) => ({ studio_id: studioId, name: s.name.trim(), color: PALETTE[i % PALETTE.length], active: true }));
      if (rows.length) {
        const { data: inserted, error: te } = await supabase.from("staff").insert(rows).select("id, name");
        if (te) throw te;
        for (const s of inserted || []) staffMap.set(String(s.name).trim().toLowerCase(), s.id as string);
      }
    }

    if (data.services?.length) {
      const rows = data.services
        .filter((s) => s.name?.trim())
        .map((s, i) => ({
          studio_id: studioId,
          name: s.name.trim(),
          duration_min: Number(s.duration_min) || 30,
          price_eur: Number(s.price_eur) || 0,
          category: s.category || data.category,
          sort: i,
        }));
      if (rows.length) {
        const { error: se } = await supabase.from("services").insert(rows);
        if (se) throw se;
      }
    }

    if (data.clients?.length) {
      const rows = data.clients
        .filter((c) => c.name?.trim())
        .map((c) => ({
          studio_id: studioId,
          staff_id: c.staff ? staffMap.get(c.staff.trim().toLowerCase()) ?? null : null,
          name: c.name.trim(),
          phone: c.phone || null,
          email: c.email || null,
        }));
      if (rows.length) {
        const { error: ce } = await supabase.from("clients").insert(rows);
        if (ce) throw ce;
      }
    }

    return { ok: true, slug: studio.slug as string };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Nieznany błąd zapisu." };
  }
}
