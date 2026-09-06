-- Required follow-up: RLS policies exist, but Postgres still needs table grants.
-- Run this in the Supabase SQL Editor.

grant usage on schema public to anon, authenticated;
grant select on table public.gallery_images to anon, authenticated;
grant insert, update, delete on table public.gallery_images to authenticated;
