-- =====================================================
-- Row Level Security policies
-- =====================================================
-- Run after 01_schema.sql. RLS is enabled on every table, so without
-- these policies NO ONE (not even the dashboard) can read/write.
--
-- Idempotent: every policy is dropped before it is created, so this file can
-- be re-applied to change policies without hitting 42710.
-- =====================================================

-- ---- profiles ----
alter table public.profiles enable row level security;

-- Older projects may still have broad table grants and individual column grants.
revoke all on public.profiles from public, anon, authenticated;
revoke all (id, email, username, first_name, last_name, age, phone, role, created_at, updated_at)
  on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated, service_role;
grant update (first_name, last_name, age, phone) on public.profiles to authenticated;
grant update (role) on public.profiles to service_role;

alter function public.is_admin(uuid) set search_path = '';
revoke execute on function public.is_admin(uuid) from public, anon;
grant execute on function public.is_admin(uuid) to authenticated;

-- A user can read their own profile.
drop policy if exists "profiles: read own" on public.profiles;

create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Admins can read all profiles (needed for the admin user list).
drop policy if exists "profiles: admin reads all" on public.profiles;

create policy "profiles: admin reads all"
  on public.profiles for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- A user can update their own profile (except role — that should be admin-only).
drop policy if exists "profiles: update own non-sensitive" on public.profiles;

create policy "profiles: update own non-sensitive"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles: admin updates non-sensitive" on public.profiles;

create policy "profiles: admin updates non-sensitive"
  on public.profiles for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Only admins can insert profiles (signups go through the trigger, not direct insert).
drop policy if exists "profiles: admin inserts" on public.profiles;

-- Only admins can delete profiles.
drop policy if exists "profiles: admin deletes" on public.profiles;

-- ---- courts ----
alter table public.courts enable row level security;
grant select on public.courts to anon, authenticated, service_role;
grant insert, update, delete on public.courts to authenticated, service_role;

-- Public read (the public app lists courts).
drop policy if exists "courts: public read" on public.courts;

create policy "courts: public read"
  on public.courts for select
  to anon, authenticated
  using (true);

-- Only admins can modify.
drop policy if exists "courts: admin writes" on public.courts;

create policy "courts: admin writes"
  on public.courts for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- activities ----
alter table public.activities enable row level security;
grant select on public.activities to anon, authenticated, service_role;
grant insert, update, delete on public.activities to authenticated, service_role;

drop policy if exists "activities: public read" on public.activities;

create policy "activities: public read"
  on public.activities for select
  to anon, authenticated
  using (true);

drop policy if exists "activities: admin writes" on public.activities;

create policy "activities: admin writes"
  on public.activities for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- activity_categories ----
alter table public.activity_categories enable row level security;
grant select on public.activity_categories to anon, authenticated, service_role;
grant insert, update, delete on public.activity_categories to authenticated, service_role;

-- Categories inherit visibility from their parent activity.
drop policy if exists "activity_categories: public read" on public.activity_categories;

create policy "activity_categories: public read"
  on public.activity_categories for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.activities a
      where a.id = activity_categories.activity_id
    )
  );

drop policy if exists "activity_categories: admin writes" on public.activity_categories;

create policy "activity_categories: admin writes"
  on public.activity_categories for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- reservations ----
alter table public.reservations enable row level security;
grant select, insert, update, delete on public.reservations to authenticated, service_role;

-- Users read their own reservations.
drop policy if exists "reservations: user reads own" on public.reservations;

create policy "reservations: user reads own"
  on public.reservations for select
  to authenticated
  using (user_id = auth.uid());

-- Admins read all.
drop policy if exists "reservations: admin reads all" on public.reservations;

create policy "reservations: admin reads all"
  on public.reservations for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- Users insert their own reservations only.
-- The EXCLUDE constraint already prevents double-booking at the DB level.
drop policy if exists "reservations: user inserts own" on public.reservations;

create policy "reservations: user inserts own"
  on public.reservations for insert
  to authenticated
  with check (user_id = auth.uid() and created_by = auth.uid());

-- Admins can insert on behalf of any user (operator on the desk).
drop policy if exists "reservations: admin inserts any" on public.reservations;

create policy "reservations: admin inserts any"
  on public.reservations for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

-- Users can only delete their own.
drop policy if exists "reservations: user deletes own" on public.reservations;

create policy "reservations: user deletes own"
  on public.reservations for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "reservations: admin deletes any" on public.reservations;

create policy "reservations: admin deletes any"
  on public.reservations for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- Updates: users can update their own (limited fields enforced by trigger).
drop policy if exists "reservations: user updates own" on public.reservations;

create policy "reservations: user updates own"
  on public.reservations for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "reservations: admin updates any" on public.reservations;

create policy "reservations: admin updates any"
  on public.reservations for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- events ----
alter table public.events enable row level security;
grant select, insert, update, delete on public.events to authenticated, service_role;

-- Events are admin-only data (the public app does not list them).
drop policy if exists "events: admin reads" on public.events;

create policy "events: admin reads"
  on public.events for select
  to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists "events: admin writes" on public.events;

create policy "events: admin writes"
  on public.events for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
