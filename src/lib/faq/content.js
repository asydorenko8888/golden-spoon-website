import { faqPage } from "@/data/siteContent";

export const FAQ_CONTENT_ID = "faq";

export const FAQ_ITEM_IDS = faqPage.items.map(
  (_, index) => `faq-${String(index + 1).padStart(2, "0")}`,
);

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

const LEGACY_FAQ_ANSWERS = new Set([
  "Yes. Menus can be tailored to the occasion and client preferences. Tell us about your event and vision, and we’ll work with you to create a menu suited to the experience.",
  "Yes. Yacht catering is one of Golden Spoon’s catering services, with menus and presentation planned around the occasion.",
  "Golden Spoon catering may be provided as drop-off service or with staffed service, depending on the event and arrangements.",
  "Send us an inquiry with the basic details of your event. We’ll discuss your occasion, preferences and catering needs before preparing the next steps for your event.",
  "After the event details and proposal are confirmed, Golden Spoon provides the appropriate invoice or payment link.",
  "Yes. Elegant food and table presentation is part of the Golden Spoon service approach, with attention to presentation and event details.",
  "Payment happens after we review your inquiry and the proposal is approved — including the event details, menu and service format. A 50% deposit is then required to confirm the event date. The remaining balance is paid afterward according to the approved proposal. Event dates are confirmed upon approval of the proposal and receipt of a 50% deposit. Submission of an inquiry does not reserve your date.",
]);

function resolvedFaqAnswer(storedAnswer, fallback) {
  const trimmed = typeof storedAnswer === "string" ? storedAnswer.trim() : "";
  if (!trimmed || LEGACY_FAQ_ANSWERS.has(trimmed)) {
    return fallback;
  }
  return trimmed;
}

export function getDefaultFaqForm() {
  return {
    hero: {
      eyebrow: faqPage.hero.eyebrow,
      headingLine1: faqPage.hero.heading[0],
      headingLine2: faqPage.hero.heading[1],
      copy: faqPage.hero.copy,
    },
    strip: faqPage.strip.map((item) => ({
      title: item.title,
      copy: item.lines.join("\n"),
    })),
    intro: {
      eyebrow: faqPage.intro.eyebrow,
      heading: faqPage.intro.heading,
      copy: faqPage.intro.copy,
    },
    items: faqPage.items.map((item, index) => ({
      id: FAQ_ITEM_IDS[index],
      question: item.question,
      answer: item.answer,
    })),
    cta: {
      eyebrow: faqPage.cta.eyebrow,
      heading: faqPage.cta.heading,
      copy: faqPage.cta.copy,
      buttonLabel: faqPage.cta.button.label,
    },
  };
}

export function mergeFaqForm(stored) {
  const defaults = getDefaultFaqForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const hero = data.hero && typeof data.hero === "object" ? data.hero : {};
  const strip = Array.isArray(data.strip) ? data.strip : [];
  const intro = data.intro && typeof data.intro === "object" ? data.intro : {};
  const items = Array.isArray(data.items) ? data.items : [];
  const storedById = new Map(
    items
      .filter((item) => item && typeof item.id === "string")
      .map((item) => [item.id, item]),
  );
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
    intro: {
      eyebrow: textOrFallback(intro.eyebrow, defaults.intro.eyebrow),
      heading: textOrFallback(intro.heading, defaults.intro.heading),
      copy: textOrFallback(intro.copy, defaults.intro.copy),
    },
    items: defaults.items.map((item, index) => {
      const storedItem = storedById.get(item.id) ?? items[index] ?? {};
      return {
        id: item.id,
        question: textOrFallback(storedItem.question, item.question),
        answer: resolvedFaqAnswer(storedItem.answer, item.answer),
      };
    }),
    cta: {
      eyebrow: textOrFallback(cta.eyebrow, defaults.cta.eyebrow),
      heading: textOrFallback(cta.heading, defaults.cta.heading),
      copy: textOrFallback(cta.copy, defaults.cta.copy),
      buttonLabel: textOrFallback(cta.buttonLabel, defaults.cta.buttonLabel),
    },
  };
}

export function applyFaqForm(form) {
  const merged = mergeFaqForm(form);

  return {
    hero: {
      ...faqPage.hero,
      eyebrow: merged.hero.eyebrow,
      heading: [merged.hero.headingLine1, merged.hero.headingLine2],
      copy: merged.hero.copy,
    },
    strip: faqPage.strip.map((item, index) => ({
      ...item,
      title: merged.strip[index].title,
      lines: linesFromCopy(merged.strip[index].copy, item.lines),
    })),
    intro: {
      ...faqPage.intro,
      eyebrow: merged.intro.eyebrow,
      heading: merged.intro.heading,
      copy: merged.intro.copy,
    },
    items: faqPage.items.map((item, index) => ({
      ...item,
      id: merged.items[index].id,
      question: merged.items[index].question,
      answer: merged.items[index].answer,
    })),
    cta: {
      ...faqPage.cta,
      eyebrow: merged.cta.eyebrow,
      heading: merged.cta.heading,
      copy: merged.cta.copy,
      button: {
        ...faqPage.cta.button,
        label: merged.cta.buttonLabel,
      },
    },
  };
}
