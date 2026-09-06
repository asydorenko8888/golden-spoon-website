import { servicesPage } from "@/data/siteContent";

export const SERVICES_CONTENT_ID = "services";

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

export function getDefaultServicesForm() {
  return {
    hero: {
      eyebrow: servicesPage.hero.eyebrow,
      headingLine1: servicesPage.hero.heading[0],
      headingLine2: servicesPage.hero.heading[1],
      lead: servicesPage.hero.lead,
    },
    strip: servicesPage.strip.map((item) => ({
      title: item.title,
      copy: item.lines.join("\n"),
    })),
    items: servicesPage.items.map((item) => ({
      number: item.number,
      title: item.title.join("\n"),
      copy: item.copy,
    })),
  };
}

export function mergeServicesForm(stored) {
  const defaults = getDefaultServicesForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const hero = data.hero && typeof data.hero === "object" ? data.hero : {};
  const strip = Array.isArray(data.strip) ? data.strip : [];
  const items = Array.isArray(data.items) ? data.items : [];

  return {
    hero: {
      eyebrow: textOrFallback(hero.eyebrow, defaults.hero.eyebrow),
      headingLine1: textOrFallback(hero.headingLine1, defaults.hero.headingLine1),
      headingLine2: textOrFallback(hero.headingLine2, defaults.hero.headingLine2),
      lead: textOrFallback(hero.lead, defaults.hero.lead),
    },
    strip: defaults.strip.map((item, index) => ({
      title: textOrFallback(strip[index]?.title, item.title),
      copy: textOrFallback(strip[index]?.copy, item.copy),
    })),
    items: defaults.items.map((item, index) => ({
      number: item.number,
      title: textOrFallback(items[index]?.title, item.title),
      copy: textOrFallback(items[index]?.copy, item.copy),
    })),
  };
}

export function applyServicesForm(form) {
  const merged = mergeServicesForm(form);

  return {
    hero: {
      ...servicesPage.hero,
      eyebrow: merged.hero.eyebrow,
      heading: [merged.hero.headingLine1, merged.hero.headingLine2],
      lead: merged.hero.lead,
    },
    strip: servicesPage.strip.map((item, index) => ({
      ...item,
      title: merged.strip[index].title,
      lines: linesFromCopy(merged.strip[index].copy, item.lines),
    })),
    items: servicesPage.items.map((item, index) => ({
      ...item,
      number: item.number,
      image: item.image,
      title: linesFromCopy(merged.items[index].title, item.title),
      copy: merged.items[index].copy,
    })),
    cta: servicesPage.cta,
  };
}
