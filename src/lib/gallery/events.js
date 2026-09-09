export function normalizeGalleryEvents(events = []) {
  return [...events]
    .filter((event) => event && typeof event === "object")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((event) => ({
      id: event.id,
      title: event.title ?? "",
      date: event.date ?? "",
      location: event.location ?? "",
      description: event.description ?? "",
      sort_order: event.sort_order ?? 0,
      photos: [...(event.photos ?? [])]
        .filter((photo) => photo && photo.image_url)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((photo) => ({
          id: photo.id,
          image_url: photo.image_url,
          alt_text: photo.alt_text ?? "",
          sort_order: photo.sort_order ?? 0,
        })),
    }));
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

export function formatEventMeta(event) {
  return [event.location, event.date].filter(Boolean).join(" · ");
}
