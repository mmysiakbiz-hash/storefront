-- odhaczanie nagród lojalnościowych
create table if not exists loyalty_redemptions (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios(id) on delete cascade,
  guest_email text not null,
  redeemed_at timestamptz not null default now()
);
create index if not exists loyalty_redemptions_studio_idx on loyalty_redemptions(studio_id);
alter table loyalty_redemptions enable row level security;
create policy lr_owner on loyalty_redemptions for all
  using (owns_studio(studio_id)) with check (owns_studio(studio_id));

-- opinie po wizycie (tylko od osób, które faktycznie rezerwowały — weryfikuje server action)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  guest_email text,
  guest_name text,
  rating int not null check (rating between 1 and 5),
  text text,
  created_at timestamptz not null default now(),
  unique (booking_id)
);
create index if not exists reviews_studio_idx on reviews(studio_id);
alter table reviews enable row level security;
create policy reviews_read on reviews for select using (studio_public(studio_id));

-- import opinii z Google (ręcznie + opcjonalny auto-pull przez Places API)
alter table studios add column if not exists google_place_id     text;
alter table studios add column if not exists google_url          text;
alter table studios add column if not exists google_rating       numeric(2,1);
alter table studios add column if not exists google_review_count int;
alter table studios add column if not exists google_reviews      jsonb;
