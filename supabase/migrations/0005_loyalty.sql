-- Loyalty Cards prowadzone przez salon (stempelki → nagroda). Per obiekt.
create table if not exists loyalty_programs (
  studio_id       uuid primary key references studios(id) on delete cascade,
  stamps_required int not null default 5 check (stamps_required between 2 and 20),
  reward          text not null default 'A free service',
  active          boolean not null default false,
  updated_at      timestamptz not null default now()
);
alter table loyalty_programs enable row level security;
create policy loyalty_read  on loyalty_programs for select using (true);  -- oferta jest publiczna
create policy loyalty_write on loyalty_programs for all
  using (owns_studio(studio_id)) with check (owns_studio(studio_id));
