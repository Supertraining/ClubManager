-- Apply together with clubs_access.sql and club_operations.sql during the coordinated cutover.
create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) <= 63 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  timezone text not null default 'America/Argentina/Buenos_Aires',
  logo_url text check (logo_url is null or logo_url ~ '^https://[^[:space:]]+$'),
  cover_image_url text check (cover_image_url is null or cover_image_url ~ '^https://[^[:space:]]+$'),
  contact jsonb not null default '{}'::jsonb check (
    jsonb_typeof(contact) = 'object'
    and contact - array['address', 'whatsapp', 'instagram', 'facebook'] = '{}'::jsonb
    and (contact->>'instagram' is null or contact->>'instagram' ~ '^https://[^[:space:]]+$')
    and (contact->>'facebook' is null or contact->>'facebook' ~ '^https://[^[:space:]]+$')
  ),
  signup_mode text not null default 'invitation' check (signup_mode in ('open', 'invitation')),
  published boolean not null default false,
  booking_enabled boolean not null default true
);

create table public.club_memberships (
  club_id uuid not null references public.clubs (id) on delete restrict,
  user_id uuid not null references public.profiles (id) on delete restrict,
  role public.user_role not null default 'socio',
  status text not null default 'active' check (status in ('active', 'suspended')),
  member_first_name text check (char_length(member_first_name) between 1 and 80),
  member_last_name text check (char_length(member_last_name) between 1 and 80),
  member_age smallint check (member_age between 12 and 99),
  member_phone text check (char_length(member_phone) <= 80),
  primary key (club_id, user_id)
);
create index club_memberships_user_active_idx on public.club_memberships (user_id, club_id) where status = 'active';

alter table public.clubs enable row level security;
alter table public.club_memberships enable row level security;
revoke all on public.clubs, public.club_memberships from public, anon, authenticated;

insert into public.clubs (slug, name, contact, signup_mode, published)
values ('ranelagh', 'Club Ranelagh', jsonb_build_object(
  'address', 'Av. Dr. A. Sabin 1751, B1886 GBA',
  'whatsapp', '+54 9 11 3838-6877',
  'instagram', 'https://www.instagram.com/ranelagh.club/',
  'facebook', 'https://www.facebook.com/profile.php?id=100064211970969'
), 'open', true);

do $$
declare
  legacy_club uuid := (select id from public.clubs where slug = 'ranelagh');
  confirmed_roster text := nullif(current_setting('clubmanager.ranelagh_admin_ids', true), '');
  admin_ids uuid[] := coalesce(confirmed_roster, '{}')::uuid[];
begin
  if exists (
    select from auth.users u where u.email is not null
      and not exists (select from public.profiles p where p.id = u.id)
  ) then
    raise exception 'Reconcile missing Ranelagh profiles before migrating clubs';
  end if;
  if confirmed_roster is null and exists (select from public.profiles where role = 'admin') then
    raise exception 'Set clubmanager.ranelagh_admin_ids to the verified administrator UUID array for this transaction';
  end if;
  if exists (
    select from unnest(admin_ids) as approved(id)
    where not exists (select from public.profiles p where p.id = approved.id)
  ) then
    raise exception 'The verified administrator roster refers to an unknown profile';
  end if;

  insert into public.club_memberships (club_id, user_id, role)
  select legacy_club, id, case when id = any(admin_ids) then 'admin' else 'socio' end::public.user_role
  from public.profiles;
end;
$$;

alter table public.courts add column club_id uuid references public.clubs (id);
alter table public.activities add column club_id uuid references public.clubs (id);
alter table public.activity_categories add column club_id uuid references public.clubs (id);
alter table public.reservations add column club_id uuid references public.clubs (id);
alter table public.events add column club_id uuid references public.clubs (id);

update public.courts set club_id = (select id from public.clubs where slug = 'ranelagh');
update public.activities set club_id = (select id from public.clubs where slug = 'ranelagh');
update public.activity_categories ac set club_id = a.club_id from public.activities a where a.id = ac.activity_id;
update public.reservations r set club_id = c.club_id from public.courts c where c.id = r.court_id;
update public.events set club_id = (select id from public.clubs where slug = 'ranelagh');

alter table public.courts
  alter column club_id set not null,
  drop constraint courts_name_key,
  alter column name type text using name::text,
  add column sport text,
  add unique (club_id, name),
  add unique (club_id, id),
  add check (char_length(name) <= 63 and name ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
update public.courts set sport = name;
alter table public.courts alter column sport set not null;

alter table public.activities
  alter column club_id set not null,
  drop constraint activities_data_target_key,
  add unique (club_id, data_target),
  add unique (club_id, id);

alter table public.activity_categories
  alter column club_id set not null,
  drop constraint activity_categories_activity_id_fkey,
  add constraint category_club_activity_fkey
    foreign key (club_id, activity_id) references public.activities (club_id, id) on delete cascade;

alter table public.reservations
  alter column club_id set not null,
  drop constraint reservations_court_id_fkey,
  drop constraint reservations_user_id_fkey,
  drop constraint reservations_created_by_fkey,
  add constraint reservation_club_court_fkey
    foreign key (club_id, court_id) references public.courts (club_id, id) on delete restrict,
  add constraint reservation_club_member_fkey
    foreign key (club_id, user_id) references public.club_memberships (club_id, user_id) on delete restrict,
  add constraint reservation_club_actor_fkey
    foreign key (club_id, created_by) references public.club_memberships (club_id, user_id) on delete restrict;

alter table public.events
  alter column club_id set not null,
  drop constraint events_created_by_fkey,
  add constraint event_club_actor_fkey
    foreign key (club_id, created_by) references public.club_memberships (club_id, user_id) on delete restrict;

create index reservations_club_member_end_idx on public.reservations (club_id, user_id, end_time);
create index events_club_start_idx on public.events (club_id, start_time);
