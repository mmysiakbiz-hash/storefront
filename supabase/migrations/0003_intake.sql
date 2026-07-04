-- book.sey.la — ankieta onboardingowa → auto-generowana strona obiektu (Faza 1)

-- dodatkowe pola treści na stronę obiektu
alter table studios add column if not exists tagline     text;
alter table studios add column if not exists whatsapp    text;
alter table studios add column if not exists owner_email text;  -- e-mail właściciela (claim panelu po zalogowaniu)
create index if not exists studios_owner_email_idx on studios(owner_email);

-- lista klientów salonu (wklepywana jak w Excelu)
create table if not exists clients (
  id         uuid primary key default gen_random_uuid(),
  studio_id  uuid not null references studios(id) on delete cascade,
  staff_id   uuid references staff(id) on delete set null,  -- pracownik, który obsługuje tego klienta
  name       text not null,
  phone      text,
  email      text,
  notes      text,
  created_at timestamptz not null default now()
);
create index if not exists clients_studio_idx on clients(studio_id);
create index if not exists clients_staff_idx on clients(staff_id);
alter table clients enable row level security;
create policy clients_owner on clients for all
  using (owns_studio(studio_id)) with check (owns_studio(studio_id));

-- storage na zdjęcia obiektów
insert into storage.buckets (id, name, public)
  values ('studio-photos', 'studio-photos', true)
  on conflict (id) do nothing;

create policy "studio-photos read"   on storage.objects for select
  using (bucket_id = 'studio-photos');
create policy "studio-photos insert" on storage.objects for insert
  with check (bucket_id = 'studio-photos');
