-- book.sey.la — schemat początkowy (Faza 0)
-- Model: 3 mies. free → 1000 SCR/mc + 20% od pierwszej wizyty nowego klienta z marketplace.

create extension if not exists pgcrypto;    -- gen_random_uuid()
create extension if not exists btree_gist;  -- EXCLUDE z '=' na skalarze obok zakresu czasu

-- ---------- STUDIA ----------
create table if not exists studios (
  id                    uuid primary key default gen_random_uuid(),
  owner_id              uuid references auth.users(id) on delete set null,
  slug                  text unique not null,
  name                  text not null,
  category              text not null,
  island                text,
  address               text,
  lat                   double precision,
  lng                   double precision,
  bio                   text,
  photos                jsonb not null default '[]',
  -- rozliczenia
  plan                  text not null default 'trial',   -- trial|active|past_due|cancelled
  trial_ends_at         timestamptz,
  stripe_customer_id    text,
  stripe_subscription_id text,
  -- moderacja
  status                text not null default 'pending', -- pending|verified|suspended
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists studios_status_idx on studios(status);

-- 3 miesiące free liczone od założenia
create or replace function set_trial_ends() returns trigger language plpgsql as $$
begin
  if new.trial_ends_at is null then
    new.trial_ends_at := new.created_at + interval '3 months';
  end if;
  return new;
end $$;
drop trigger if exists trg_trial on studios;
create trigger trg_trial before insert on studios
  for each row execute function set_trial_ends();

create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists trg_touch on studios;
create trigger trg_touch before update on studios
  for each row execute function touch_updated_at();

-- ---------- PRACOWNICY ----------
create table if not exists staff (
  id         uuid primary key default gen_random_uuid(),
  studio_id  uuid not null references studios(id) on delete cascade,
  name       text not null,
  color      text,
  active     boolean not null default true
);
create index if not exists staff_studio_idx on staff(studio_id);

-- ---------- USŁUGI ----------
create table if not exists services (
  id           uuid primary key default gen_random_uuid(),
  studio_id    uuid not null references studios(id) on delete cascade,
  name         text not null,
  duration_min integer not null check (duration_min > 0),
  price_eur    numeric(10,2) not null,
  category     text,
  active       boolean not null default true,
  sort         integer not null default 0
);
create index if not exists services_studio_idx on services(studio_id);

-- ---------- GODZINY PRACY ----------
create table if not exists business_hours (
  id           uuid primary key default gen_random_uuid(),
  studio_id    uuid not null references studios(id) on delete cascade,
  day_of_week  smallint not null check (day_of_week between 0 and 6),
  open_min     integer not null,   -- minuty od północy
  close_min    integer not null
);
create index if not exists hours_studio_idx on business_hours(studio_id);

-- ---------- BLOKADY / URLOPY ----------
create table if not exists time_off (
  id         uuid primary key default gen_random_uuid(),
  studio_id  uuid not null references studios(id) on delete cascade,
  staff_id   uuid references staff(id) on delete cascade,
  during     tstzrange not null,
  reason     text
);
create index if not exists timeoff_studio_idx on time_off(studio_id);

-- ---------- REZERWACJE (serce systemu) ----------
create table if not exists bookings (
  id           uuid primary key default gen_random_uuid(),
  studio_id    uuid not null references studios(id) on delete cascade,
  service_id   uuid references services(id) on delete set null,
  staff_id     uuid references staff(id) on delete set null,
  customer_id  uuid references auth.users(id) on delete set null,
  during       tstzrange not null,
  status       text not null default 'confirmed', -- confirmed|cancelled|completed|no_show
  price_eur    numeric(10,2),
  notes        text,
  -- prowizja od nowego klienta (logika w Fazie 2)
  source           text not null default 'marketplace', -- marketplace|direct
  is_new_client    boolean not null default false,
  commission_due   numeric(10,2) not null default 0,
  created_at   timestamptz not null default now(),

  -- GWARANCJA: dwie aktywne rezerwacje tego samego pracownika nie mogą się nakładać.
  constraint no_overlap exclude using gist (
    staff_id with =,
    during   with &&
  ) where (status <> 'cancelled')
);
create index if not exists bookings_studio_idx on bookings(studio_id);
create index if not exists bookings_customer_idx on bookings(customer_id);
create index if not exists bookings_during_idx on bookings using gist (during);

-- ---------- ADMINI ----------
create table if not exists admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
