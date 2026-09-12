import { Resend } from "resend";
import { formatMoney } from "@/lib/clients/finance";
import { getInquiryMailConfig } from "@/lib/contact/sendInquiry";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value ?? "").trim());
}

export function isStripeCheckoutUrl(value) {
  try {
    const url = new URL(String(value ?? "").trim());
    return (
      url.protocol === "https:" &&
      url.hostname === "checkout.stripe.com" &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function firstName(fullName) {
  const trimmed = String(fullName ?? "").trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0];
}

export function buildPaymentLinkEmail({ clientName, amount, paymentUrl }) {
  const greetingName = firstName(clientName);
  const amountLabel = formatMoney(amount);
  const safeUrl = escapeHtml(paymentUrl);
  const safeName = escapeHtml(greetingName);
  const safeAmount = escapeHtml(amountLabel);

  const text = [
    "Golden Spoon Boutique Catering",
    "",
    `Hello ${greetingName},`,
    "",
    "Your secure payment link for your upcoming event is ready.",
    "",
    "Amount due:",
    amountLabel,
    "",
    `PAY SECURELY: ${paymentUrl}`,
    "",
    "Payment is processed securely through Stripe.",
    "",
    "If you have any questions regarding your event or payment, please contact us.",
    "",
    "Thank you for choosing Golden Spoon Boutique Catering.",
    "",
    "Svitlana Shepovalova",
    "Golden Spoon Boutique Catering",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:24px 12px;background:#F4EFE6;">
      <div style="max-width:560px;margin:0 auto;background:#FFF8F0;border:1px solid #E6D8BE;border-top:4px solid #B5935A;padding:36px 28px;font-family:Georgia,'Times New Roman',serif;color:#2D3128;line-height:1.6;">
        <p style="margin:0 0 28px;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#B5935A;">Golden Spoon Boutique Catering</p>
        <p style="margin:0 0 18px;font-size:16px;">Hello ${safeName},</p>
        <p style="margin:0 0 22px;font-size:16px;">Your secure payment link for your upcoming event is ready.</p>
        <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#6F675C;">Amount due</p>
        <p style="margin:0 0 28px;font-size:28px;line-height:1.2;color:#2D3128;">${safeAmount}</p>
        <p style="margin:0 0 28px;text-align:center;">
          <a href="${safeUrl}" style="display:inline-block;background:#B5935A;color:#ffffff;text-decoration:none;padding:16px 36px;font-size:14px;letter-spacing:0.16em;text-transform:uppercase;border-radius:4px;">Pay securely</a>
        </p>
        <p style="margin:0 0 18px;font-size:15px;">Payment is processed securely through Stripe.</p>
        <p style="margin:0 0 18px;font-size:15px;">If you have any questions regarding your event or payment, please contact us.</p>
        <p style="margin:0 0 28px;font-size:15px;">Thank you for choosing Golden Spoon Boutique Catering.</p>
        <p style="margin:0;font-size:15px;">Svitlana Shepovalova<br>Golden Spoon Boutique Catering</p>
      </div>
    </div>
  `;

  return { text, html };
}

export async function sendPaymentLinkEmail({ clientName, clientEmail, amount, paymentUrl }) {
  const { apiKey, from, to: replyTo } = getInquiryMailConfig();

  if (!apiKey) {
    const error = new Error("Email delivery is not configured.");
    error.status = 503;
    throw error;
  }

  const { text, html } = buildPaymentLinkEmail({
    clientName,
    amount,
    paymentUrl,
  });
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: clientEmail,
    replyTo: isValidEmail(replyTo) ? replyTo : undefined,
    subject: "Golden Spoon Boutique Catering — Payment Link",
    text,
    html,
  });

  if (error) {
    const sendError = new Error(error.message || "Email delivery failed.");
    sendError.status = 502;
    throw sendError;
  }
}
