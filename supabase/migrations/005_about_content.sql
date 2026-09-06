-- Golden Spoon Phase 2C — About page CMS
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.about_content (
  id text primary key default 'about',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint about_content_singleton check (id = 'about')
);

grant usage on schema public to anon, authenticated;
grant select on table public.about_content to anon, authenticated;
grant insert, update on table public.about_content to authenticated;

alter table public.about_content enable row level security;

drop policy if exists "Public can read about content" on public.about_content;
create policy "Public can read about content"
  on public.about_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert about content" on public.about_content;
create policy "Authenticated users can insert about content"
  on public.about_content
  for insert
  to authenticated
  with check (id = 'about');

drop policy if exists "Authenticated users can update about content" on public.about_content;
create policy "Authenticated users can update about content"
  on public.about_content
  for update
  to authenticated
  using (true)
  with check (id = 'about');
