-- Golden Spoon Phase 2G — Contact page CMS
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.contact_content (
  id text primary key default 'contact',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint contact_content_singleton check (id = 'contact')
);

grant usage on schema public to anon, authenticated;
grant select on table public.contact_content to anon, authenticated;
grant insert, update on table public.contact_content to authenticated;

alter table public.contact_content enable row level security;

drop policy if exists "Public can read contact content" on public.contact_content;
create policy "Public can read contact content"
  on public.contact_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert contact content" on public.contact_content;
create policy "Authenticated users can insert contact content"
  on public.contact_content
  for insert
  to authenticated
  with check (id = 'contact');

drop policy if exists "Authenticated users can update contact content" on public.contact_content;
create policy "Authenticated users can update contact content"
  on public.contact_content
  for update
  to authenticated
  using (true)
  with check (id = 'contact');
