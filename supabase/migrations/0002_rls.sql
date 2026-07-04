-- book.sey.la — Row Level Security (Faza 0, pierwsze cięcie)

alter table studios        enable row level security;
alter table staff          enable row level security;
alter table services       enable row level security;
alter table business_hours enable row level security;
alter table time_off       enable row level security;
alter table bookings       enable row level security;
alter table admins         enable row level security;

-- STUDIA: publiczny odczyt zweryfikowanych; właściciel widzi/edytuje swoje
create policy studios_read on studios for select
  using (status = 'verified' or owner_id = auth.uid());
create policy studios_insert on studios for insert
  with check (owner_id = auth.uid());
create policy studios_update on studios for update
  using (owner_id = auth.uid());

-- helper: czy bieżący user jest właścicielem danego studia
create or replace function owns_studio(sid uuid) returns boolean language sql stable as $$
  select exists (select 1 from studios s where s.id = sid and s.owner_id = auth.uid());
$$;
-- helper: czy studio jest publiczne (zweryfikowane)
create or replace function studio_public(sid uuid) returns boolean language sql stable as $$
  select exists (select 1 from studios s where s.id = sid and s.status = 'verified');
$$;

-- USŁUGI / PRACOWNICY / GODZINY: odczyt publiczny gdy studio zweryfikowane lub właściciel; zapis właściciel
do $$
declare t text;
begin
  foreach t in array array['services','staff','business_hours'] loop
    execute format('create policy %1$s_read on %1$s for select using (studio_public(studio_id) or owns_studio(studio_id));', t);
    execute format('create policy %1$s_write on %1$s for all using (owns_studio(studio_id)) with check (owns_studio(studio_id));', t);
  end loop;
end $$;

-- BLOKADY: tylko właściciel
create policy timeoff_all on time_off for all
  using (owns_studio(studio_id)) with check (owns_studio(studio_id));

-- REZERWACJE: klient widzi swoje, studio swoje; wstawia zalogowany klient
create policy bookings_read on bookings for select
  using (customer_id = auth.uid() or owns_studio(studio_id));
create policy bookings_insert on bookings for insert
  with check (customer_id = auth.uid());
create policy bookings_update on bookings for update
  using (customer_id = auth.uid() or owns_studio(studio_id));

-- ADMINI: tylko admini czytają listę
create policy admins_read on admins for select
  using (exists (select 1 from admins a where a.user_id = auth.uid()));

-- TODO Faza 2: RPC create_booking() SECURITY DEFINER — liczy dostępność,
-- wstawia rezerwację; constraint no_overlap jest ostatnią linią obrony.
