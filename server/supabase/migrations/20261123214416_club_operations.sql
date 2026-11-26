drop function public.delete_old_reservations();

alter table public.courts add column duration_options_min integer[] not null default array[60,90,120]
  check (cardinality(duration_options_min) between 1 and 8
    and array_position(duration_options_min, null) is null
    and duration_options_min <@ array[30,60,90,120,150,180,210,240]);

create table public.court_schedules (
  club_id uuid not null,
  court_id uuid not null,
  weekday smallint not null check (weekday between 0 and 6),
  open_min smallint not null check (open_min between 0 and 1439 and open_min % 30 = 0),
  close_min smallint not null check (close_min between 1 and 1440 and close_min % 30 = 0 and close_min > open_min),
  primary key (club_id, court_id, weekday),
  foreign key (club_id, court_id) references public.courts (club_id, id) on delete cascade
);
alter table public.court_schedules enable row level security;
revoke all on public.court_schedules from public, anon, authenticated;
grant select on public.court_schedules to anon, authenticated;
grant insert, delete on public.court_schedules to authenticated;
grant insert, delete on public.courts, public.activities, public.activity_categories, public.events to authenticated;
grant update (sport, display_name, description, surface, price_cents, active, duration_options_min) on public.courts to authenticated;
grant update (name,description,image_url,image_alt,data_target) on public.activities to authenticated;
grant update (type,client_first_name,client_last_name,client_phone,adults,kids,start_time,end_time,service_option,
  extra_hours,extra_staff,comments,deposit,status,calendar_data) on public.events to authenticated;

create policy schedules_public on public.court_schedules for select to anon, authenticated using (
  exists (select from public.courts c where c.club_id = court_schedules.club_id and c.id = court_id)
);
create policy schedules_admin on public.court_schedules for all to authenticated
  using (club_private.membership_role(club_id) = 'admin')
  with check (club_private.membership_role(club_id) = 'admin');

insert into public.court_schedules (club_id, court_id, weekday, open_min, close_min)
select c.club_id, c.id, h.weekday, h.opens, h.closes
from public.courts c join public.clubs cl on cl.id = c.club_id
cross join (values (0,540,1200), (1,480,1380), (2,480,1380), (3,480,1380), (4,480,1380), (5,480,1380), (6,540,1440))
  h(weekday, opens, closes)
where cl.slug = 'ranelagh' and c.name in ('futbol', 'paddle', 'squash', 'paleta');

create function public.save_club_court(p_club_id uuid, p_slug text, p_changes jsonb)
returns public.courts language plpgsql security invoker set search_path = ''
as $$
declare
  court public.courts%rowtype;
  durations integer[];
begin
  if club_private.membership_role(p_club_id) is distinct from 'admin' then
    raise exception 'Necesitás permisos de administrador.' using errcode = '42501';
  end if;
  if p_changes ? 'duration_options_min' then
    durations := array(select value::integer from jsonb_array_elements_text(p_changes->'duration_options_min') as values(value));
  end if;
  if p_slug is null then
    insert into public.courts (club_id, name, sport, display_name, surface, duration_options_min)
    values (p_club_id, p_changes->>'name', p_changes->>'sport', p_changes->>'display_name',
      p_changes->>'surface', coalesce(durations, array[60,90,120]))
    returning * into court;
  else
    update public.courts set
      sport = coalesce(p_changes->>'sport', sport),
      display_name = coalesce(p_changes->>'display_name', display_name),
      surface = case when p_changes ? 'surface' then p_changes->>'surface' else surface end,
      duration_options_min = coalesce(durations, duration_options_min)
    where club_id = p_club_id and name = p_slug returning * into court;
    if not found then raise exception 'Cancha no encontrada.' using errcode = 'P0002'; end if;
  end if;
  if p_changes ? 'hours' then
    delete from public.court_schedules where club_id = p_club_id and court_id = court.id;
    insert into public.court_schedules (club_id, court_id, weekday, open_min, close_min)
    select p_club_id, court.id, h.weekday, h.open_min, h.close_min
    from jsonb_to_recordset(p_changes->'hours') as h(weekday smallint, open_min smallint, close_min smallint);
  end if;
  return court;
end;
$$;

create function public.save_club_activity(p_club_id uuid, p_id uuid, p_changes jsonb, p_category jsonb)
returns public.activities language plpgsql security invoker set search_path = ''
as $$
declare activity public.activities%rowtype;
begin
  if club_private.membership_role(p_club_id) is distinct from 'admin' then
    raise exception 'Necesitás permisos de administrador.' using errcode = '42501';
  end if;
  if p_id is null then
    insert into public.activities (club_id, name, description, image_url, image_alt, data_target)
    values (p_club_id, p_changes->>'name', p_changes->>'description', p_changes->>'image_url',
      p_changes->>'image_alt', p_changes->>'data_target')
    returning * into activity;
  else
    update public.activities set
      name = coalesce(p_changes->>'name', name),
      description = coalesce(p_changes->>'description', description),
      image_url = coalesce(p_changes->>'image_url', image_url),
      image_alt = coalesce(p_changes->>'image_alt', image_alt)
    where club_id = p_club_id and id = p_id returning * into activity;
    if not found then raise exception 'Actividad no encontrada.' using errcode = 'P0002'; end if;
  end if;
  if p_category is not null then
    delete from public.activity_categories where club_id = p_club_id and activity_id = activity.id;
    insert into public.activity_categories (club_id, activity_id, name, age_range, days, schedule, display_order)
    select p_club_id, activity.id, c.name, c.age_range, c.days, c.schedule, c.display_order
    from jsonb_to_recordset(p_category) as c(name text, age_range text, days text, schedule text, display_order smallint);
  end if;
  return activity;
end;
$$;

create function club_private.book_court(p_club_id uuid, p_slug text, p_date date, p_start_min integer,
  p_duration_min integer, p_member_id uuid, p_permanent boolean)
returns public.reservations language plpgsql security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  actor_role public.user_role := club_private.membership_role(p_club_id);
  member uuid := coalesce(p_member_id, actor);
  member_status text;
  club public.clubs%rowtype;
  court public.courts%rowtype;
  hours public.court_schedules%rowtype;
  starts timestamptz;
  finishes timestamptz;
  slot public.reservations%rowtype;
  week_day smallint := extract(dow from p_date);
begin
  if actor_role is null or ((member <> actor or coalesce(p_permanent,false)) and actor_role <> 'admin') then
    raise exception 'No tenés permiso para crear esta reserva.' using errcode = '42501';
  end if;
  select * into club from public.clubs where id = p_club_id and published and booking_enabled;
  if not found then raise exception 'El club pausó las reservas.' using errcode = 'PT409'; end if;
  select status into member_status from public.club_memberships where club_id = p_club_id and user_id = member for update;
  if member_status is distinct from 'active' then raise exception 'La membresía no está activa.' using errcode = '42501'; end if;
  select * into court from public.courts where club_id = p_club_id and name = p_slug and active for share;
  if not found then raise exception 'Cancha no encontrada.' using errcode = 'P0002'; end if;
  select * into hours from public.court_schedules where club_id = p_club_id and court_id = court.id and weekday = week_day;
  if hours.open_min is null or p_start_min is null or p_duration_min is null
    or p_start_min not between 0 and 1439 or p_start_min % 30 <> 0
    or not (p_duration_min = any(court.duration_options_min))
    or p_start_min < hours.open_min or p_start_min + p_duration_min > hours.close_min then
    raise exception 'Elegí un turno dentro del horario y las duraciones disponibles.' using errcode = '22023';
  end if;
  starts := (p_date::timestamp + make_interval(mins => p_start_min)) at time zone club.timezone;
  finishes := (p_date::timestamp + make_interval(mins => p_start_min + p_duration_min)) at time zone club.timezone;
  if starts <= now() or p_date >= (now() at time zone club.timezone)::date + 14 then
    raise exception 'Elegí un turno futuro dentro de los próximos 14 días.' using errcode = '22023';
  end if;
  insert into public.reservations (club_id, court_id, user_id, weekday, reservation_date, start_time, end_time, permanent, created_by)
  values (p_club_id, court.id, member, week_day, p_date, starts, finishes, coalesce(p_permanent,false), actor)
  returning * into slot;
  return slot;
end;
$$;

create function public.book_club_court(p_club_id uuid, p_slug text, p_date date, p_start_min integer,
  p_duration_min integer, p_member_id uuid default null, p_permanent boolean default false)
returns public.reservations language sql security invoker set search_path = ''
as $$ select club_private.book_court(p_club_id, p_slug, p_date, p_start_min, p_duration_min, p_member_id, p_permanent) $$;

create function club_private.court_slots(p_club_id uuid, p_slug text, p_from date, p_days integer)
returns table (start_time timestamptz, end_time timestamptz, reservation_date date, weekday smallint,
  reservation_id uuid, member_id uuid, permanent boolean, mine boolean)
language plpgsql stable security definer set search_path = ''
as $$
declare
  court_id_value uuid;
  zone_id text;
  actor uuid := auth.uid();
  actor_role public.user_role := club_private.membership_role(p_club_id);
  start_date date;
begin
  if p_days is null or p_days not between 1 and 14 then
    raise exception 'Consultá entre 1 y 14 días.' using errcode = '22023';
  end if;
  select c.id, cl.timezone into court_id_value, zone_id
  from public.courts c join public.clubs cl on cl.id = c.club_id
  where c.club_id = p_club_id and c.name = p_slug and c.active and cl.published;
  if not found then raise exception 'Cancha no encontrada.' using errcode = 'P0002'; end if;
  start_date := coalesce(p_from, (now() at time zone zone_id)::date);
  return query
  select r.start_time, r.end_time, (r.start_time at time zone zone_id)::date,
    extract(dow from r.start_time at time zone zone_id)::smallint,
    case when actor_role = 'admin' or (actor_role is not null and r.user_id = actor) then r.id end,
    case when actor_role = 'admin' or (actor_role is not null and r.user_id = actor) then r.user_id end,
    r.permanent and coalesce(actor_role = 'admin' or (actor_role is not null and r.user_id = actor), false),
    actor_role is not null and coalesce(r.user_id = actor, false)
  from public.reservations r
  where r.club_id = p_club_id and r.court_id = court_id_value
    and r.end_time > (start_date::timestamp at time zone zone_id)
    and r.start_time < ((start_date + p_days)::timestamp at time zone zone_id)
  order by r.start_time;
end;
$$;

create function public.club_court_availability(p_club_id uuid, p_slug text, p_from date, p_days integer)
returns table (start_time timestamptz, end_time timestamptz, mine boolean)
language sql stable security invoker set search_path = ''
as $$ select start_time, end_time, mine from club_private.court_slots(p_club_id, p_slug, p_from, p_days) $$;

create function public.club_court_slots(p_club_id uuid, p_slug text, p_from date, p_days integer)
returns table (start_time timestamptz, end_time timestamptz, reservation_date date, weekday smallint,
  reservation_id uuid, member_id uuid, permanent boolean, mine boolean)
language sql stable security invoker set search_path = ''
as $$ select * from club_private.court_slots(p_club_id, p_slug, p_from, p_days) $$;

revoke all on function public.save_club_court(uuid, text, jsonb), public.save_club_activity(uuid, uuid, jsonb, jsonb),
  club_private.book_court(uuid, text, date, integer, integer, uuid, boolean),
  public.book_club_court(uuid, text, date, integer, integer, uuid, boolean),
  club_private.court_slots(uuid, text, date, integer), public.club_court_slots(uuid, text, date, integer),
  public.club_court_availability(uuid, text, date, integer) from public, anon, authenticated;
grant execute on function public.save_club_court(uuid, text, jsonb), public.save_club_activity(uuid, uuid, jsonb, jsonb),
  club_private.book_court(uuid, text, date, integer, integer, uuid, boolean),
  public.book_club_court(uuid, text, date, integer, integer, uuid, boolean),
  public.club_court_slots(uuid, text, date, integer) to authenticated;
grant usage on schema club_private to anon;
grant execute on function club_private.court_slots(uuid, text, date, integer),
  public.club_court_availability(uuid, text, date, integer) to anon, authenticated;
