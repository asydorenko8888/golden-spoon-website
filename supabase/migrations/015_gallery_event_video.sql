-- Golden Spoon — Optional event video for Gallery CMS
-- Run this entire file in the Supabase SQL Editor after approval.
-- Additive only. Does not drop, rename, truncate, or rewrite existing Gallery data.

alter table public.gallery_events
  add column if not exists video_url text;

alter table public.gallery_events
  add column if not exists video_poster_url text;
