-- =====================================================
-- RPC functions used by the frontend
-- =====================================================
-- These replace the equivalent endpoints in the current Express server
-- (e.g. /courts/:name, /reserves/clean). Run after 01_schema.sql.
-- =====================================================

-- ---- get_court_reservations(court_id, from_date, to_date) ----
-- Returns every reservation for a court between two dates.
-- Equivalent to the current GET /courts/:name in Express.
create or replace function public.get_court_reservations(
  p_court_id uuid,
  p_from timestamptz default now(),
  p_to timestamptz default now() + interval '14 days'
)
returns table (
  id uuid,
  weekday smallint,
  reservation_date date,
  start_time timestamptz,
  end_time timestamptz,
  user_id uuid,
  permanent boolean,
  info jsonb
)
language sql
security definer
stable
as $$
  select r.id, r.weekday, r.reservation_date, r.start_time, r.end_time,
         r.user_id, r.permanent, r.info
  from public.reservations r
  where r.court_id = p_court_id
    and r.start_time >= p_from
    and r.start_time < p_to
  order by r.start_time;
$$;

revoke all on function public.get_court_reservations(uuid, timestamptz, timestamptz) from public;
grant execute on function public.get_court_reservations(uuid, timestamptz, timestamptz) to authenticated;

-- ---- create_reservation_for_user(court_id, start_time, end_time) ----
-- Server-side wrapper that validates the user is who they say they are.
-- The frontend posts { court_id, start_time, end_time } and the
-- server-side function decides which policy path to use.
create or replace function public.create_reservation(
  p_court_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz,
  p_permanent boolean default false,
  p_info jsonb default null
)
returns public.reservations
language plpgsql
security invoker
as $$
declare
  v_uid uuid := auth.uid();
  v_role user_role;
  v_reservation public.reservations;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select role into v_role from public.profiles where id = v_uid;
  if v_role is null then
    raise exception 'Profile missing' using errcode = '42501';
  end if;

  -- RLS handles ownership. We just need a sane insert.
  insert into public.reservations
    (court_id, user_id, weekday, reservation_date, start_time, end_time, permanent, info, created_by)
  values
    (p_court_id, v_uid,
     extract(dow from p_start_time)::smallint,
     p_start_time::date,
     p_start_time, p_end_time, p_permanent, p_info, v_uid)
  returning * into v_reservation;

  return v_reservation;
exception
  when exclusion_violation then
    raise exception 'Ese horario ya está reservado' using errcode = '23P01';
end;
$$;

revoke all on function public.create_reservation(uuid, timestamptz, timestamptz, boolean, jsonb) from public;
grant execute on function public.create_reservation(uuid, timestamptz, timestamptz, boolean, jsonb) to authenticated;

-- ---- delete_old_reservations() ----
-- Cron-friendly cleanup. Same behaviour as the current /courts/reserve/clean
-- in Express, but atomic per court.
create or replace function public.delete_old_reservations()
returns integer
language plpgsql
security definer
as $$
declare
  v_deleted integer;
begin
  with deleted as (
    delete from public.reservations
    where end_time < now()
    returning 1
  )
  select count(*) into v_deleted from deleted;
  return v_deleted;
end;
$$;

revoke all on function public.delete_old_reservations() from public;
grant execute on function public.delete_old_reservations() to service_role;

-- ---- search_profiles(query, limit) ----
-- Powers the admin's "Buscar socio" search. Uses pg_trgm for fuzzy match.
create or replace function public.search_profiles(
  p_query text,
  p_limit integer default 25
)
returns table (
  id uuid,
  email citext,
  first_name text,
  last_name text,
  age smallint,
  phone text,
  role user_role
)
language sql
security invoker
stable
as $$
  select p.id, p.email, p.first_name, p.last_name, p.age, p.phone, p.role
  from public.profiles p
  where public.is_admin(auth.uid())
    and (
      p.email ilike '%' || p_query || '%'
      or (p.first_name || ' ' || p.last_name) ilike '%' || p_query || '%'
      or p.phone ilike '%' || p_query || '%'
    )
  order by similarity(p.first_name || ' ' || p.last_name, p_query) desc
  limit p_limit;
$$;

revoke all on function public.search_profiles(text, integer) from public;
grant execute on function public.search_profiles(text, integer) to authenticated;

-- ---- promote_to_admin(target_email) ----
-- Bootstrap helper. The first admin can promote themselves by calling this
-- from the Supabase SQL editor with their own email. After that, only admins
-- can call it.
create or replace function public.promote_to_admin(p_email citext)
returns void
language plpgsql
security definer
as $$
begin
  -- The first time, allow without admin (bootstrap). After that, require admin.
  if exists (select 1 from public.profiles where role = 'admin') then
    if not public.is_admin(auth.uid()) then
      raise exception 'Solo un admin puede promover a otro admin' using errcode = '42501';
    end if;
  end if;

  update public.profiles set role = 'admin' where email = p_email;

  if not found then
    raise exception 'Usuario con email % no encontrado', p_email using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.promote_to_admin(citext) from public;
grant execute on function public.promote_to_admin(citext) to authenticated;
