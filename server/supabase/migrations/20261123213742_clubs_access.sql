create schema club_private;
revoke all on schema club_private from public, anon, authenticated;
grant usage on schema club_private to authenticated;

create table club_private.invitations (
  club_id uuid not null references public.clubs (id) on delete cascade,
  email text not null check (email = lower(btrim(email)) and char_length(email) <= 254),
  expires_at timestamptz not null,
  primary key (club_id, email)
);
alter table club_private.invitations enable row level security;

create function club_private.membership_role(target_club uuid)
returns public.user_role
language sql stable security definer set search_path = ''
as $$
  select m.role
  from public.club_memberships m join public.clubs c on c.id = m.club_id
  where m.club_id = target_club and m.user_id = (select auth.uid())
    and m.status = 'active' and c.published;
$$;

create function club_private.admin_can_read_profile(target_user uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select from public.club_memberships m
    where m.user_id = target_user and m.status = 'active'
      and club_private.membership_role(m.club_id) = 'admin'
  );
$$;

revoke all on function club_private.membership_role(uuid), club_private.admin_can_read_profile(uuid)
  from public, anon, authenticated;
grant execute on function club_private.membership_role(uuid), club_private.admin_can_read_profile(uuid) to authenticated;

-- Replace the single-club policies in the same transaction as the scope change.
do $$
declare p record;
begin
  for p in select tablename, policyname from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'courts', 'reservations', 'activities', 'activity_categories', 'events')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end;
$$;

revoke all on public.courts, public.reservations, public.activities, public.activity_categories, public.events
  from public, anon, authenticated;
grant select on public.clubs, public.courts, public.activities, public.activity_categories to anon, authenticated;
grant select on public.club_memberships, public.reservations, public.events to authenticated;
grant select on public.clubs, public.club_memberships to service_role;
grant update (name, logo_url, cover_image_url, contact, signup_mode) on public.clubs to authenticated;
grant update (member_first_name, member_last_name, member_age, member_phone) on public.club_memberships to authenticated;
grant delete on public.reservations to authenticated;

create policy clubs_public on public.clubs for select to anon, authenticated using (published);
create policy clubs_edit on public.clubs for update to authenticated
  using (club_private.membership_role(id) = 'admin')
  with check (club_private.membership_role(id) = 'admin');

create policy memberships_read on public.club_memberships for select to authenticated
  using (user_id = (select auth.uid()) or (status = 'active' and club_private.membership_role(club_id) = 'admin'));
create policy memberships_edit on public.club_memberships for update to authenticated
  using (status = 'active' and club_private.membership_role(club_id) = 'admin')
  with check (status = 'active' and club_private.membership_role(club_id) = 'admin');

create policy profiles_read on public.profiles for select to authenticated
  using (id = (select auth.uid()) or club_private.admin_can_read_profile(id));
create policy profiles_edit on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy courts_public on public.courts for select to anon, authenticated
  using (active and exists (select from public.clubs c where c.id = club_id and c.published));
create policy courts_admin on public.courts for all to authenticated
  using (club_private.membership_role(club_id) = 'admin')
  with check (club_private.membership_role(club_id) = 'admin');

create policy activities_public on public.activities for select to anon, authenticated
  using (exists (select from public.clubs c where c.id = club_id and c.published));
create policy activities_admin on public.activities for all to authenticated
  using (club_private.membership_role(club_id) = 'admin')
  with check (club_private.membership_role(club_id) = 'admin');
create policy categories_public on public.activity_categories for select to anon, authenticated
  using (exists (select from public.clubs c where c.id = club_id and c.published));
create policy categories_admin on public.activity_categories for all to authenticated
  using (club_private.membership_role(club_id) = 'admin')
  with check (club_private.membership_role(club_id) = 'admin');

create policy events_admin on public.events for all to authenticated
  using (club_private.membership_role(club_id) = 'admin')
  with check (club_private.membership_role(club_id) = 'admin');

create policy reservations_read on public.reservations for select to authenticated
  using (club_private.membership_role(club_id) = 'admin'
    or (user_id = (select auth.uid()) and club_private.membership_role(club_id) is not null));
create policy reservations_cancel on public.reservations for delete to authenticated
  using (club_private.membership_role(club_id) = 'admin'
    or (user_id = (select auth.uid()) and club_private.membership_role(club_id) is not null));

revoke execute on function public.search_profiles(text, integer),
  public.get_court_reservations(uuid, timestamptz, timestamptz),
  public.create_reservation(uuid, timestamptz, timestamptz, boolean, jsonb)
  from public, anon, authenticated;

create function club_private.join_club(target_club uuid)
returns public.user_role
language plpgsql security definer set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  actor_email text;
  mode text;
  membership public.club_memberships%rowtype;
begin
  select lower(btrim(u.email)) into actor_email from auth.users u
    where u.id = actor and u.email_confirmed_at is not null;
  if actor_email is null then
    raise exception 'Confirmá tu correo antes de sumarte al club.' using errcode = '42501';
  end if;

  select signup_mode into mode from public.clubs where id = target_club and published;
  if not found then raise exception 'Club no encontrado.' using errcode = 'P0002'; end if;

  select * into membership from public.club_memberships
    where club_id = target_club and user_id = actor;
  if found then
    if membership.status = 'active' then return membership.role; end if;
    raise exception 'Tu membresía está suspendida. Contactá al club.' using errcode = '42501';
  end if;

  if mode = 'invitation' and not exists (
    select from club_private.invitations where club_id = target_club and email = actor_email and expires_at > now()
  ) then
    raise exception 'Pedile al club una invitación para este correo.' using errcode = '42501';
  end if;

  insert into public.club_memberships (club_id, user_id) values (target_club, actor)
    on conflict (club_id, user_id) do nothing;
  select * into membership from public.club_memberships
    where club_id = target_club and user_id = actor;
  if membership.status = 'suspended' then
    raise exception 'Tu membresía está suspendida. Contactá al club.' using errcode = '42501';
  end if;
  delete from club_private.invitations where club_id = target_club and email = actor_email;
  return membership.role;
end;
$$;

create function club_private.invite_club_member(target_club uuid, invite_email text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if club_private.membership_role(target_club) is distinct from 'admin' then
    raise exception 'Necesitás permisos de administrador.' using errcode = '42501';
  end if;
  if invite_email is null or length(invite_email) > 254 or btrim(invite_email) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Ingresá un correo válido.' using errcode = '22023';
  end if;
  insert into club_private.invitations (club_id, email, expires_at)
  values (target_club, lower(btrim(invite_email)), now() + interval '7 days')
  on conflict (club_id, email) do update set expires_at = excluded.expires_at;
end;
$$;

create function club_private.suspend_club_member(target_club uuid, target_user uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare target_role public.user_role;
begin
  if club_private.membership_role(target_club) is distinct from 'admin' then
    raise exception 'Necesitás permisos de administrador.' using errcode = '42501';
  end if;
  select role into target_role from public.club_memberships
    where club_id = target_club and user_id = target_user for update;
  if not found then raise exception 'Socio no encontrado.' using errcode = 'P0002'; end if;
  if target_role = 'admin' then
    raise exception 'Contactá a soporte para cambiar el acceso de un administrador.' using errcode = '42501';
  end if;
  if exists (select from public.reservations where club_id = target_club and user_id = target_user and end_time > now()) then
    raise exception 'Cancelá las reservas futuras antes de dar de baja al socio.' using errcode = 'PT409';
  end if;
  update public.club_memberships set status = 'suspended' where club_id = target_club and user_id = target_user;
end;
$$;

create function public.join_club(p_club_id uuid) returns public.user_role
language sql security invoker set search_path = ''
as $$ select club_private.join_club(p_club_id) $$;
create function public.invite_club_member(p_club_id uuid, p_email text) returns void
language sql security invoker set search_path = ''
as $$ select club_private.invite_club_member(p_club_id, p_email) $$;
create function public.suspend_club_member(p_club_id uuid, p_user_id uuid) returns void
language sql security invoker set search_path = ''
as $$ select club_private.suspend_club_member(p_club_id, p_user_id) $$;

revoke all on function club_private.join_club(uuid), club_private.invite_club_member(uuid, text),
  club_private.suspend_club_member(uuid, uuid), public.join_club(uuid),
  public.invite_club_member(uuid, text), public.suspend_club_member(uuid, uuid)
  from public, anon, authenticated;
grant execute on function club_private.join_club(uuid), club_private.invite_club_member(uuid, text),
  club_private.suspend_club_member(uuid, uuid), public.join_club(uuid),
  public.invite_club_member(uuid, text), public.suspend_club_member(uuid, uuid)
  to authenticated;
