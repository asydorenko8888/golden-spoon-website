import { getEventPresentation } from "@/lib/gallery/eventPresentation";

function galleryEventDateKey(event) {
  const iso = typeof event.event_date === "string" ? event.event_date.trim() : "";
  if (/^\d{4}-\d{2}-\d{2}/.test(iso)) {
    return iso.slice(0, 10);
  }

  const parsed = Date.parse(event.date || event.date_label || "");
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }

  return "";
}

function compareEventsByDateDesc(a, b) {
  const byDate = galleryEventDateKey(b).localeCompare(galleryEventDateKey(a));
  if (byDate !== 0) return byDate;
  return String(a.title || "").localeCompare(String(b.title || ""));
}

export function normalizeGalleryEvents(events = []) {
  return [...events]
    .filter((event) => event && typeof event === "object")
    .sort(compareEventsByDateDesc)
    .map((event) => {
      const photos = [...(event.photos ?? [])]
        .filter((photo) => photo && photo.image_url)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((photo) => ({
          id: photo.id,
          image_url: photo.image_url,
          alt_text: photo.alt_text ?? "",
          sort_order: photo.sort_order ?? 0,
          is_public: photo.is_public !== false,
        }));

      const cover =
        photos.find((photo) => photo.id === event.cover_photo_id) ?? photos[0] ?? null;

      return {
        id: event.id,
        title: event.title ?? "",
        date: event.date ?? "",
        event_date: event.event_date ?? "",
        date_label: event.date_label ?? event.date ?? "",
        location: event.location ?? "",
        client_venue: event.client_venue ?? "",
        role: event.role ?? "",
        caption: event.caption ?? "",
        description: event.description ?? "",
        experience: event.experience ?? "",
        sort_order: event.sort_order ?? 0,
        cover_photo_id: cover?.id ?? event.cover_photo_id ?? null,
        cover,
        photos,
        video_url: event.video_url ?? "",
        video_poster_url: event.video_poster_url ?? "",
      };
    });
}

export function formatGalleryEventDate(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "";
  }

  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) {
    return value;
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatEventDisplayDate(event) {
  if (event?.date_label) return event.date_label;
  return event?.date ?? "";
}

export function formatEventMeta(event) {
  return [event.location, formatEventDisplayDate(event)].filter(Boolean).join(" · ");
}

export function publicEventPhotos(event) {
  const excluded = new Set(getEventPresentation(event?.id).excludePhotoIds ?? []);
  const seen = new Set();

  return (event?.photos ?? []).filter((photo) => {
    if (!photo || photo.is_public === false) return false;
    if (photo.id && (seen.has(photo.id) || excluded.has(photo.id))) {
      return false;
    }
    if (photo.id) seen.add(photo.id);
    return true;
  });
}
