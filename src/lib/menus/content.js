import { menusPage } from "@/data/siteContent";

export const MENUS_CONTENT_ID = "menus";

function textOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function linesFromCopy(copy, fallbackLines) {
  if (typeof copy !== "string" || copy.trim() === "") {
    return fallbackLines;
  }

  const lines = copy.split("\n").map((line) => line.trimEnd()).filter(Boolean);
  return lines.length > 0 ? lines : fallbackLines;
}

export function getDefaultMenusForm() {
  return {
    hero: {
      eyebrow: menusPage.hero.eyebrow,
      headingLine1: menusPage.hero.heading[0],
      headingLine2: menusPage.hero.heading[1],
      copy: menusPage.hero.copy,
    },
    strip: menusPage.strip.map((item) => ({
      title: item.title,
      copy: item.lines.join("\n"),
    })),
    collections: {
      eyebrow: menusPage.collections.eyebrow,
      headingLine1: menusPage.collections.heading[0],
      headingLine2: menusPage.collections.heading[1],
      copy: menusPage.collections.copy,
      items: menusPage.collections.items.map((item) => ({
        number: item.number,
        title: item.title,
        note: item.note ?? "",
      })),
    },
    custom: {
      eyebrow: menusPage.custom.eyebrow,
      headingLine1: menusPage.custom.heading[0],
      headingLine2: menusPage.custom.heading[1],
      copy: menusPage.custom.copy,
      ctaLabel: menusPage.custom.cta.label,
    },
    cta: {
      eyebrow: menusPage.cta.eyebrow,
      heading: menusPage.cta.heading,
      copy: menusPage.cta.copy,
      buttonLabel: menusPage.cta.button.label,
    },
  };
}

export function mergeMenusForm(stored) {
  const defaults = getDefaultMenusForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const hero = data.hero && typeof data.hero === "object" ? data.hero : {};
  const strip = Array.isArray(data.strip) ? data.strip : [];
  const collections =
    data.collections && typeof data.collections === "object"
      ? data.collections
      : {};
  const collectionItems = Array.isArray(collections.items)
    ? collections.items
    : [];
  const custom = data.custom && typeof data.custom === "object" ? data.custom : {};
  const cta = data.cta && typeof data.cta === "object" ? data.cta : {};

  return {
    hero: {
      eyebrow: textOrFallback(hero.eyebrow, defaults.hero.eyebrow),
      headingLine1: textOrFallback(hero.headingLine1, defaults.hero.headingLine1),
      headingLine2: textOrFallback(hero.headingLine2, defaults.hero.headingLine2),
      copy: textOrFallback(hero.copy, defaults.hero.copy),
    },
    strip: defaults.strip.map((item, index) => ({
      title: textOrFallback(strip[index]?.title, item.title),
      copy: textOrFallback(strip[index]?.copy, item.copy),
    })),
    collections: {
      eyebrow: textOrFallback(collections.eyebrow, defaults.collections.eyebrow),
      headingLine1: textOrFallback(
        collections.headingLine1,
        defaults.collections.headingLine1,
      ),
      headingLine2: textOrFallback(
        collections.headingLine2,
        defaults.collections.headingLine2,
      ),
      copy: textOrFallback(collections.copy, defaults.collections.copy),
      items: defaults.collections.items.map((item, index) => ({
        number: item.number,
        title: textOrFallback(collectionItems[index]?.title, item.title),
        note: textOrFallback(collectionItems[index]?.note, item.note),
      })),
    },
    custom: {
      eyebrow: textOrFallback(custom.eyebrow, defaults.custom.eyebrow),
      headingLine1: textOrFallback(custom.headingLine1, defaults.custom.headingLine1),
      headingLine2: textOrFallback(custom.headingLine2, defaults.custom.headingLine2),
      copy: textOrFallback(custom.copy, defaults.custom.copy),
      ctaLabel: textOrFallback(custom.ctaLabel, defaults.custom.ctaLabel),
    },
    cta: {
      eyebrow: textOrFallback(cta.eyebrow, defaults.cta.eyebrow),
      heading: textOrFallback(cta.heading, defaults.cta.heading),
      copy: textOrFallback(cta.copy, defaults.cta.copy),
      buttonLabel: textOrFallback(cta.buttonLabel, defaults.cta.buttonLabel),
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
    },
    strip: menusPage.strip.map((item, index) => ({
      ...item,
      title: merged.strip[index].title,
      lines: linesFromCopy(merged.strip[index].copy, item.lines),
    })),
    collections: {
      ...menusPage.collections,
      eyebrow: merged.collections.eyebrow,
      heading: [
        merged.collections.headingLine1,
        merged.collections.headingLine2,
      ],
      copy: merged.collections.copy,
      items: menusPage.collections.items.map((item, index) => ({
        ...item,
        number: item.number,
        image: item.image,
        title: merged.collections.items[index].title,
        note: merged.collections.items[index].note || null,
      })),
    },
    custom: {
      ...menusPage.custom,
      eyebrow: merged.custom.eyebrow,
      heading: [merged.custom.headingLine1, merged.custom.headingLine2],
      copy: merged.custom.copy,
      cta: {
        ...menusPage.custom.cta,
        label: merged.custom.ctaLabel,
      },
    },
    cta: {
      ...menusPage.cta,
      eyebrow: merged.cta.eyebrow,
      heading: merged.cta.heading,
      copy: merged.cta.copy,
      button: {
        ...menusPage.cta.button,
        label: merged.cta.buttonLabel,
      },
    },
  };
}
