import { galleryPage } from "@/data/siteContent";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { mergeGalleryImages } from "@/lib/gallery/layout";

async function fetchGalleryRows(supabase) {
  const withSlot = await supabase
    .from("gallery_images")
    .select("id, image_url, alt_text, sort_order, slot")
    .order("sort_order", { ascending: true });

  if (!withSlot.error) {
    return withSlot.data ?? [];
  }

  const withoutSlot = await supabase
    .from("gallery_images")
    .select("id, image_url, alt_text, sort_order")
    .order("sort_order", { ascending: true });

  if (withoutSlot.error) {
    throw withoutSlot.error;
  }

  return (withoutSlot.data ?? []).map((row) => ({ ...row, slot: null }));
}

export async function getPublicGalleryImages() {
  if (!getSupabaseEnv()) {
    return galleryPage.images;
  }

  try {
    const supabase = await createClient();
    const rows = await fetchGalleryRows(supabase);
    return mergeGalleryImages(rows);
  } catch {
    return galleryPage.images;
  }
}
