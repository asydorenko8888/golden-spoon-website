import { galleryPage } from "@/data/siteContent";
import { normalizeGalleryEvents } from "@/lib/gallery/events";

export async function getPublicGalleryEvents() {
  return normalizeGalleryEvents(galleryPage.events);
}
