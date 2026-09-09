import { galleryPage } from "@/data/siteContent";
import {
  formatGalleryEventDate,
  normalizeGalleryEvents,
} from "@/lib/gallery/events";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function fallbackEvents() {
  return normalizeGalleryEvents(galleryPage.events);
}

function mapCmsEvents(rows = []) {
  return rows.map((event) => ({
    id: event.id,
    title: event.title ?? "",
    date: formatGalleryEventDate(event.event_date ?? ""),
    location: event.location ?? "",
    description: event.description ?? "",
    sort_order: event.sort_order ?? 0,
    photos: event.gallery_event_photos ?? [],
  }));
}

export async function getPublicGalleryEvents() {
  if (!getSupabaseEnv()) {
    return fallbackEvents();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_events")
      .select(
        "id, title, event_date, location, description, sort_order, gallery_event_photos!event_id(id, image_url, alt_text, sort_order)",
      )
      .order("sort_order", { ascending: true })
      .order("sort_order", {
        referencedTable: "gallery_event_photos",
        ascending: true,
      });

    if (error || !Array.isArray(data) || data.length === 0) {
      return fallbackEvents();
    }

    return normalizeGalleryEvents(mapCmsEvents(data));
  } catch {
    return fallbackEvents();
  }
}
