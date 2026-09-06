-- Golden Spoon Phase 2H — Global site settings CMS
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.site_settings (
  id text primary key default 'settings',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 'settings')
);

grant usage on schema public to anon, authenticated;
grant select on table public.site_settings to anon, authenticated;
grant insert, update on table public.site_settings to authenticated;

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert site settings" on public.site_settings;
create policy "Authenticated users can insert site settings"
  on public.site_settings
  for insert
  to authenticated
  with check (id = 'settings');

drop policy if exists "Authenticated users can update site settings" on public.site_settings;
create policy "Authenticated users can update site settings"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (id = 'settings');
