-- Opcjonalny seed: przykładowy obiekt (dla "See an example" i testu auto-strony)
insert into studios (slug, name, category, island, address, whatsapp, tagline, bio, photos, status)
values (
  'kreol-spa', 'Kreol Spa', 'Spa & Wellness', 'Mahé', 'Beau Vallon, Mahé', '+248 251 0000',
  'Island massage & natural beauty',
  'A calm corner of Beau Vallon for slow mornings and softer evenings — natural oils, island hands, and the sound of the sea a few steps away.',
  '["https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=70","https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=70","https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=70"]'::jsonb,
  'verified'
) on conflict (slug) do nothing;

with s as (select id from studios where slug = 'kreol-spa')
insert into services (studio_id, name, duration_min, price_eur, sort)
select s.id, v.name, v.d, v.p, v.sort from s, (values
  ('Coconut & frangipani massage', 60, 55, 0),
  ('Deep tissue massage', 60, 60, 1),
  ('Express glow facial', 30, 35, 2),
  ('Gel manicure', 45, 30, 3)
) as v(name, d, p, sort)
where not exists (select 1 from services x join studios st on st.id = x.studio_id where st.slug = 'kreol-spa');
