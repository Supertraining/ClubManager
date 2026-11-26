\set ON_ERROR_STOP on
begin;

do $$
declare
  owner uuid := '10000000-0000-4000-8000-000000000001';
  other_user uuid := '10000000-0000-4000-8000-000000000002';
  request_id uuid := gen_random_uuid();
  payment_id uuid := gen_random_uuid();
  draft jsonb;
  initial jsonb;
  duplicate jsonb;
  renewed jsonb;
  cancelled jsonb;
  club uuid;
  other_draft jsonb;
begin
  if has_function_privilege('authenticated', 'public.billing_action(uuid,uuid,text,uuid)', 'execute') then
    raise exception 'Billing mutations must not be granted directly to browser roles';
  end if;
  draft := public.billing_create_draft(owner, request_id, 'Club de facturación', 123400);
  club := (draft->>'clubId')::uuid;
  other_draft := public.billing_create_draft(owner, gen_random_uuid(), 'Club de facturación', 123400);
  if draft->>'slug' !~ '^club-de-facturacion-[0-9a-f]{8}$'
    or draft->>'slug' = other_draft->>'slug'
    or draft <> public.billing_create_draft(owner, request_id, 'Club de facturación', 123400)
    or draft->>'status' <> 'pending'
    or exists (select from public.clubs where id = club and published) then
    raise exception 'Draft must be idempotent and unpublished';
  end if;
  if public.billing_read(other_user, club) <> '[]'::jsonb then
    raise exception 'Contracts belong to the original owner';
  end if;
  begin
    perform public.billing_action(other_user, club, 'checkout');
    raise exception 'Another member cannot start checkout';
  exception when no_data_found then null;
  end;

  perform public.billing_action(owner, club, 'checkout');
  if public.billing_action(owner, club, 'checkout')->>'checkoutReady' <> 'true' then
    raise exception 'Checkout must remain recoverable';
  end if;
  initial := public.billing_action(owner, club, 'simulate_payment', payment_id);
  duplicate := public.billing_action(owner, club, 'simulate_payment', payment_id);
  renewed := public.billing_action(owner, club, 'simulate_payment', gen_random_uuid());
  if initial->>'status' <> 'active' or duplicate->>'paidThrough' <> initial->>'paidThrough'
    or (renewed->>'paidThrough')::timestamptz <= (initial->>'paidThrough')::timestamptz
    or not club_private.club_can_write(club) then
    raise exception 'A unique payment must extend coverage exactly once';
  end if;
  cancelled := public.billing_action(owner, club, 'cancel');
  if cancelled->>'status' <> 'cancelled' or cancelled->>'paidThrough' <> renewed->>'paidThrough' then
    raise exception 'Cancellation must preserve the paid period';
  end if;
  update public.clubs set paid_through = now() - interval '1 day' where id = club;
  if club_private.club_can_write(club) or not exists (select from public.clubs where id = club and published) then
    raise exception 'An expired club must remain published in read-only mode';
  end if;
end;
$$;

rollback;
