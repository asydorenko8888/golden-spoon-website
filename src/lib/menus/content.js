import { menusPage } from "@/data/siteContent";

export const MENUS_CONTENT_ID = "menus";

const INTRO_FAN_IMAGE = {
  src: "/images/menus/menu-fan.png",
  alt: "Golden Spoon Classic Celebration, Premium Celebration, and Yacht Collection menu cards.",
  width: 1536,
  height: 1024,
  storagePath: "",
};

function textOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function stringOrEmpty(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function linesFromCopy(copy, fallbackLines) {
  if (typeof copy !== "string" || copy.trim() === "") {
    return fallbackLines;
  }

  const lines = copy.split("\n").map((line) => line.trimEnd()).filter(Boolean);
  return lines.length > 0 ? lines : fallbackLines;
}

function defaultImage(image) {
  return {
    src: image?.src || "",
    alt: image?.alt || "",
    width: image?.width || 0,
    height: image?.height || 0,
    storagePath: image?.storagePath || "",
    slot: image?.slot,
  };
}

function mergeImage(stored, fallback) {
  const image = stored && typeof stored === "object" ? stored : {};
  const next = defaultImage({
    src: textOrFallback(image.src, fallback.src),
    alt: textOrFallback(image.alt, fallback.alt),
    width: Number(image.width) > 0 ? Number(image.width) : fallback.width,
    height: Number(image.height) > 0 ? Number(image.height) : fallback.height,
    storagePath: stringOrEmpty(image.storagePath, fallback.storagePath || ""),
    slot: fallback.slot,
  });

  if (!fallback.slot) {
    delete next.slot;
  }

  return next;
}

function publicImage(image) {
  const next = {
    src: image.src,
    alt: image.alt,
  };

  if (image.width) next.width = image.width;
  if (image.height) next.height = image.height;
  if (image.slot) next.slot = image.slot;

  return next;
}

function sortMenuItems(items) {
  return [...items].sort((left, right) => {
    const order = (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
    if (order !== 0) return order;
    return String(left.title || "").localeCompare(String(right.title || ""));
  });
}

function visibleMenuItems(items) {
  return sortMenuItems(items).filter(
    (item) => item.active !== false && item.image?.src,
  );
}

function defaultYachtItems() {
  return menusPage.yacht.collections.map((item, index) => ({
    id: item.id,
    eyebrow: "",
    title: item.title,
    description: "",
    price: item.price,
    minimum: item.minimum ?? "",
    image: defaultImage(item.image),
    sortOrder: index,
    active: true,
    seeded: true,
  }));
}

function defaultCelebrationItems() {
  return menusPage.celebrations.items.map((item, index) => ({
    id: index === 0 ? "classic" : "premium",
    eyebrow: "",
    title: item.title,
    description: "",
    price: item.price,
    minimum: "",
    image: defaultImage(item.image),
    sortOrder: index,
    active: true,
    seeded: true,
  }));
}

function defaultCustomEventItems() {
  return menusPage.customEvents.map((section, index) => ({
    id: ["miss-universe-cocktail", "beauty-lounge", "fashion-4-ukraine", "world-vyshyvanka"][
      index
    ],
    eyebrow: section.eyebrow || "",
    title: section.items[0].title,
    description: section.context || "",
    price: "",
    minimum: "",
    image: defaultImage(section.items[0].image),
    sortOrder: index,
    active: true,
    seeded: true,
  }));
}

function mergeMenuItem(stored, fallback) {
  const item = stored && typeof stored === "object" ? stored : {};

  return {
    id: textOrFallback(item.id, fallback.id),
    eyebrow: stringOrEmpty(item.eyebrow, fallback.eyebrow),
    title: textOrFallback(item.title, fallback.title),
    description: stringOrEmpty(item.description, fallback.description),
    price: stringOrEmpty(item.price, fallback.price),
    minimum: stringOrEmpty(item.minimum, fallback.minimum),
    image: mergeImage(item.image, fallback.image),
    sortOrder:
      Number.isFinite(Number(item.sortOrder)) && Number(item.sortOrder) >= 0
        ? Number(item.sortOrder)
        : fallback.sortOrder,
    active: typeof item.active === "boolean" ? item.active : fallback.active,
    seeded: fallback.seeded === true,
  };
}

function mergeMenuItems(storedItems, defaults) {
  if (!Array.isArray(storedItems) || storedItems.length === 0) {
    return defaults;
  }

  const defaultsById = new Map(defaults.map((item) => [item.id, item]));

  return storedItems.map((item, index) => {
    const fallback =
      defaultsById.get(item?.id) ||
      createEmptyMenuItem(`item-${index + 1}`, index, false);
    return mergeMenuItem(item, fallback);
  });
}

export function createEmptyMenuItem(id, sortOrder, seeded = false) {
  return {
    id,
    eyebrow: "",
    title: "New menu",
    description: "",
    price: "",
    minimum: "",
    image: defaultImage({ src: "", alt: "", width: 0, height: 0 }),
    sortOrder,
    active: true,
    seeded,
  };
}

export function getDefaultMenusForm() {
  return {
    hero: {
      eyebrow: menusPage.hero.eyebrow,
      headingLine1: menusPage.hero.heading[0],
      headingLine2: menusPage.hero.heading[1],
      copy: menusPage.hero.copy,
      image: defaultImage(menusPage.hero.image),
    },
    strip: menusPage.strip.map((item) => ({
      title: item.title,
      copy: item.lines.join("\n"),
    })),
    intro: {
      headingLine1: menusPage.intro.heading[0],
      headingLine2: menusPage.intro.heading[1],
      copy: menusPage.intro.copy,
      priceGuidance: menusPage.intro.priceGuidance,
      image: defaultImage(INTRO_FAN_IMAGE),
    },
    yacht: {
      eyebrow: menusPage.yacht.eyebrow,
      attendantNote: menusPage.yacht.attendantNote,
      items: defaultYachtItems(),
    },
    celebrations: {
      eyebrow: menusPage.celebrations.eyebrow,
      copy: menusPage.celebrations.copy,
      note: menusPage.celebrations.note,
      items: defaultCelebrationItems(),
    },
    customEvents: {
      items: defaultCustomEventItems(),
    },
  };
}

export function mergeMenusForm(stored) {
  const defaults = getDefaultMenusForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const hero = data.hero && typeof data.hero === "object" ? data.hero : {};
  const strip = Array.isArray(data.strip) ? data.strip : [];
  const intro = data.intro && typeof data.intro === "object" ? data.intro : {};
  const yacht = data.yacht && typeof data.yacht === "object" ? data.yacht : {};
  const celebrations =
    data.celebrations && typeof data.celebrations === "object"
      ? data.celebrations
      : {};
  const customEvents =
    data.customEvents && typeof data.customEvents === "object"
      ? data.customEvents
      : {};

  return {
    hero: {
      eyebrow: textOrFallback(hero.eyebrow, defaults.hero.eyebrow),
      headingLine1: textOrFallback(hero.headingLine1, defaults.hero.headingLine1),
      headingLine2: textOrFallback(hero.headingLine2, defaults.hero.headingLine2),
      copy: textOrFallback(hero.copy, defaults.hero.copy),
      image: mergeImage(hero.image, defaults.hero.image),
    },
    strip: defaults.strip.map((item, index) => ({
      title: textOrFallback(strip[index]?.title, item.title),
      copy: textOrFallback(strip[index]?.copy, item.copy),
    })),
    intro: {
      headingLine1: textOrFallback(intro.headingLine1, defaults.intro.headingLine1),
      headingLine2: textOrFallback(intro.headingLine2, defaults.intro.headingLine2),
      copy: textOrFallback(intro.copy, defaults.intro.copy),
      priceGuidance: textOrFallback(
        intro.priceGuidance,
        defaults.intro.priceGuidance,
      ),
      image: mergeImage(intro.image, defaults.intro.image),
    },
    yacht: {
      eyebrow: textOrFallback(yacht.eyebrow, defaults.yacht.eyebrow),
      attendantNote: textOrFallback(
        yacht.attendantNote,
        defaults.yacht.attendantNote,
      ),
      items: mergeMenuItems(yacht.items, defaults.yacht.items),
    },
    celebrations: {
      eyebrow: textOrFallback(celebrations.eyebrow, defaults.celebrations.eyebrow),
      copy: textOrFallback(celebrations.copy, defaults.celebrations.copy),
      note: textOrFallback(celebrations.note, defaults.celebrations.note),
      items: mergeMenuItems(celebrations.items, defaults.celebrations.items),
    },
    customEvents: {
      items: mergeMenuItems(customEvents.items, defaults.customEvents.items),
    },
  };
}

export function applyMenusForm(form) {
  const merged = mergeMenusForm(form);

  return {
    hero: {
      ...menusPage.hero,
      eyebrow: merged.hero.eyebrow,
      heading: [merged.hero.headingLine1, merged.hero.headingLine2],
      copy: merged.hero.copy,
      image: {
        ...menusPage.hero.image,
        ...publicImage(merged.hero.image),
        slot: menusPage.hero.image.slot,
      },
    },
    strip: menusPage.strip.map((item, index) => ({
      ...item,
      title: merged.strip[index].title,
      lines: linesFromCopy(merged.strip[index].copy, item.lines),
    })),
    intro: {
      heading: [merged.intro.headingLine1, merged.intro.headingLine2],
      copy: merged.intro.copy,
      priceGuidance: merged.intro.priceGuidance,
      image: publicImage(merged.intro.image),
    },
    yacht: {
      eyebrow: merged.yacht.eyebrow,
      attendantNote: merged.yacht.attendantNote,
      collections: visibleMenuItems(merged.yacht.items).map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        minimum: item.minimum,
        image: publicImage(item.image),
      })),
    },
    celebrations: {
      eyebrow: merged.celebrations.eyebrow,
      copy: merged.celebrations.copy,
      note: merged.celebrations.note,
      items: visibleMenuItems(merged.celebrations.items).map((item) => ({
        title: item.title,
        price: item.price,
        image: publicImage(item.image),
      })),
    },
    customEvents: visibleMenuItems(merged.customEvents.items).map((item) => ({
      eyebrow: item.eyebrow,
      context: item.description,
      note: "",
      layout: "pair",
      items: [
        {
          title: item.title,
          image: publicImage(item.image),
        },
      ],
    })),
    disclaimer: menusPage.disclaimer,
    cta: menusPage.cta,
  };
}
