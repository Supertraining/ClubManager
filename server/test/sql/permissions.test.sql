-- Run only against the disposable database initialized by supabaseFixture.sql.
\set ON_ERROR_STOP on

begin;

-- Old Supabase projects can carry table- and column-level grants.
grant select, insert, update, delete on public.profiles to anon, authenticated;
grant update (role) on public.profiles to authenticated;
grant execute on function public.promote_to_admin(citext) to anon, authenticated;

\ir ../../supabase/02_rls.sql
\ir ../../supabase/03_rpc.sql

do $$
begin
  if has_table_privilege('anon', 'public.profiles', 'SELECT')
    or has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')
    or not has_column_privilege('authenticated', 'public.profiles', 'first_name', 'UPDATE') then
    raise exception 'Profiles must allow own contact updates and protect the role column';
  end if;
  if has_function_privilege('anon', 'public.promote_to_admin(citext)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.promote_to_admin(citext)', 'EXECUTE')
    or not has_function_privilege('service_role', 'public.promote_to_admin(citext)', 'EXECUTE') then
    raise exception 'Role promotion must be restricted to privileged operations';
  end if;
  if exists (
    select 1 from pg_proc
    where oid = 'public.get_court_reservations(uuid,timestamptz,timestamptz)'::regprocedure
      and prosecdef
  ) then
    raise exception 'The authenticated reservation RPC must respect RLS';
  end if;
end;
$$;

insert into auth.users (id, email, raw_user_meta_data) values (
  '10000000-0000-4000-8000-000000000001',
  'member@example.test',
  '{"first_name": "Nombre", "last_name": "Muestra", "age": 24, "role": "unused"}'
);

alter table auth.users disable trigger on_auth_user_created;
insert into auth.users (id, email, raw_user_meta_data) values (
  '10000000-0000-4000-8000-000000000002',
  'legacy@example.test',
  '{"first_name": " ", "age": "unknown", "role": "unused"}'
);
alter table auth.users enable trigger on_auth_user_created;

\ir ../../supabase/repair_missing_profiles.sql
\ir ../../supabase/repair_missing_profiles.sql

do $$
begin
  if not exists (
    select 1 from public.profiles
    where id = '10000000-0000-4000-8000-000000000002'
      and role = 'socio' and first_name = 'Socio' and age = 18
  ) then
    raise exception 'Profile repair must normalize missing fields without assigning privileges';
  end if;
end;
$$;

insert into public.reservations (court_id, user_id, weekday, reservation_date, start_time, end_time, created_by)
select id, '10000000-0000-4000-8000-000000000002', 2, '2030-01-01',
  '2030-01-01T19:00:00-03:00', '2030-01-01T20:00:00-03:00', '10000000-0000-4000-8000-000000000002'
from public.courts where name = 'futbol';

set local role authenticated;
set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000001';

update public.profiles set first_name = 'Actualizado' where id = auth.uid();

do $$
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'socio' and first_name = 'Actualizado'
  ) then
    raise exception 'Registration and own profile edits must preserve the member role';
  end if;
  if (select count(*) from public.profiles) <> 1 then
    raise exception 'A member must see only their own profile';
  end if;
  if exists (
    select 1 from public.get_court_reservations(
      (select id from public.courts where name = 'futbol'),
      '2030-01-01T00:00:00-03:00',
      '2030-01-02T00:00:00-03:00'
    )
  ) then
    raise exception 'The reservation RPC must limit the result to rows allowed by RLS';
  end if;
end;
$$;

reset role;

insert into auth.users (id, email) values (
  '10000000-0000-4000-8000-000000000003',
  'without-reservations@example.test'
);
delete from auth.users where id = '10000000-0000-4000-8000-000000000003';

do $$
begin
  if exists (select 1 from public.profiles where id = '10000000-0000-4000-8000-000000000003') then
    raise exception 'Removing an account without references must remove its profile';
  end if;
  begin
    delete from auth.users where id = '10000000-0000-4000-8000-000000000002';
    raise exception 'An account with reservations must remain linked to them';
  exception when foreign_key_violation then
    null;
  end;
end;
$$;

set local role service_role;
select public.promote_to_admin('LEGACY@EXAMPLE.TEST');

set local role authenticated;
set local "request.jwt.claim.sub" = '10000000-0000-4000-8000-000000000002';
update public.profiles set phone = '5550100'
where id = '10000000-0000-4000-8000-000000000001';

do $$
begin
  if not exists (
    select 1 from public.profiles
    where id = '10000000-0000-4000-8000-000000000001'
      and phone = '5550100' and role = 'socio'
  ) then
    raise exception 'An administrator must be able to edit a member phone without changing the role';
  end if;
end;
$$;

rollback;
