-- Hardening po audycie Supabase (przed startem)
alter view public.booking_times set (security_invoker = on);
revoke all on public.booking_times from anon, authenticated;
alter function public.set_trial_ends()  set search_path = public, pg_temp;
alter function public.touch_updated_at() set search_path = public, pg_temp;
alter function public.owns_studio(uuid)  set search_path = public, pg_temp;
alter function public.studio_public(uuid) set search_path = public, pg_temp;
drop policy if exists "studio-photos read" on storage.objects;
