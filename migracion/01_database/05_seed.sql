-- =====================================================
-- Seed data
-- =====================================================
-- Run after 01–04. Inserts the 4 standard courts and a starter admin
-- invite. The admin's actual user is created via Supabase Auth signUp;
-- this just ensures the metadata fields are right.
-- =====================================================

-- ---- Courts ----
insert into public.courts (name, display_name, description, surface, price_cents) values
  ('futbol', 'Fútbol 5', 'Césped sintético, arcos reglamentarios, vestuarios y luz LED.', 'Césped sintético', 800000),
  ('paddle', 'Paddle',    'Paredes de cristal, superficie de césped artificial y altura reglamentaria.', 'Cristal templado', 700000),
  ('squash', 'Squash',    'Cancha con paredes azules reglamentarias, calefacción y piso de madera.', 'Madera', 450000),
  ('paleta', 'Paleta frontón', 'Frontón de paleta con pared lateral y cristal.', 'Frontón', 350000)
on conflict (name) do nothing;

-- ---- Promote a user to admin (bootstrap) ----
-- Run this AFTER the first user has signed up via Supabase Auth.
-- Usage (in the Supabase SQL editor):
--   select public.promote_to_admin('admin@ranelaghclub.com');
-- =====================================================
-- The function is in 03_rpc.sql; this file just documents how to call it.
