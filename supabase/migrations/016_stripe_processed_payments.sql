-- Golden Spoon — Stripe Checkout idempotency
-- Run this entire file in the Supabase SQL Editor.
-- Additive only. Does not modify existing client financial columns.

create table if not exists public.stripe_processed_payments (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  client_id uuid not null references public.clients(id) on delete cascade,
  payment_type text not null,
  amount numeric(12, 2) not null,
  processed_at timestamptz not null default now(),
  constraint stripe_processed_payments_type_check
    check (payment_type in ('deposit', 'full')),
  constraint stripe_processed_payments_amount_positive
    check (amount > 0)
);

create index if not exists stripe_processed_payments_client_id_idx
  on public.stripe_processed_payments (client_id);

alter table public.stripe_processed_payments enable row level security;

revoke all on table public.stripe_processed_payments from public, anon, authenticated;

create or replace function public.apply_stripe_checkout_payment(
  p_session_id text,
  p_payment_intent_id text,
  p_client_id uuid,
  p_payment_type text,
  p_amount numeric
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
  current_client public.clients%rowtype;
  next_deposit numeric(12, 2);
  next_status text;
begin
  if p_session_id is null or length(trim(p_session_id)) = 0 then
    raise exception 'session id is required';
  end if;

  if p_client_id is null then
    raise exception 'client id is required';
  end if;

  if p_payment_type not in ('deposit', 'full') then
    raise exception 'invalid payment type';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'invalid amount';
  end if;

  insert into public.stripe_processed_payments (
    stripe_session_id,
    stripe_payment_intent_id,
    client_id,
    payment_type,
    amount
  ) values (
    trim(p_session_id),
    nullif(trim(p_payment_intent_id), ''),
    p_client_id,
    p_payment_type,
    round(p_amount, 2)
  )
  on conflict (stripe_session_id) do nothing
  returning id into inserted_id;

  if inserted_id is null then
    return jsonb_build_object('ok', true, 'duplicate', true);
  end if;

  select * into current_client
  from public.clients
  where id = p_client_id
  for update;

  if not found then
    raise exception 'client not found';
  end if;

  next_deposit := round(coalesce(current_client.deposit_paid, 0) + p_amount, 2);
  next_status := current_client.status;

  if current_client.status not in ('completed', 'cancelled') then
    if current_client.proposal_amount is not null
      and next_deposit >= current_client.proposal_amount then
      next_status := 'confirmed';
    elsif current_client.deposit_required is not null
      and next_deposit >= current_client.deposit_required then
      next_status := 'deposit_paid';
    end if;
  end if;

  update public.clients
  set
    deposit_paid = next_deposit,
    status = next_status,
    updated_at = now()
  where id = p_client_id;

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'deposit_paid', next_deposit,
    'status', next_status
  );
end;
$$;

revoke all on function public.apply_stripe_checkout_payment(
  text, text, uuid, text, numeric
) from public, anon, authenticated;

grant execute on function public.apply_stripe_checkout_payment(
  text, text, uuid, text, numeric
) to service_role;
