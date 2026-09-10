-- Golden Spoon — Real Events fields for Gallery CMS
-- Run this entire file in the Supabase SQL Editor.
-- Additive only. Does not drop, truncate, or rewrite existing Gallery rows.

-- ---------------------------------------------------------------------------
-- gallery_events
-- ---------------------------------------------------------------------------

alter table public.gallery_events
  add column if not exists date_label text;

alter table public.gallery_events
  add column if not exists client_venue text;

alter table public.gallery_events
  add column if not exists role text;

alter table public.gallery_events
  add column if not exists caption text;

alter table public.gallery_events
  add column if not exists experience text;

alter table public.gallery_events
  add column if not exists cover_photo_id uuid;

-- ---------------------------------------------------------------------------
-- gallery_event_photos
-- ---------------------------------------------------------------------------

alter table public.gallery_event_photos
  add column if not exists is_public boolean not null default true;

-- ---------------------------------------------------------------------------
-- Cover photo foreign key (safe if re-run)
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'gallery_events_cover_photo_id_fkey'
      and conrelid = 'public.gallery_events'::regclass
  ) then
    alter table public.gallery_events
      add constraint gallery_events_cover_photo_id_fkey
      foreign key (cover_photo_id)
      references public.gallery_event_photos(id)
      on delete set null;
  end if;
end
$$;
