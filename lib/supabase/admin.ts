import { createClient } from "@supabase/supabase-js";

/** Klient z service_role — TYLKO po stronie serwera. Omija RLS (intake bez logowania). */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
