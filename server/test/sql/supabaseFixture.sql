-- For a fresh, disposable PostgreSQL cluster used by the SQL tests.
\set ON_ERROR_STOP on

do $$
begin
  if current_database() <> 'clubmanager_test' then
    raise exception 'Use a fresh local database named clubmanager_test';
  end if;
end;
$$;

create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema auth;
create table auth.users (
  id uuid primary key,
  email text,
  raw_user_meta_data jsonb,
  email_confirmed_at timestamptz
);

create function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

grant usage on schema auth to anon, authenticated, service_role;
