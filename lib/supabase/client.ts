"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Supabase client dla komponentów klienckich (przeglądarka). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
