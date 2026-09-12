import Stripe from "stripe";

export function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : "";
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  return typeof secret === "string" && secret.trim() !== "" ? secret.trim() : "";
}

export function getStripe() {
  const key = getStripeSecretKey();
  if (!key) {
    throw new Error("Stripe is not configured.");
  }

  return new Stripe(key);
}
