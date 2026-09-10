import { galleryPage } from "@/data/siteContent";
import {
  formatGalleryEventDate,
  normalizeGalleryEvents,
  publicEventPhotos,
} from "@/lib/gallery/events";
import { isMissingGalleryVideoColumnError } from "@/lib/gallery/eventMedia";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const EVENT_BASE_SELECT =
  "id, title, event_date, date_label, location, client_venue, role, caption, description, experience, sort_order, cover_photo_id";
const EVENT_VIDEO_SELECT = "video_url, video_poster_url";
const EVENT_PHOTOS_SELECT =
  "gallery_event_photos!event_id(id, image_url, alt_text, sort_order, is_public)";

function eventSelect(includeVideo) {
  return includeVideo
    ? `${EVENT_BASE_SELECT}, ${EVENT_VIDEO_SELECT}, ${EVENT_PHOTOS_SELECT}`
    : `${EVENT_BASE_SELECT}, ${EVENT_PHOTOS_SELECT}`;
}

function fallbackEvents() {
  return normalizeGalleryEvents(galleryPage.events);
}

function mapCmsEvents(rows = []) {
  return rows.map((event) => ({
    id: event.id,
    title: event.title ?? "",
    date: formatGalleryEventDate(event.event_date ?? ""),
    event_date: event.event_date ?? "",
    date_label: event.date_label ?? formatGalleryEventDate(event.event_date ?? ""),
    location: event.location ?? "",
    client_venue: event.client_venue ?? "",
    role: event.role ?? "",
    caption: event.caption ?? "",
    description: event.description ?? "",
    experience: event.experience ?? "",
    sort_order: event.sort_order ?? 0,
    cover_photo_id: event.cover_photo_id ?? null,
    photos: event.gallery_event_photos ?? [],
    video_url: event.video_url ?? "",
    video_poster_url: event.video_poster_url ?? "",
  }));
}

async function fetchCmsEvents() {
  if (!getSupabaseEnv()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const query = (includeVideo) =>
      supabase
        .from("gallery_events")
        .select(eventSelect(includeVideo))
        .order("event_date", { ascending: false, nullsFirst: false })
        .order("sort_order", {
          referencedTable: "gallery_event_photos",
          ascending: true,
        });

    let { data, error } = await query(true);
    if (error && isMissingGalleryVideoColumnError(error)) {
      ({ data, error } = await query(false));
    }

    if (error || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    return normalizeGalleryEvents(mapCmsEvents(data)).map((event) => {
      const photos = publicEventPhotos(event);
      const cover =
        photos.find((photo) => photo.id === event.cover_photo_id) ??
        photos[0] ??
        null;
      return {
        ...event,
        cover,
        cover_photo_id: cover?.id ?? null,
      };
    });
  } catch {
    return null;
  }
}

export async function getPublicGalleryEvents() {
  const events = await fetchCmsEvents();
  return events ?? fallbackEvents();
}

export async function getPublicGalleryEventById(id) {
  const events = (await fetchCmsEvents()) ?? fallbackEvents();
  const event = events.find((item) => String(item.id) === String(id));
  if (!event) return null;

  return {
    ...event,
    photos: publicEventPhotos(event),
  };
}
