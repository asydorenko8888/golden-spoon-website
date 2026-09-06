import { home, site } from "@/data/siteContent";

export const HOME_CONTENT_ID = "home";

export const PREVIEW_SERVICE_SLOTS = [
  "service-private",
  "service-corporate",
  "service-yacht",
];

function textOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

export function getDefaultHomeForm() {
  const serviceTitles = {};

  for (const item of home.selectedServices.items) {
    if (PREVIEW_SERVICE_SLOTS.includes(item.image.slot)) {
      serviceTitles[item.image.slot] = item.title;
    }
  }

  return {
    hero: {
      eyebrow: home.hero.eyebrow,
      headingLine1: home.hero.headline[0],
      headingLine2: home.hero.headline[1],
      script: home.hero.script,
      copy: home.hero.copy,
      ctaLabel: site.cta.inquire.label,
    },
    features: home.features.map((item) => ({
      title: item.title,
      copy: item.lines.join("\n"),
    })),
    serviceTitles,
  };
}

export function mergeHomeForm(stored) {
  const defaults = getDefaultHomeForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const hero = data.hero && typeof data.hero === "object" ? data.hero : {};
  const features = Array.isArray(data.features) ? data.features : [];
  const serviceTitles =
    data.serviceTitles && typeof data.serviceTitles === "object"
      ? data.serviceTitles
      : {};

  return {
    hero: {
      eyebrow: textOrFallback(hero.eyebrow, defaults.hero.eyebrow),
      headingLine1: textOrFallback(hero.headingLine1, defaults.hero.headingLine1),
      headingLine2: textOrFallback(hero.headingLine2, defaults.hero.headingLine2),
      script: textOrFallback(hero.script, defaults.hero.script),
      copy: textOrFallback(hero.copy, defaults.hero.copy),
      ctaLabel: textOrFallback(hero.ctaLabel, defaults.hero.ctaLabel),
    },
    features: defaults.features.map((item, index) => ({
      title: textOrFallback(features[index]?.title, item.title),
      copy: textOrFallback(features[index]?.copy, item.copy),
    })),
    serviceTitles: Object.fromEntries(
      PREVIEW_SERVICE_SLOTS.map((slot) => [
        slot,
        textOrFallback(serviceTitles[slot], defaults.serviceTitles[slot]),
      ]),
    ),
  };
}

function linesFromCopy(copy, fallbackLines) {
  if (typeof copy !== "string" || copy.trim() === "") {
    return fallbackLines;
  }

  const lines = copy.split("\n").map((line) => line.trimEnd()).filter(Boolean);
  return lines.length > 0 ? lines : fallbackLines;
}

export function applyHomeForm(form) {
  const merged = mergeHomeForm(form);

  return {
    hero: {
      ...home.hero,
      eyebrow: merged.hero.eyebrow,
      headline: [merged.hero.headingLine1, merged.hero.headingLine2],
      script: merged.hero.script,
      copy: merged.hero.copy,
    },
    heroCta: {
      ...site.cta.inquire,
      label: merged.hero.ctaLabel,
    },
    features: home.features.map((item, index) => ({
      ...item,
      title: merged.features[index].title,
      lines: linesFromCopy(merged.features[index].copy, item.lines),
    })),
    selectedServices: {
      ...home.selectedServices,
      items: home.selectedServices.items.map((item) => ({
        ...item,
        title: merged.serviceTitles[item.image.slot] ?? item.title,
      })),
    },
  };
}
