-- Golden Spoon — Clients CRM
-- Run this entire file in the Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  event_date date,
  event_type text,
  location text,
  guest_count integer,
  service_type text,
  estimated_budget text,
  message text,
  status text not null default 'new',
  internal_notes text,
  inquiry_source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_status_check check (
    status in (
      'new',
      'contacted',
      'proposal_sent',
      'deposit_paid',
      'confirmed',
      'completed',
      'cancelled'
    )
  )
);

create index if not exists clients_created_at_idx
  on public.clients (created_at desc);

create index if not exists clients_status_idx
  on public.clients (status);

create index if not exists clients_event_date_idx
  on public.clients (event_date);

create index if not exists clients_email_idx
  on public.clients (email);

-- Authenticated admins only. Do not grant table access to anon.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.clients to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.clients enable row level security;

drop policy if exists "Authenticated users can select clients" on public.clients;
create policy "Authenticated users can select clients"
  on public.clients
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert clients" on public.clients;
create policy "Authenticated users can insert clients"
  on public.clients
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update clients" on public.clients;
create policy "Authenticated users can update clients"
  on public.clients
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete clients" on public.clients;
create policy "Authenticated users can delete clients"
  on public.clients
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Server-side website inquiry write path
-- Anon cannot SELECT or INSERT on clients. The Contact API calls this
-- function after validation. Status and source cannot be overridden.
-- ---------------------------------------------------------------------------

create or replace function public.submit_website_inquiry(
  p_name text,
  p_email text default null,
  p_phone text default null,
  p_event_date date default null,
  p_event_type text default null,
  p_location text default null,
  p_guest_count integer default null,
  p_service_type text default null,
  p_estimated_budget text default null,
  p_message text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'name is required';
  end if;

  insert into public.clients (
    name,
    email,
    phone,
    event_date,
    event_type,
    location,
    guest_count,
    service_type,
    estimated_budget,
    message,
    status,
    inquiry_source
  ) values (
    trim(p_name),
    nullif(trim(p_email), ''),
    nullif(trim(p_phone), ''),
    p_event_date,
    nullif(trim(p_event_type), ''),
    nullif(trim(p_location), ''),
    p_guest_count,
    nullif(trim(p_service_type), ''),
    nullif(trim(p_estimated_budget), ''),
    nullif(trim(p_message), ''),
    'new',
    'website'
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_website_inquiry(
  text, text, text, date, text, text, integer, text, text, text
) from public;

grant execute on function public.submit_website_inquiry(
  text, text, text, date, text, text, integer, text, text, text
) to anon, authenticated;
