-- Optional per-slot replacement of the designed public Gallery photos.
-- Run in the Supabase SQL Editor.

alter table public.gallery_images
  add column if not exists slot text;

create unique index if not exists gallery_images_slot_key
  on public.gallery_images (slot)
  where slot is not null;
