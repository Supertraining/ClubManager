-- =====================================================
-- Triggers — auth.users → profiles, updated_at, etc.
-- =====================================================
-- Run after 01_schema.sql and 02_rls.sql.
--
-- This file is idempotent: every trigger is dropped before it is created,
-- so re-running it against a database that already has some of them does not
-- abort with 42710 ("trigger already exists").
-- =====================================================

-- ---- updated_at trigger ----
-- Keeps updated_at fresh on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists activities_set_updated_at on public.activities;

create trigger activities_set_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- ---- handle_new_user — create a profile row when auth.users gets a new row ----
-- This is the Supabase-equivalent of your Express /register endpoint.
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
    -- first_name / last_name are NOT NULL with CHECK (length between 1 and 80),
    -- so coalescing to '' would fail the constraint and abort the whole signup.
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

-- Drop if exists (Supabase sometimes creates a default one).
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Foreign keys protect reservations and other records that reference the profile.
drop trigger if exists profiles_block_delete_with_reservations on public.profiles;
drop function if exists public.cancel_user_reservations();
