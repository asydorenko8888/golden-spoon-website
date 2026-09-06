-- Golden Spoon Phase 2E — Menus page CMS
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.menus_content (
  id text primary key default 'menus',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint menus_content_singleton check (id = 'menus')
);

grant usage on schema public to anon, authenticated;
grant select on table public.menus_content to anon, authenticated;
grant insert, update on table public.menus_content to authenticated;

alter table public.menus_content enable row level security;

drop policy if exists "Public can read menus content" on public.menus_content;
create policy "Public can read menus content"
  on public.menus_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert menus content" on public.menus_content;
create policy "Authenticated users can insert menus content"
  on public.menus_content
  for insert
  to authenticated
  with check (id = 'menus');

drop policy if exists "Authenticated users can update menus content" on public.menus_content;
create policy "Authenticated users can update menus content"
  on public.menus_content
  for update
  to authenticated
  using (true)
  with check (id = 'menus');
