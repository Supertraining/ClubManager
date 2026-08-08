-- =====================================================
-- Club Ranelagh — Supabase schema
-- =====================================================
-- Run this against a fresh Supabase project (or in the SQL editor).
-- Order of execution:
--   1. 01_schema.sql   (this file: tables, types, constraints)
--   2. 02_rls.sql       (Row Level Security policies)
--   3. 03_rpc.sql       (RPC functions used by the app)
--   4. 04_triggers.sql  (auth.users → profiles, slot bookkeeping)
--   5. 05_seed.sql      (initial admin + 4 courts)
-- =====================================================

-- ---- Extensions ----
create extension if not exists "citext";   -- case-insensitive email
create extension if not exists "pg_trgm";   -- fuzzy search (activities, users)
create extension if not exists "uuid-ossp";

-- ---- Enums ----
create type court_kind as enum ('futbol', 'paddle', 'squash', 'paleta');

create type event_status as enum ('pendiente', 'saldado', 'cancelado');

create type user_role as enum ('socio', 'admin');

-- =====================================================
-- profiles — extends auth.users with app-level data
-- =====================================================
-- One row per authenticated user. Created automatically by a trigger
-- on `auth.users` insert (see 04_triggers.sql).
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        citext unique not null,
  username     citext unique not null,        -- kept for legacy API
  first_name   text not null check (length(first_name) between 1 and 80),
  last_name    text not null check (length(last_name) between 1 and 80),
  age          smallint not null check (age between 12 and 99),
  phone        text not null,
  role         user_role not null default 'socio',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index profiles_email_idx on public.profiles using gin (email gin_trgm_ops);
create index profiles_name_idx  on public.profiles using gin ((first_name || ' ' || last_name) gin_trgm_ops);

-- =====================================================
-- courts — canchas del club
-- =====================================================
create table public.courts (
  id          uuid primary key default uuid_generate_v4(),
  name        court_kind unique not null,
  display_name text not null,
  description text,
  surface     text,
  price_cents integer check (price_cents >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- =====================================================
-- activities — actividades del club (fútbol infantil, etc.)
-- =====================================================
create table public.activities (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  description  text not null,
  image_url    text,
  image_alt    text,
  data_target  text unique,                  -- legacy modal id
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index activities_name_idx on public.activities using gin (name gin_trgm_ops);

-- =====================================================
-- activity_categories — sub-grupos (era embebido en activities)
-- =====================================================
create table public.activity_categories (
  id           uuid primary key default uuid_generate_v4(),
  activity_id  uuid not null references public.activities(id) on delete cascade,
  name         text not null,
  age_range    text not null,
  days         text not null,
  schedule     text not null,
  display_order smallint not null default 0,
  constraint activity_categories_unique unique (activity_id, name)
);

create index activity_categories_activity_idx on public.activity_categories(activity_id, display_order);

-- =====================================================
-- reservations — reservas (era la pieza duplicada en users.reserves + courts.unavailableDates)
-- =====================================================
-- One row per reservation. Replaces the dual storage in MongoDB and
-- makes double-booking structurally impossible via the EXCLUDE constraint.
create table public.reservations (
  id            uuid primary key default uuid_generate_v4(),
  court_id      uuid not null references public.courts(id) on delete restrict,
  user_id       uuid not null references public.profiles(id) on delete restrict,
  weekday       smallint not null check (weekday between 0 and 6),    -- 0=Sun … 6=Sat
  reservation_date date not null,
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  permanent     boolean not null default false,
  info          jsonb,
  created_at    timestamptz not null default now(),
  created_by    uuid references public.profiles(id),
  -- No two reservations on the same court can overlap.
  -- This is the key constraint that prevents the "double booking" bug
  -- present in the current MongoDB implementation.
  constraint reservations_no_overlap exclude using gist (
    court_id with =,
    tstzrange(start_time, end_time, '[)') with &&
  ),
  constraint reservations_duration check (end_time > start_time)
);

create index reservations_court_date_idx on public.reservations(court_id, reservation_date);
create index reservations_user_idx on public.reservations(user_id, start_time desc);
create index reservations_active_idx on public.reservations(end_time) where end_time > now();

-- =====================================================
-- events — eventos del club (cumple, casamiento, etc.)
-- =====================================================
create table public.events (
  id                uuid primary key default uuid_generate_v4(),
  type              text not null,                                -- 'casamiento', 'cumple', etc.
  client_first_name text not null,
  client_last_name  text not null,
  client_phone      text not null,
  adults            smallint not null default 0 check (adults >= 0),
  kids              smallint not null default 0 check (kids >= 0),
  start_time        timestamptz not null,
  end_time          timestamptz not null,
  service_option    text not null,
  extra_hours       text,
  extra_staff       text,
  comments          text,
  deposit           text,
  status            event_status not null default 'pendiente',
  -- Calendar visualization data (legacy: was an array on the doc).
  -- We keep it in JSONB to stay flexible without forcing a new table.
  calendar_data     jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  created_by        uuid references public.profiles(id),
  constraint events_duration check (end_time > start_time)
);

create index events_date_idx on public.events(start_time);
create index events_status_idx on public.events(status) where status = 'pendiente';

-- =====================================================
-- Helper: is_admin(uid) — used by RLS policies
-- =====================================================
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;
