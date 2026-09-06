import { site } from "@/data/siteContent";

export const SITE_SETTINGS_ID = "settings";

export const DEFAULT_COPYRIGHT_NAME = "Golden Spoon Boutique European Catering";

export const DEFAULT_MOBILE_SERVICES = [
  "Private Events",
  "Corporate Events",
  "Yacht Catering",
  "Grazing Tables",
  "Custom Menus",
];

export const DEFAULT_MOBILE_SERVICE_AREA = [
  "Miami-Dade",
  "Broward",
  "Palm Beach",
];

export const DEFAULT_FOOTER_HEADINGS = {
  explore: "Explore",
  quickLinks: "Quick Links",
  services: "Services",
  serviceArea: "Service Area",
  contact: "Contact",
};

function textOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function listOrFallback(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  return fallback.map((item, index) => textOrFallback(value[index], item));
}

function instagramHrefFromHandle(handle) {
  const username = (handle ?? "").replace(/^@/, "").trim();
  return username ? `https://www.instagram.com/${username}/` : "";
}

export function getDefaultSettingsForm() {
  return {
    company: {
      name: site.name,
      tagline: site.tagline,
      location: site.location,
      copyrightName: DEFAULT_COPYRIGHT_NAME,
      metaTitle: site.metadata.title,
      metaDescription: site.metadata.description,
    },
    contact: {
      phone: site.contact.phone ?? "",
      email: site.contact.email ?? "",
      instagramHandle: site.contact.instagram?.handle ?? "",
      instagramUrl: site.contact.instagram?.href ?? "",
    },
    nav: site.navigation.map((item) => item.label),
    cta: {
      short: site.cta.inquireShort.label,
      full: site.cta.inquire.label,
    },
    footer: {
      headings: { ...DEFAULT_FOOTER_HEADINGS },
      quickLinks: site.footer.quickLinks.map((item) => item.label),
      services: [...site.footer.services],
      serviceArea: [...site.footer.serviceArea],
      mobileServices: [...DEFAULT_MOBILE_SERVICES],
      mobileServiceArea: [...DEFAULT_MOBILE_SERVICE_AREA],
    },
  };
}

export function mergeSettingsForm(stored) {
  const defaults = getDefaultSettingsForm();
  const data = stored && typeof stored === "object" ? stored : {};
  const company = data.company && typeof data.company === "object" ? data.company : {};
  const contact = data.contact && typeof data.contact === "object" ? data.contact : {};
  const nav = Array.isArray(data.nav) ? data.nav : [];
  const cta = data.cta && typeof data.cta === "object" ? data.cta : {};
  const footer = data.footer && typeof data.footer === "object" ? data.footer : {};
  const headings =
    footer.headings && typeof footer.headings === "object" ? footer.headings : {};

  return {
    company: {
      name: textOrFallback(company.name, defaults.company.name),
      tagline: textOrFallback(company.tagline, defaults.company.tagline),
      location: textOrFallback(company.location, defaults.company.location),
      copyrightName: textOrFallback(
        company.copyrightName,
        defaults.company.copyrightName,
      ),
      metaTitle: textOrFallback(company.metaTitle, defaults.company.metaTitle),
      metaDescription: textOrFallback(
        company.metaDescription,
        defaults.company.metaDescription,
      ),
    },
    contact: {
      phone: textOrFallback(contact.phone, defaults.contact.phone),
      email: typeof contact.email === "string" ? contact.email.trim() : defaults.contact.email,
      instagramHandle: textOrFallback(
        contact.instagramHandle,
        defaults.contact.instagramHandle,
      ),
      instagramUrl: textOrFallback(
        contact.instagramUrl,
        defaults.contact.instagramUrl,
      ),
    },
    nav: defaults.nav.map((label, index) => textOrFallback(nav[index], label)),
    cta: {
      short: textOrFallback(cta.short, defaults.cta.short),
      full: textOrFallback(cta.full, defaults.cta.full),
    },
    footer: {
      headings: {
        explore: textOrFallback(headings.explore, defaults.footer.headings.explore),
        quickLinks: textOrFallback(
          headings.quickLinks,
          defaults.footer.headings.quickLinks,
        ),
        services: textOrFallback(headings.services, defaults.footer.headings.services),
        serviceArea: textOrFallback(
          headings.serviceArea,
          defaults.footer.headings.serviceArea,
        ),
        contact: textOrFallback(headings.contact, defaults.footer.headings.contact),
      },
      quickLinks: listOrFallback(footer.quickLinks, defaults.footer.quickLinks),
      services: listOrFallback(footer.services, defaults.footer.services),
      serviceArea: listOrFallback(footer.serviceArea, defaults.footer.serviceArea),
      mobileServices: listOrFallback(
        footer.mobileServices,
        defaults.footer.mobileServices,
      ),
      mobileServiceArea: listOrFallback(
        footer.mobileServiceArea,
        defaults.footer.mobileServiceArea,
      ),
    },
  };
}

export function applySiteSettings(form) {
  const merged = mergeSettingsForm(form);
  const email = merged.contact.email.trim();
  const instagramHandle = merged.contact.instagramHandle;
  const instagramUrl =
    merged.contact.instagramUrl || instagramHrefFromHandle(instagramHandle);

  return {
    ...site,
    name: merged.company.name,
    tagline: merged.company.tagline,
    location: merged.company.location,
    copyrightName: merged.company.copyrightName,
    metadata: {
      ...site.metadata,
      title: merged.company.metaTitle,
      description: merged.company.metaDescription,
    },
    navigation: site.navigation.map((item, index) => ({
      ...item,
      href: item.href,
      label: merged.nav[index],
    })),
    cta: {
      ...site.cta,
      inquire: {
        ...site.cta.inquire,
        href: site.cta.inquire.href,
        label: merged.cta.full,
      },
      inquireShort: {
        ...site.cta.inquireShort,
        href: site.cta.inquireShort.href,
        label: merged.cta.short,
      },
    },
    contact: {
      ...site.contact,
      phone: merged.contact.phone,
      email: email || null,
      instagram: {
        handle: instagramHandle,
        href: instagramUrl,
      },
    },
    footer: {
      headings: merged.footer.headings,
      quickLinks: site.footer.quickLinks.map((item, index) => ({
        ...item,
        href: item.href,
        label: merged.footer.quickLinks[index],
      })),
      services: merged.footer.services,
      serviceArea: merged.footer.serviceArea,
      mobileServices: merged.footer.mobileServices,
      mobileServiceArea: merged.footer.mobileServiceArea,
    },
  };
}
