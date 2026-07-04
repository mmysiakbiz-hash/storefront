-- flagi wysłanych przypomnień (idempotencja crona)
alter table bookings add column if not exists reminded_24h boolean not null default false;
alter table bookings add column if not exists reminded_2h  boolean not null default false;

-- widok z flagami przypomnień (cron filtruje po nich)
create or replace view booking_times as
  select
    b.id, b.studio_id, b.staff_id, b.service_id, b.status, b.price_eur,
    b.guest_name, b.guest_email, b.guest_phone, b.reminded_24h, b.reminded_2h,
    lower(b.during) as starts_at, upper(b.during) as ends_at,
    s.name as service_name, s.duration_min,
    st.name as staff_name, st.color as staff_color,
    stu.name as studio_name, stu.slug as studio_slug
  from bookings b
  left join services s   on s.id = b.service_id
  left join staff st     on st.id = b.staff_id
  left join studios stu  on stu.id = b.studio_id;
