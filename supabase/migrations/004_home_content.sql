-- Golden Spoon Phase 2B — Home page CMS
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.home_content (
  id text primary key default 'home',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint home_content_singleton check (id = 'home')
);

grant usage on schema public to anon, authenticated;
grant select on table public.home_content to anon, authenticated;
grant insert, update on table public.home_content to authenticated;

alter table public.home_content enable row level security;

drop policy if exists "Public can read home content" on public.home_content;
create policy "Public can read home content"
  on public.home_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert home content" on public.home_content;
create policy "Authenticated users can insert home content"
  on public.home_content
  for insert
  to authenticated
  with check (id = 'home');

drop policy if exists "Authenticated users can update home content" on public.home_content;
create policy "Authenticated users can update home content"
  on public.home_content
  for update
  to authenticated
  using (true)
  with check (id = 'home');
