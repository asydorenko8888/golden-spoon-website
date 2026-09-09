-- Golden Spoon — Event-based Gallery CMS
-- Run this entire file in the Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.gallery_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  location text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.gallery_events(id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_events_sort_order_idx
  on public.gallery_events (sort_order);

create index if not exists gallery_event_photos_event_id_idx
  on public.gallery_event_photos (event_id);

create index if not exists gallery_event_photos_event_sort_idx
  on public.gallery_event_photos (event_id, sort_order);

grant usage on schema public to anon, authenticated;
grant select on table public.gallery_events to anon, authenticated;
grant insert, update, delete on table public.gallery_events to authenticated;
grant select on table public.gallery_event_photos to anon, authenticated;
grant insert, update, delete on table public.gallery_event_photos to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.gallery_events enable row level security;
alter table public.gallery_event_photos enable row level security;

drop policy if exists "Public can read gallery events" on public.gallery_events;
create policy "Public can read gallery events"
  on public.gallery_events
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert gallery events" on public.gallery_events;
create policy "Authenticated users can insert gallery events"
  on public.gallery_events
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update gallery events" on public.gallery_events;
create policy "Authenticated users can update gallery events"
  on public.gallery_events
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete gallery events" on public.gallery_events;
create policy "Authenticated users can delete gallery events"
  on public.gallery_events
  for delete
  to authenticated
  using (true);

drop policy if exists "Public can read gallery event photos" on public.gallery_event_photos;
create policy "Public can read gallery event photos"
  on public.gallery_event_photos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert gallery event photos" on public.gallery_event_photos;
create policy "Authenticated users can insert gallery event photos"
  on public.gallery_event_photos
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update gallery event photos" on public.gallery_event_photos;
create policy "Authenticated users can update gallery event photos"
  on public.gallery_event_photos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete gallery event photos" on public.gallery_event_photos;
create policy "Authenticated users can delete gallery event photos"
  on public.gallery_event_photos
  for delete
  to authenticated
  using (true);
