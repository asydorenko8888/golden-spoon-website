-- Golden Spoon Phase 2F — FAQ page CMS
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.faq_content (
  id text primary key default 'faq',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint faq_content_singleton check (id = 'faq')
);

grant usage on schema public to anon, authenticated;
grant select on table public.faq_content to anon, authenticated;
grant insert, update on table public.faq_content to authenticated;

alter table public.faq_content enable row level security;

drop policy if exists "Public can read faq content" on public.faq_content;
create policy "Public can read faq content"
  on public.faq_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert faq content" on public.faq_content;
create policy "Authenticated users can insert faq content"
  on public.faq_content
  for insert
  to authenticated
  with check (id = 'faq');

drop policy if exists "Authenticated users can update faq content" on public.faq_content;
create policy "Authenticated users can update faq content"
  on public.faq_content
  for update
  to authenticated
  using (true)
  with check (id = 'faq');
