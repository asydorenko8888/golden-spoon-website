-- Golden Spoon — Clients CRM financial fields
-- Run this entire file in the Supabase SQL Editor.
-- Additive only. Does not drop, truncate, or modify existing client rows
-- beyond adding new nullable/defaulted columns.

-- ---------------------------------------------------------------------------
-- Stored (admin-editable) columns
-- ---------------------------------------------------------------------------

alter table public.clients
  add column if not exists proposal_amount numeric(12, 2);

alter table public.clients
  add column if not exists deposit_paid numeric(12, 2) not null default 0;

alter table public.clients
  add column if not exists payment_date date;

alter table public.clients
  add column if not exists payment_notes text;

-- ---------------------------------------------------------------------------
-- Derived columns (not manually entered)
-- ---------------------------------------------------------------------------

alter table public.clients
  add column if not exists deposit_required numeric(12, 2)
    generated always as (
      case
        when proposal_amount is null then null
        else round(proposal_amount * 0.50, 2)
      end
    ) stored;

alter table public.clients
  add column if not exists balance_due numeric(12, 2)
    generated always as (
      greatest(coalesce(proposal_amount, 0) - coalesce(deposit_paid, 0), 0)
    ) stored;

alter table public.clients
  add column if not exists payment_status text
    generated always as (
      case
        when coalesce(deposit_paid, 0) <= 0 then 'not_paid'
        when proposal_amount is null or deposit_paid < proposal_amount then 'deposit_paid'
        else 'paid_in_full'
      end
    ) stored;

-- ---------------------------------------------------------------------------
-- Guards (safe to re-run)
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'clients_proposal_amount_nonnegative'
      and conrelid = 'public.clients'::regclass
  ) then
    alter table public.clients
      add constraint clients_proposal_amount_nonnegative
      check (proposal_amount is null or proposal_amount >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'clients_deposit_paid_nonnegative'
      and conrelid = 'public.clients'::regclass
  ) then
    alter table public.clients
      add constraint clients_deposit_paid_nonnegative
      check (deposit_paid >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'clients_payment_status_check'
      and conrelid = 'public.clients'::regclass
  ) then
    alter table public.clients
      add constraint clients_payment_status_check
      check (
        payment_status in ('not_paid', 'deposit_paid', 'paid_in_full')
      );
  end if;
end
$$;
