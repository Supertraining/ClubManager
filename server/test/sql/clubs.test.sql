\set ON_ERROR_STOP on
begin;

do $$
declare
  migrated_club_id uuid := (select id from public.clubs where slug = 'ranelagh');
begin
  if not exists (select from public.club_memberships where club_id = migrated_club_id
    and user_id = '10000000-0000-4000-8000-000000000001' and role = 'admin' and status = 'active') then
    raise exception 'The confirmed legacy administrator must retain access in Ranelagh';
  end if;
  if not exists (select from public.reservations where club_id = migrated_club_id
    and id = '20000000-0000-4000-8000-000000000001' and start_time = '2099-06-11 02:30:00+00') then
    raise exception 'The migrated reservation must keep its ID, club and original instant';
  end if;
  if not exists (select from public.activity_categories where club_id = migrated_club_id
    and id = '40000000-0000-4000-8000-000000000001') then
    raise exception 'The migration must scope existing activity categories';
  end if;
end;
$$;

insert into public.clubs (id, slug, name, signup_mode, published) values
  ('90000000-0000-4000-8000-000000000001', 'club-prueba', 'Club de prueba', 'invitation', true);

insert into public.club_memberships (club_id, user_id, role) values
  ('90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'socio'),
  ('90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'admin');

insert into public.courts (club_id, name, sport, display_name) values
  ('90000000-0000-4000-8000-000000000001', 'futbol', 'futbol', 'Cancha de prueba');

do $$
begin
  begin
    update public.activity_categories set club_id = '90000000-0000-4000-8000-000000000001'
    where id = '40000000-0000-4000-8000-000000000001';
    raise exception 'A category cannot reference an activity in another club';
  exception when foreign_key_violation then
    null;
  end;
end;
$$;

set local role authenticated;
set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000001';

do $$
begin
  if club_private.membership_role('90000000-0000-4000-8000-000000000001') is distinct from 'socio' then
    raise exception 'The Ranelagh administrator has the member role in the second club';
  end if;
  if has_table_privilege('authenticated', 'public.club_memberships', 'INSERT') then
    raise exception 'Membership enrollment must use its controlled operation';
  end if;
end;
$$;

reset role;
insert into auth.users (id, email, email_confirmed_at) values
  ('10000000-0000-4000-8000-000000000003', 'invited@example.test', now()),
  ('10000000-0000-4000-8000-000000000004', 'unconfirmed@example.test', null);

set local role authenticated;
set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000002';
select public.invite_club_member('90000000-0000-4000-8000-000000000001', 'Invited@example.test');
select public.invite_club_member('90000000-0000-4000-8000-000000000001', 'unconfirmed@example.test');

set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000004';
do $$
begin
  begin
    perform public.join_club('90000000-0000-4000-8000-000000000001');
    raise exception 'An unconfirmed account cannot join an invited club';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000003';
do $$
declare second_club uuid := '90000000-0000-4000-8000-000000000001';
begin
  if public.join_club(second_club) is distinct from 'socio' or public.join_club(second_club) is distinct from 'socio' then
    raise exception 'An accepted invitation must stay idempotent and grant only membership';
  end if;
end;
$$;

set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000002';
select public.suspend_club_member('90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003');

set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000003';
do $$
begin
  if club_private.membership_role('90000000-0000-4000-8000-000000000001') is not null then
    raise exception 'A suspended user must lose access immediately';
  end if;
end;
$$;

reset role;
insert into public.court_schedules (club_id, court_id, weekday, open_min, close_min)
select club_id, id, 6, 540, 1440 from public.courts
where club_id = '90000000-0000-4000-8000-000000000001' and name = 'futbol';

set local role authenticated;
set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000001';
do $$
declare
  legacy_club uuid := (select id from public.clubs where slug = 'ranelagh');
  second_club uuid := '90000000-0000-4000-8000-000000000001';
  next_saturday date := date_trunc('week', now() at time zone 'America/Argentina/Buenos_Aires')::date + 12;
  first_slot public.reservations%rowtype;
  second_slot public.reservations%rowtype;
begin
  first_slot := public.book_club_court(legacy_club, 'futbol', next_saturday, 1380, 60);
  second_slot := public.book_club_court(second_club, 'futbol', next_saturday, 1380, 60);
  if first_slot.court_id = second_slot.court_id or first_slot.end_time <> second_slot.end_time
    or first_slot.end_time at time zone 'America/Argentina/Buenos_Aires' <> (next_saturday + 1)::timestamp then
    raise exception 'Equal slugs can coexist and midnight must resolve to the next club-local date';
  end if;
  perform public.book_club_court(second_club, 'futbol', next_saturday, 1320, 60);
  begin
    perform public.book_club_court(second_club, 'futbol', next_saturday, 1350, 60);
    raise exception 'Overlapping slots on the same court must be rejected';
  exception when exclusion_violation then
    null;
  end;
  begin
    perform public.book_club_court(second_club, 'futbol', next_saturday + 1, 600, 60);
    raise exception 'Bookings on closed days must be rejected';
  exception when invalid_parameter_value then
    null;
  end;
  begin
    perform public.book_club_court(second_club, 'futbol', next_saturday, 600, 30);
    raise exception 'The booking duration must be enabled for the selected court';
  exception when invalid_parameter_value then
    null;
  end;
end;
$$;

reset role;
set local role anon;
set local "request.jwt.claim.sub" = '';
do $$
declare
  next_saturday date := date_trunc('week', now() at time zone 'America/Argentina/Buenos_Aires')::date + 12;
  occupancy jsonb;
begin
  select to_jsonb(slot) into occupancy from public.club_court_availability(
    '90000000-0000-4000-8000-000000000001', 'futbol', next_saturday, 1
  ) slot limit 1;
  if occupancy is null or occupancy - array['start_time', 'end_time', 'mine'] <> '{}'::jsonb
    or (occupancy->>'mine')::boolean then
    raise exception 'Public occupancy must omit reservation and member details';
  end if;
end;
$$;

rollback;
