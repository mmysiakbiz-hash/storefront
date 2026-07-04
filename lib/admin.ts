import { createAdminClient } from "@/lib/supabase/admin";

/** Czy user jest adminem platformy: e-mail w ADMIN_EMAILS (bootstrap) lub wpis w tabeli admins. */
export async function isPlatformAdmin(userId: string, email: string | null | undefined): Promise<boolean> {
  const e = (email || "").toLowerCase();
  const envList = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (e && envList.includes(e)) return true;
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
    return !!data;
  } catch { return false; }
}
