-- =====================================================
-- Repair: profiles rows missing for existing auth users
-- =====================================================
-- Symptom: every booking fails with 500 "Profile missing". The RPC
-- create_reservation does `select role from profiles where id = auth.uid()`
-- and raises that error when the row is absent, so an auth user without a
-- profile cannot do anything except log in.
--
-- Cause: the `on_auth_user_created` trigger from 04_triggers.sql is not
-- installed in the live project, so signups created an auth.users row and
-- nothing else. "Mi cuenta" still looks fine because the reserves endpoint
-- answers 200 with [] instead of failing loudly.
--
-- This script is idempotent. Run it in the Supabase SQL editor.
-- It is safe to re-run, and it does not touch existing profiles.
-- =====================================================

-- ---- 1. make sure the trigger function exists ----
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, username, first_name, last_name, age, phone, role
  ) values (
    new.id,
    new.email,
    new.email,                              -- username mirrors email
    -- profiles.first_name/last_name are NOT NULL with length >= 1, so an
    -- empty string would fail the CHECK. Fall back to a placeholder instead.
    coalesce(nullif(new.raw_user_meta_data->>'first_name', ''), 'Socio'),
    coalesce(nullif(new.raw_user_meta_data->>'last_name', ''), 'Club Ranelagh'),
    -- profiles.age is CHECK (age between 12 and 99); clamp instead of trusting
    -- the metadata, otherwise a bogus value blocks the whole signup.
    greatest(12, least(99, coalesce((new.raw_user_meta_data->>'age')::smallint, 18))),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'socio')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- ---- 2. install the trigger that was missing ----
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- 3. backfill every auth user that still has no profile ----
insert into public.profiles (
  id, email, username, first_name, last_name, age, phone, role
)
select
  u.id,
  u.email,
  u.email,
  coalesce(nullif(u.raw_user_meta_data->>'first_name', ''), 'Socio'),
  coalesce(nullif(u.raw_user_meta_data->>'last_name', ''), 'Club Ranelagh'),
  greatest(12, least(99, coalesce((u.raw_user_meta_data->>'age')::smallint, 18))),
  coalesce(u.raw_user_meta_data->>'phone', ''),
  coalesce((u.raw_user_meta_data->>'role')::user_role, 'socio')
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- ---- 4. verify: this should return zero rows ----
select u.id, u.email
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
