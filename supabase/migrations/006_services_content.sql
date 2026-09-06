-- Golden Spoon Phase 2D — Services page CMS
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.services_content (
  id text primary key default 'services',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint services_content_singleton check (id = 'services')
);

grant usage on schema public to anon, authenticated;
grant select on table public.services_content to anon, authenticated;
grant insert, update on table public.services_content to authenticated;

alter table public.services_content enable row level security;

drop policy if exists "Public can read services content" on public.services_content;
create policy "Public can read services content"
  on public.services_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert services content" on public.services_content;
create policy "Authenticated users can insert services content"
  on public.services_content
  for insert
  to authenticated
  with check (id = 'services');

drop policy if exists "Authenticated users can update services content" on public.services_content;
create policy "Authenticated users can update services content"
  on public.services_content
  for update
  to authenticated
  using (true)
  with check (id = 'services');
