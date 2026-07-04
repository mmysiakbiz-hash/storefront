"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

async function assertAdmin(): Promise<void> {
  const s = createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user || !(await isPlatformAdmin(user.id, user.email))) throw new Error("Not authorized.");
}

export async function setStudioStatus(studioId: string, status: "verified" | "pending" | "suspended"): Promise<void> {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("studios").update({ status }).eq("id", studioId);
  revalidatePath("/admin");
}
