-- Faza 2 — silnik rezerwacji

-- dane gościa (rezerwacja bez konta — niska bariera dla turysty)
alter table bookings add column if not exists guest_name  text;
alter table bookings add column if not exists guest_email text;
alter table bookings add column if not exists guest_phone text;

-- widok z czystymi granicami czasu + nazwami (do dostępności i agendy w panelu)
create or replace view booking_times as
  select
    b.id, b.studio_id, b.staff_id, b.service_id, b.status, b.price_eur,
    b.guest_name, b.guest_email, b.guest_phone,
    lower(b.during) as starts_at,
    upper(b.during) as ends_at,
    s.name as service_name, s.duration_min,
    st.name as staff_name, st.color as staff_color,
    stu.name as studio_name, stu.slug as studio_slug
  from bookings b
  left join services s   on s.id = b.service_id
  left join staff st     on st.id = b.staff_id
  left join studios stu  on stu.id = b.studio_id;

-- pozwól publiczny odczyt rezerwacji NIE jest potrzebny — dostępność liczymy service-role.
-- (booking_times czytamy adminem po stronie serwera)
