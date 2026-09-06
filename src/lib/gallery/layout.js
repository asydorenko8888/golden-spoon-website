import { galleryPage } from "@/data/siteContent";

const extraLayout = {
  object: "object-center",
  desktop: "col-span-1 lg:col-span-4 lg:h-[250px]",
  mobile: "aspect-[3/4] lg:aspect-auto",
};

export function getDefaultGalleryItems() {
  return galleryPage.images;
}

export function mergeGalleryImages(rows = []) {
  const defaults = getDefaultGalleryItems();
  const overrides = new Map();
  const extras = [];

  for (const row of rows) {
    if (row.slot && defaults.some((item) => item.slot === row.slot)) {
      overrides.set(row.slot, row);
    } else {
      extras.push(row);
    }
  }

  extras.sort((a, b) => a.sort_order - b.sort_order);

  const collage = defaults.map((item) => {
    const override = overrides.get(item.slot);
    if (!override) return item;

    return {
      ...item,
      id: override.id,
      src: override.image_url,
      alt: override.alt_text || item.alt,
    };
  });

  const extraItems = extras.map((row) => ({
    id: row.id,
    slot: `gallery-extra-${row.id}`,
    src: row.image_url,
    alt: row.alt_text ?? "",
    object: extraLayout.object,
    desktop: extraLayout.desktop,
    mobile: extraLayout.mobile,
  }));

  return [...collage, ...extraItems];
}
