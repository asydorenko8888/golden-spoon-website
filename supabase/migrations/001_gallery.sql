-- Golden Spoon Phase 2A — Gallery CMS
-- Run this entire file in the Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_sort_order_idx
  on public.gallery_images (sort_order);

grant usage on schema public to anon, authenticated;
grant select on table public.gallery_images to anon, authenticated;
grant insert, update, delete on table public.gallery_images to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.gallery_images enable row level security;

drop policy if exists "Public can read gallery images" on public.gallery_images;
create policy "Public can read gallery images"
  on public.gallery_images
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert gallery images" on public.gallery_images;
create policy "Authenticated users can insert gallery images"
  on public.gallery_images
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update gallery images" on public.gallery_images;
create policy "Authenticated users can update gallery images"
  on public.gallery_images
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete gallery images" on public.gallery_images;
create policy "Authenticated users can delete gallery images"
  on public.gallery_images
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read gallery files" on storage.objects;
create policy "Public can read gallery files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery');

drop policy if exists "Authenticated users can upload gallery files" on storage.objects;
create policy "Authenticated users can upload gallery files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery');

drop policy if exists "Authenticated users can update gallery files" on storage.objects;
create policy "Authenticated users can update gallery files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery')
  with check (bucket_id = 'gallery');

drop policy if exists "Authenticated users can delete gallery files" on storage.objects;
create policy "Authenticated users can delete gallery files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery');
