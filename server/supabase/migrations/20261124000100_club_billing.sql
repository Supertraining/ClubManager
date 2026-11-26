alter table public.clubs add column billing_required boolean not null default false;
alter table public.clubs add column paid_through timestamptz;

create table club_private.billing_contracts (
  club_id uuid primary key references public.clubs(id),
  owner_id uuid not null,
  request_id uuid not null,
  requested_slug text not null,
  requested_name text not null,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null check (currency = 'ARS'),
  created_at timestamptz not null default now(),
  checkout_reference uuid unique,
  cancelled_at timestamptz,
  expired_at timestamptz,
  unique (owner_id, request_id),
  foreign key (club_id, owner_id) references public.club_memberships(club_id, user_id)
);

create table club_private.billing_simulated_payments (
  id uuid primary key,
  club_id uuid not null references club_private.billing_contracts(club_id),
  paid_at timestamptz not null default now()
);

alter table club_private.billing_contracts enable row level security;
alter table club_private.billing_simulated_payments enable row level security;

create function club_private.billing_view(contract club_private.billing_contracts)
returns jsonb language sql stable set search_path = ''
as $$
  select jsonb_build_object(
    'clubId', c.id, 'slug', contract.requested_slug, 'name', c.name,
    'status', case when contract.expired_at is not null then 'expired'
      when contract.cancelled_at is not null then 'cancelled'
      when c.paid_through > now() then 'active'
      when c.published then 'past_due'
      else 'pending' end,
    'checkoutReady', contract.checkout_reference is not null,
    'paidThrough', c.paid_through,
    'amountMinor', contract.amount_minor, 'currency', contract.currency
  ) from public.clubs c where c.id = contract.club_id
$$;

create function public.billing_create_draft(p_owner uuid, p_request uuid, p_name text, p_slug text, p_amount integer)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  contract club_private.billing_contracts;
  target uuid;
begin
  if not exists (select from auth.users where id = p_owner and email_confirmed_at is not null) then
    raise exception 'Confirmá tu correo antes de crear el club.' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_owner::text || ':' || p_request::text, 0));
  select * into contract from club_private.billing_contracts where owner_id = p_owner and request_id = p_request;
  if found then
    if contract.requested_slug <> p_slug or contract.requested_name <> p_name then
      raise exception 'La solicitud ya tiene otros datos.' using errcode = 'PT409';
    end if;
    return club_private.billing_view(contract);
  end if;
  if p_slug like 'archived-%' then raise exception 'Elegí otro identificador.' using errcode = '22023'; end if;

  -- An untouched draft can release its slug. Once checkout starts, the slug is retained.
  update club_private.billing_contracts
    set expired_at = now()
    where requested_slug = p_slug and checkout_reference is null and cancelled_at is null
      and expired_at is null and created_at <= now() - interval '7 days'
    returning club_id into target;
  if target is not null then
    update public.clubs set slug = 'archived-' || target where id = target;
  end if;

  insert into public.clubs (name, slug, published, booking_enabled, billing_required)
    values (p_name, p_slug, false, false, true) returning id into target;
  insert into public.club_memberships (club_id, user_id, role) values (target, p_owner, 'admin');
  insert into club_private.billing_contracts (club_id, owner_id, request_id, requested_slug, requested_name, amount_minor, currency)
    values (target, p_owner, p_request, p_slug, p_name, p_amount, 'ARS') returning * into contract;
  return club_private.billing_view(contract);
end;
$$;

create function public.billing_read(p_owner uuid, p_club uuid default null)
returns jsonb language sql stable security definer set search_path = ''
as $$
  select coalesce(jsonb_agg(club_private.billing_view(b) order by b.created_at desc), '[]'::jsonb)
  from club_private.billing_contracts b where b.owner_id = p_owner and (p_club is null or b.club_id = p_club)
$$;

create function public.billing_action(p_owner uuid, p_club uuid, p_action text, p_payment uuid default null)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  contract club_private.billing_contracts;
  recorded uuid;
begin
  select * into contract from club_private.billing_contracts
    where club_id = p_club and owner_id = p_owner for update;
  if not found then raise exception 'Contratación no encontrada.' using errcode = 'P0002'; end if;
  if contract.expired_at is not null then raise exception 'El borrador venció.' using errcode = 'PT409'; end if;

  case p_action
    when 'checkout' then
      if contract.cancelled_at is not null then raise exception 'La contratación está cancelada.' using errcode = 'PT409'; end if;
      if contract.checkout_reference is null and contract.created_at <= now() - interval '7 days' then
        raise exception 'El borrador venció. Creá un alta nueva.' using errcode = 'PT409';
      end if;
      update club_private.billing_contracts set checkout_reference = coalesce(checkout_reference, gen_random_uuid())
        where club_id = p_club returning * into contract;
    when 'cancel' then
      update club_private.billing_contracts set cancelled_at = coalesce(cancelled_at, now())
        where club_id = p_club returning * into contract;
    when 'simulate_payment' then
      if exists (select from club_private.billing_simulated_payments where id = p_payment and club_id = p_club) then
        return club_private.billing_view(contract);
      end if;
      if p_payment is null or contract.checkout_reference is null or contract.cancelled_at is not null then
        raise exception 'No hay un checkout disponible para pagar.' using errcode = 'PT409';
      end if;
      insert into club_private.billing_simulated_payments (id, club_id) values (p_payment, p_club)
        on conflict (id) do nothing returning id into recorded;
      if recorded is null then raise exception 'El pago pertenece a otra contratación.' using errcode = 'PT409'; end if;
      update public.clubs
        set published = true, booking_enabled = true, paid_through = greatest(now(), paid_through) + interval '1 month'
        where id = p_club;
    else
      raise exception 'Operación inválida.' using errcode = '22023';
  end case;
  return club_private.billing_view(contract);
end;
$$;

revoke all on function public.billing_create_draft(uuid,uuid,text,text,integer),
  public.billing_read(uuid,uuid), public.billing_action(uuid,uuid,text,uuid),
  club_private.billing_view(club_private.billing_contracts) from public, anon, authenticated;
grant execute on function public.billing_create_draft(uuid,uuid,text,text,integer),
  public.billing_read(uuid,uuid), public.billing_action(uuid,uuid,text,uuid) to service_role;

create function club_private.club_can_write(p_club uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select from public.clubs where id = p_club and published
    and (not billing_required or paid_through > now()))
$$;
revoke all on function club_private.club_can_write(uuid) from public, anon, authenticated;
grant execute on function club_private.club_can_write(uuid) to authenticated;

create policy clubs_billing_update on public.clubs as restrictive for update to authenticated
  using (club_private.club_can_write(id)) with check (club_private.club_can_write(id));

do $$
declare relation text;
begin
  foreach relation in array array['courts','court_schedules','activities','activity_categories','events','club_memberships']
  loop
    execute format('create policy billing_insert on public.%I as restrictive for insert to authenticated with check (club_private.club_can_write(club_id))', relation);
    execute format('create policy billing_update on public.%I as restrictive for update to authenticated using (club_private.club_can_write(club_id)) with check (club_private.club_can_write(club_id))', relation);
    execute format('create policy billing_delete on public.%I as restrictive for delete to authenticated using (club_private.club_can_write(club_id))', relation);
  end loop;
end;
$$;

create function club_private.check_booking_coverage()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if not club_private.club_can_write(new.club_id) then
    raise exception 'El club no tiene un período abonado vigente.' using errcode = 'PT409';
  end if;
  return new;
end;
$$;
revoke all on function club_private.check_booking_coverage() from public, anon, authenticated;
create trigger reservations_require_coverage before insert or update on public.reservations
  for each row execute function club_private.check_booking_coverage();

create policy reservations_billing_delete on public.reservations as restrictive for delete to authenticated
  using (start_time > now() or club_private.club_can_write(club_id));

create trigger invitations_require_coverage before insert or update on club_private.invitations
  for each row execute function club_private.check_booking_coverage();

-- Private functions are also callable by the authenticated role through SQL.
-- Apply coverage to their writes even when a caller does not use the public wrapper.
create function club_private.check_membership_coverage()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if not club_private.club_can_write(new.club_id) and
    not (tg_op = 'INSERT' and new.role = 'admin' and exists (
      select from public.clubs where id = new.club_id and billing_required and not published
    )) then
    raise exception 'El club no tiene un período abonado vigente.' using errcode = 'PT409';
  end if;
  return new;
end;
$$;
revoke all on function club_private.check_membership_coverage() from public, anon, authenticated;
create trigger memberships_require_coverage before insert or update on public.club_memberships
  for each row execute function club_private.check_membership_coverage();
