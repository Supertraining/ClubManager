create function public.billing_create_draft(p_owner uuid, p_request uuid, p_name text, p_amount integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_slug text;
  prefix text;
  candidate text;
begin
  -- Share the lock with the original overload so retries keep their first link.
  perform pg_advisory_xact_lock(hashtextextended(p_owner::text || ':' || p_request::text, 0));
  select requested_slug into existing_slug from club_private.billing_contracts
    where owner_id = p_owner and request_id = p_request;
  if found then
    return public.billing_create_draft(p_owner, p_request, p_name, existing_slug, p_amount);
  end if;

  prefix := trim(both '-' from regexp_replace(
    translate(lower(normalize(p_name)), 'áàâäéèêëíìîïóòôöúùûüñç', 'aaaaeeeeiiiioooouuuunc'),
    '[^a-z0-9]+', '-', 'g'
  ));
  prefix := coalesce(nullif(prefix, ''), 'club');
  if prefix = 'archived' or prefix like 'archived-%' then prefix := 'club-' || prefix; end if;
  prefix := rtrim(left(prefix, 54), '-');

  for attempt in 1..5 loop
    candidate := prefix || '-' || left(gen_random_uuid()::text, 8);
    begin
      return public.billing_create_draft(p_owner, p_request, p_name, candidate, p_amount);
    exception when unique_violation then
      if attempt = 5 then raise; end if;
    end;
  end loop;
end;
$$;

revoke all on function public.billing_create_draft(uuid,uuid,text,integer)
  from public, anon, authenticated;
grant execute on function public.billing_create_draft(uuid,uuid,text,integer) to service_role;
