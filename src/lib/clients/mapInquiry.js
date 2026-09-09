import { contactPage } from "@/data/siteContent";

function emptyToNull(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed === "" ? null : trimmed;
}

function optionLabel(options, value) {
  const trimmed = emptyToNull(value);
  if (!trimmed) return null;
  const match = options.find((option) => option.value === trimmed);
  return match?.label || trimmed;
}

function parseEventDate(value) {
  const trimmed = emptyToNull(value);
  if (!trimmed || !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

function parseGuestCount(value) {
  const trimmed = emptyToNull(value);
  if (!trimmed) return null;
  const count = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(count) || count < 0) {
    return null;
  }
  return count;
}

export function mapInquiryToClientRecord(values) {
  return {
    name: String(values.name ?? "").trim(),
    email: emptyToNull(values.email),
    phone: emptyToNull(values.phone),
    event_date: parseEventDate(values.date),
    event_type: optionLabel(contactPage.inquiry.eventTypes, values.eventType),
    location: emptyToNull(values.location),
    guest_count: parseGuestCount(values.guests),
    service_type: optionLabel(contactPage.inquiry.serviceTypes, values.serviceType),
    estimated_budget: optionLabel(contactPage.inquiry.budgetOptions, values.budget),
    message: emptyToNull(values.message),
  };
}
