-- =====================================================
-- Row Level Security policies
-- =====================================================
-- Run after 01_schema.sql. RLS is enabled on every table, so without
-- these policies NO ONE (not even the dashboard) can read/write.
-- =====================================================

-- ---- profiles ----
alter table public.profiles enable row level security;

-- A user can read their own profile.
create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Admins can read all profiles (needed for the admin user list).
create policy "profiles: admin reads all"
  on public.profiles for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- A user can update their own profile (except role — that should be admin-only).
create policy "profiles: update own non-sensitive"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Only admins can insert profiles (signups go through the trigger, not direct insert).
create policy "profiles: admin inserts"
  on public.profiles for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

-- Only admins can delete profiles.
create policy "profiles: admin deletes"
  on public.profiles for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---- courts ----
alter table public.courts enable row level security;

-- Public read (the public app lists courts).
create policy "courts: public read"
  on public.courts for select
  to anon, authenticated
  using (true);

-- Only admins can modify.
create policy "courts: admin writes"
  on public.courts for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- activities ----
alter table public.activities enable row level security;

create policy "activities: public read"
  on public.activities for select
  to anon, authenticated
  using (true);

create policy "activities: admin writes"
  on public.activities for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- activity_categories ----
alter table public.activity_categories enable row level security;

-- Categories inherit visibility from their parent activity.
create policy "activity_categories: public read"
  on public.activity_categories for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.activities a
      where a.id = activity_categories.activity_id
    )
  );

create policy "activity_categories: admin writes"
  on public.activity_categories for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- reservations ----
alter table public.reservations enable row level security;

-- Users read their own reservations.
create policy "reservations: user reads own"
  on public.reservations for select
  to authenticated
  using (user_id = auth.uid());

-- Admins read all.
create policy "reservations: admin reads all"
  on public.reservations for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- Users insert their own reservations only.
-- The EXCLUDE constraint already prevents double-booking at the DB level.
create policy "reservations: user inserts own"
  on public.reservations for insert
  to authenticated
  with check (user_id = auth.uid() and created_by = auth.uid());

-- Admins can insert on behalf of any user (operator on the desk).
create policy "reservations: admin inserts any"
  on public.reservations for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

-- Users can only delete their own.
create policy "reservations: user deletes own"
  on public.reservations for delete
  to authenticated
  using (user_id = auth.uid());

create policy "reservations: admin deletes any"
  on public.reservations for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- Updates: users can update their own (limited fields enforced by trigger).
create policy "reservations: user updates own"
  on public.reservations for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "reservations: admin updates any"
  on public.reservations for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- events ----
alter table public.events enable row level security;

-- Events are admin-only data (the public app does not list them).
create policy "events: admin reads"
  on public.events for select
  to authenticated
  using (public.is_admin(auth.uid()));

create policy "events: admin writes"
  on public.events for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
