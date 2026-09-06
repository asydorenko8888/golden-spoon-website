import { Resend } from "resend";
import { contactPage } from "@/data/siteContent";

export const TEST_INQUIRY_RECIPIENT = "a.sydorenko8888@gmail.com";
export const TEST_INQUIRY_FROM = "Golden Spoon <onboarding@resend.dev>";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function displayValue(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed || "—";
}

function eventTypeLabel(value) {
  const match = contactPage.inquiry.eventTypes.find(
    (option) => option.value === value,
  );
  if (!match || !match.value) return displayValue(value);
  return match.label;
}

export function getInquiryMailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.RESEND_FROM_EMAIL?.trim() || TEST_INQUIRY_FROM,
    to: process.env.INQUIRY_TO_EMAIL?.trim() || TEST_INQUIRY_RECIPIENT,
  };
}

export function validateInquiryPayload(body) {
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const errors = {};

  if (!name) errors.name = "Please enter your name.";
  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Please enter a valid email.";
  }

  return {
    errors,
    values: {
      name,
      email,
      phone: String(body?.phone ?? "").trim(),
      date: String(body?.date ?? "").trim(),
      eventType: String(body?.eventType ?? "").trim(),
      guests: String(body?.guests ?? "").trim(),
      location: String(body?.location ?? "").trim(),
      message: String(body?.message ?? "").trim(),
    },
  };
}

export function buildInquiryEmail(values) {
  const rows = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone],
    ["Event date", values.date],
    ["Event type", eventTypeLabel(values.eventType)],
    ["Number of guests", values.guests],
    ["Event location", values.location],
    ["Message", values.message],
  ];

  const text = [
    "Golden Spoon inquiry",
    "",
    ...rows.map(([label, value]) => `${label}: ${displayValue(value)}`),
  ].join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 12px 8px 0;vertical-align:top;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;vertical-align:top;white-space:pre-wrap;">${escapeHtml(displayValue(value))}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Georgia,serif;color:#2D3128;line-height:1.5;">
      <h1 style="font-size:22px;font-weight:500;margin:0 0 16px;">Golden Spoon inquiry</h1>
      <p style="margin:0 0 20px;">A new event inquiry was submitted on the Golden Spoon website.</p>
      <table style="border-collapse:collapse;font-size:15px;">${htmlRows}</table>
    </div>
  `;

  return { text, html };
}

export async function sendInquiryEmail(values) {
  const { apiKey, from, to } = getInquiryMailConfig();

  if (!apiKey) {
    const error = new Error("Email delivery is not configured.");
    error.status = 503;
    throw error;
  }

  const { text, html } = buildInquiryEmail(values);
  const resend = new Resend(apiKey);
  const replyTo = emailPattern.test(values.email) ? values.email : undefined;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject: `Golden Spoon inquiry from ${values.name}`,
    text,
    html,
  });

  if (error) {
    const sendError = new Error(error.message || "Email delivery failed.");
    sendError.status = 502;
    throw sendError;
  }
}
