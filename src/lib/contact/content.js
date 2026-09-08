import { contactPage } from "@/data/siteContent";

export const CONTACT_CONTENT_ID = "contact";

export const DEFAULT_FORM_LABELS = {
  name: "Full Name *",
  email: "Email *",
  phone: "Phone",
  date: "Event Date",
  eventType: "Event Type",
  guests: "Number of Guests",
  location: "Event Location",
  message: "Tell Us About Your Event",
};

export const DEFAULT_FORM_PLACEHOLDER =
  "Tell us about your event, preferences and anything you’d like us to know.";

export const DEFAULT_SUBMIT_LABEL = "Send Inquiry";

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

const ADDRESS_PLACEHOLDER = /address to be added/i;
const SERVICE_AREA_TITLE = "Service Area";
const SERVICE_AREA_COPY = "Miami-Dade · Broward · Palm Beach";

function telHref(phone) {
  const trimmed = (phone ?? "").trim();
  if (!trimmed) return undefined;
  const digits = trimmed.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

function smsHref(phone) {
  const trimmed = (phone ?? "").trim();
  if (!trimmed) return undefined;
  const digits = trimmed.replace(/[^\d+]/g, "");
  return digits ? `sms:${digits}` : undefined;
}

function whatsappHref(phone) {
  const trimmed = (phone ?? "").trim();
  if (!trimmed) return undefined;
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.length === 10) digits = `1${digits}`;
  return `https://wa.me/${digits}`;
}

function phoneContactActions(phone) {
  const callHref = telHref(phone);
  const textHref = smsHref(phone);
  const chatHref = whatsappHref(phone);
  if (!callHref || !textHref || !chatHref) return undefined;

  return [
    { label: "Call", href: callHref },
    { label: "Text", href: textHref },
    { label: "WhatsApp", href: chatHref, external: true },
  ];
}

function resolveStripItem(item, title, copy) {
  if (item.icon !== "pin") return { title, copy };

  if (ADDRESS_PLACEHOLDER.test(copy) || ADDRESS_PLACEHOLDER.test(title)) {
    return { title: SERVICE_AREA_TITLE, copy: SERVICE_AREA_COPY };
  }

  if (/^address$/i.test(title)) {
    return { title: SERVICE_AREA_TITLE, copy: copy || SERVICE_AREA_COPY };
  }

  return { title, copy };
}

function mailtoHref(email) {
  const trimmed = (email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return undefined;
  }
  return `mailto:${trimmed}`;
}

function instagramHref(handle) {
  const username = (handle ?? "").replace(/^@/, "").trim();
  return username ? `https://www.instagram.com/${username}/` : undefined;
}

export function getDefaultContactForm() {
  return {
    hero: {
      eyebrow: contactPage.hero.eyebrow,
      headingLine1: contactPage.hero.heading[0],
      headingLine2: contactPage.hero.heading[1],
      copy: contactPage.hero.copy,
    },
    strip: contactPage.strip.map((item) => ({
      title: item.title,
      copy: item.lines.join("\n"),
    })),
    inquiry: {
      eyebrow: contactPage.inquiry.eyebrow,
      headingLine1: contactPage.inquiry.heading[0],
      headingLine2: contactPage.inquiry.heading[1],
      copy: contactPage.inquiry.copy,
      note: contactPage.inquiry.note,
      successEyebrow: contactPage.inquiry.success.eyebrow,
      successCopy: contactPage.inquiry.success.copy,
    },
    form: {
      labels: { ...DEFAULT_FORM_LABELS },
      eventTypeLabels: contactPage.inquiry.eventTypes.map((option) => option.label),
      messagePlaceholder: DEFAULT_FORM_PLACEHOLDER,
      submitLabel: DEFAULT_SUBMIT_LABEL,
    },
    serviceArea: {
      eyebrow: contactPage.serviceArea.eyebrow,
      headingLine1: contactPage.serviceArea.heading[0],
      headingLine2: contactPage.serviceArea.heading[1],
      copy: contactPage.serviceArea.copy,
      support: contactPage.serviceArea.support,
    },
    closing: {
      eyebrow: contactPage.closing.eyebrow,
      headingLine1: contactPage.closing.heading[0],
      headingLine2: contactPage.closing.heading[1],
    },
  };
}

export function mergeContactForm(stored) {
  const defaults = getDefaultContactForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const hero = data.hero && typeof data.hero === "object" ? data.hero : {};
  const strip = Array.isArray(data.strip) ? data.strip : [];
  const inquiry =
    data.inquiry && typeof data.inquiry === "object" ? data.inquiry : {};
  const form = data.form && typeof data.form === "object" ? data.form : {};
  const labels = form.labels && typeof form.labels === "object" ? form.labels : {};
  const eventTypeLabels = Array.isArray(form.eventTypeLabels)
    ? form.eventTypeLabels
    : [];
  const serviceArea =
    data.serviceArea && typeof data.serviceArea === "object"
      ? data.serviceArea
      : {};
  const closing = data.closing && typeof data.closing === "object" ? data.closing : {};

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
    inquiry: {
      eyebrow: textOrFallback(inquiry.eyebrow, defaults.inquiry.eyebrow),
      headingLine1: textOrFallback(
        inquiry.headingLine1,
        defaults.inquiry.headingLine1,
      ),
      headingLine2: textOrFallback(
        inquiry.headingLine2,
        defaults.inquiry.headingLine2,
      ),
      copy: textOrFallback(inquiry.copy, defaults.inquiry.copy),
      note: textOrFallback(inquiry.note, defaults.inquiry.note),
      successEyebrow: textOrFallback(
        inquiry.successEyebrow,
        defaults.inquiry.successEyebrow,
      ),
      successCopy: textOrFallback(inquiry.successCopy, defaults.inquiry.successCopy),
    },
    form: {
      labels: Object.fromEntries(
        Object.entries(defaults.form.labels).map(([key, fallback]) => [
          key,
          textOrFallback(labels[key], fallback),
        ]),
      ),
      eventTypeLabels: defaults.form.eventTypeLabels.map((label, index) =>
        textOrFallback(eventTypeLabels[index], label),
      ),
      messagePlaceholder: textOrFallback(
        form.messagePlaceholder,
        defaults.form.messagePlaceholder,
      ),
      submitLabel: textOrFallback(form.submitLabel, defaults.form.submitLabel),
    },
    serviceArea: {
      eyebrow: textOrFallback(serviceArea.eyebrow, defaults.serviceArea.eyebrow),
      headingLine1: textOrFallback(
        serviceArea.headingLine1,
        defaults.serviceArea.headingLine1,
      ),
      headingLine2: textOrFallback(
        serviceArea.headingLine2,
        defaults.serviceArea.headingLine2,
      ),
      copy: textOrFallback(serviceArea.copy, defaults.serviceArea.copy),
      support: textOrFallback(serviceArea.support, defaults.serviceArea.support),
    },
    closing: {
      eyebrow: textOrFallback(closing.eyebrow, defaults.closing.eyebrow),
      headingLine1: textOrFallback(
        closing.headingLine1,
        defaults.closing.headingLine1,
      ),
      headingLine2: textOrFallback(
        closing.headingLine2,
        defaults.closing.headingLine2,
      ),
    },
  };
}

function applyStripItem(item, title, copy) {
  const lines = linesFromCopy(copy, item.lines);
  const displayed = lines[0] ?? "";
  const next = { ...item, title, lines };

  if (item.icon === "phone") {
    const href = telHref(displayed);
    if (href) next.href = href;
    else delete next.href;
    const actions = phoneContactActions(displayed);
    if (actions) next.actions = actions;
    else delete next.actions;
  }

  if (item.icon === "envelope") {
    const href = mailtoHref(displayed);
    if (href) next.href = href;
    else delete next.href;
  }

  if (item.icon === "instagram") {
    next.href = instagramHref(displayed) ?? item.href;
    next.external = true;
  }

  return next;
}

export function applyGlobalContactDetails(strip, contact = {}) {
  return strip.map((item) => {
    if (item.icon === "phone") {
      const phone = typeof contact.phone === "string" ? contact.phone.trim() : "";
      if (!phone) return item;
      return applyStripItem(item, item.title, phone);
    }

    if (item.icon === "envelope") {
      const email = typeof contact.email === "string" ? contact.email.trim() : "";
      if (!email) return item;
      return applyStripItem(item, item.title, email);
    }

    return item;
  });
}

export function applyContactForm(form) {
  const merged = mergeContactForm(form);

  return {
    hero: {
      ...contactPage.hero,
      eyebrow: merged.hero.eyebrow,
      heading: [merged.hero.headingLine1, merged.hero.headingLine2],
      copy: merged.hero.copy,
    },
    strip: contactPage.strip.map((item, index) => {
      const resolved = resolveStripItem(
        item,
        merged.strip[index].title,
        merged.strip[index].copy,
      );
      return applyStripItem(item, resolved.title, resolved.copy);
    }),
    inquiry: {
      ...contactPage.inquiry,
      eyebrow: merged.inquiry.eyebrow,
      heading: [merged.inquiry.headingLine1, merged.inquiry.headingLine2],
      copy: merged.inquiry.copy,
      note: merged.inquiry.note,
      eventTypes: contactPage.inquiry.eventTypes.map((option, index) => ({
        ...option,
        value: option.value,
        label: merged.form.eventTypeLabels[index],
      })),
      success: {
        ...contactPage.inquiry.success,
        eyebrow: merged.inquiry.successEyebrow,
        copy: merged.inquiry.successCopy,
      },
      form: merged.form,
    },
    serviceArea: {
      ...contactPage.serviceArea,
      eyebrow: merged.serviceArea.eyebrow,
      heading: [
        merged.serviceArea.headingLine1,
        merged.serviceArea.headingLine2,
      ],
      copy: merged.serviceArea.copy,
      support: merged.serviceArea.support,
    },
    closing: {
      ...contactPage.closing,
      eyebrow: merged.closing.eyebrow,
      heading: [merged.closing.headingLine1, merged.closing.headingLine2],
    },
  };
}
