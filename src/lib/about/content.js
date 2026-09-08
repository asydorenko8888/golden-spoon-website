import { aboutPage, site } from "@/data/siteContent";

export const ABOUT_CONTENT_ID = "about";

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

const LEGACY_STORY_HEADING_1 = "A Passion for People";
const LEGACY_STORY_HEADING_2 = "and Great Food";
const LEGACY_STORY_COPY =
  "Golden Spoon was founded with a simple idea — to bring the elegance of European cuisine and the warmth of genuine hospitality to South Florida.\n\nWe believe that exceptional food has the power to bring people together, turning ordinary gatherings into extraordinary memories.\n\nFrom intimate private dinners to large corporate events, our team is dedicated to creating a seamless, beautiful and delicious experience for every guest.";
const LEGACY_APPROACH_COPY =
  "We take care of every detail — from menu planning and presentation to setup and service — so you can focus on what really matters: your guests.\n\nOur experienced team works closely with each client to understand their vision, preferences and needs, creating a customized experience that reflects their style and exceeds expectations.\n\nFrom the first conversation to the final plate, every element is thoughtfully considered to make the experience feel effortless for you and your guests.";

function replaceLegacy(stored, legacy, fallback) {
  const trimmed = typeof stored === "string" ? stored.trim() : "";
  if (!trimmed || trimmed === legacy) {
    return fallback;
  }
  return trimmed;
}

function paragraphsFromCopy(copy, fallbackParagraphs) {
  if (typeof copy !== "string" || copy.trim() === "") {
    return fallbackParagraphs;
  }

  const paragraphs = copy
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.length > 0 ? paragraphs : fallbackParagraphs;
}

export function getDefaultAboutForm() {
  return {
    hero: {
      eyebrow: aboutPage.hero.eyebrow,
      headingLine1: aboutPage.hero.heading[0],
      headingLine2: aboutPage.hero.heading[1],
      copy: aboutPage.hero.copy.join("\n"),
    },
    story: {
      headingLine1: aboutPage.story.heading[0],
      headingLine2: aboutPage.story.heading[1],
      copy: aboutPage.story.copy.join("\n\n"),
    },
    values: aboutPage.values.map((item) => ({
      title: item.title,
      copy: item.lines.join("\n"),
    })),
    approach: {
      eyebrow: aboutPage.approach.eyebrow,
      headingLine1: aboutPage.approach.heading[0],
      headingLine2: aboutPage.approach.heading[1],
      copy: aboutPage.approach.copy.join("\n\n"),
    },
    cta: {
      eyebrow: aboutPage.cta.eyebrow,
      heading: aboutPage.cta.heading,
      label: site.cta.inquireShort.label,
    },
  };
}

export function mergeAboutForm(stored) {
  const defaults = getDefaultAboutForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const hero = data.hero && typeof data.hero === "object" ? data.hero : {};
  const story = data.story && typeof data.story === "object" ? data.story : {};
  const values = Array.isArray(data.values) ? data.values : [];
  const approach =
    data.approach && typeof data.approach === "object" ? data.approach : {};
  const cta = data.cta && typeof data.cta === "object" ? data.cta : {};

  return {
    hero: {
      eyebrow: textOrFallback(hero.eyebrow, defaults.hero.eyebrow),
      headingLine1: textOrFallback(hero.headingLine1, defaults.hero.headingLine1),
      headingLine2: textOrFallback(hero.headingLine2, defaults.hero.headingLine2),
      copy: textOrFallback(hero.copy, defaults.hero.copy),
    },
    story: {
      headingLine1: replaceLegacy(
        story.headingLine1,
        LEGACY_STORY_HEADING_1,
        defaults.story.headingLine1,
      ),
      headingLine2: replaceLegacy(
        story.headingLine2,
        LEGACY_STORY_HEADING_2,
        defaults.story.headingLine2,
      ),
      copy: replaceLegacy(story.copy, LEGACY_STORY_COPY, defaults.story.copy),
    },
    values: defaults.values.map((item, index) => ({
      title: textOrFallback(values[index]?.title, item.title),
      copy: textOrFallback(values[index]?.copy, item.copy),
    })),
    approach: {
      eyebrow: textOrFallback(approach.eyebrow, defaults.approach.eyebrow),
      headingLine1: textOrFallback(
        approach.headingLine1,
        defaults.approach.headingLine1,
      ),
      headingLine2: textOrFallback(
        approach.headingLine2,
        defaults.approach.headingLine2,
      ),
      copy: replaceLegacy(approach.copy, LEGACY_APPROACH_COPY, defaults.approach.copy),
    },
    cta: {
      eyebrow: textOrFallback(cta.eyebrow, defaults.cta.eyebrow),
      heading: textOrFallback(cta.heading, defaults.cta.heading),
      label: textOrFallback(cta.label, defaults.cta.label),
    },
  };
}

export function applyAboutForm(form) {
  const merged = mergeAboutForm(form);

  return {
    hero: {
      ...aboutPage.hero,
      eyebrow: merged.hero.eyebrow,
      heading: [merged.hero.headingLine1, merged.hero.headingLine2],
      copy: linesFromCopy(merged.hero.copy, aboutPage.hero.copy),
    },
    story: {
      ...aboutPage.story,
      heading: [merged.story.headingLine1, merged.story.headingLine2],
      copy: paragraphsFromCopy(merged.story.copy, aboutPage.story.copy),
    },
    values: aboutPage.values.map((item, index) => ({
      ...item,
      title: merged.values[index].title,
      lines: linesFromCopy(merged.values[index].copy, item.lines),
    })),
    approach: {
      ...aboutPage.approach,
      eyebrow: merged.approach.eyebrow,
      heading: [merged.approach.headingLine1, merged.approach.headingLine2],
      copy: paragraphsFromCopy(merged.approach.copy, aboutPage.approach.copy),
    },
    cta: {
      ...aboutPage.cta,
      eyebrow: merged.cta.eyebrow,
      heading: merged.cta.heading,
      href: site.cta.inquireShort.href,
      label: merged.cta.label,
    },
  };
}
