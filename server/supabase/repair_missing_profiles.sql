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
set search_path = ''
as $$
declare
  age_text text := btrim(new.raw_user_meta_data->>'age');
begin
  insert into public.profiles (
    id, email, username, first_name, last_name, age, phone
  ) values (
    new.id,
    new.email,
    new.email,                              -- username mirrors email
    left(coalesce(nullif(btrim(new.raw_user_meta_data->>'first_name'), ''), 'Socio'), 80),
    left(coalesce(nullif(btrim(new.raw_user_meta_data->>'last_name'), ''), 'Club Ranelagh'), 80),
    case
      when age_text ~ '^-?[0-9]{1,9}$' then greatest(12, least(99, age_text::integer))
      else 18
    end,
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---- 2. install the trigger that was missing ----
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- 3. backfill every auth user that still has no profile ----
insert into public.profiles (
  id, email, username, first_name, last_name, age, phone
)
select
  u.id,
  u.email,
  u.email,
  left(coalesce(nullif(btrim(u.raw_user_meta_data->>'first_name'), ''), 'Socio'), 80),
  left(coalesce(nullif(btrim(u.raw_user_meta_data->>'last_name'), ''), 'Club Ranelagh'), 80),
  case
    when metadata.age_text ~ '^-?[0-9]{1,9}$' then greatest(12, least(99, metadata.age_text::integer))
    else 18
  end,
  coalesce(u.raw_user_meta_data->>'phone', '')
from auth.users u
cross join lateral (select btrim(u.raw_user_meta_data->>'age') as age_text) metadata
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- ---- 4. verify: the count should be zero ----
select count(*) as profiles_missing
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
