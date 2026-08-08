-- =====================================================
-- Triggers — auth.users → profiles, updated_at, etc.
-- =====================================================
-- Run after 01_schema.sql and 02_rls.sql.
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

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger activities_set_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- ---- handle_new_user — create a profile row when auth.users gets a new row ----
-- This is the Supabase-equivalent of your Express /register endpoint.
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
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce((new.raw_user_meta_data->>'age')::smallint, 18),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'socio')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop if exists (Supabase sometimes creates a default one).
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- Reservation auto-cancel ----
-- Optional: when a user is deleted, cancel their pending reservations.
-- (Foreign key with `on delete restrict` will block user deletion if
-- reservations exist, so this trigger is for soft delete scenarios.)
create or replace function public.cancel_user_reservations()
returns trigger
language plpgsql
as $$
begin
  -- If you want hard delete, you would change the FK to `on delete cascade`.
  -- For now we keep the restriction: deleting a user requires admin
  -- to clean up reservations first (matches the current Express behaviour).
  raise exception 'No se puede eliminar un usuario con reservas activas' using errcode = '23503';
  return null;
end;
$$;

create trigger profiles_block_delete_with_reservations
  before delete on public.profiles
  for each row execute function public.cancel_user_reservations();
