import { PAYMENT_TYPES } from "@/lib/payments/createPaymentLink";
import {
  getStripe,
  getStripeSecretKey,
  getStripeWebhookSecret,
} from "@/lib/payments/stripeServer";
import { createServiceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function paymentIntentId(session) {
  const value = session?.payment_intent;
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }
  if (value && typeof value === "object" && typeof value.id === "string") {
    return value.id;
  }
  return "";
}

function paymentDateFromSession(session) {
  const created = Number(session?.created);
  if (!Number.isFinite(created) || created <= 0) {
    return null;
  }

  return new Date(created * 1000).toISOString().slice(0, 10);
}

export async function POST(request) {
  if (!getStripeSecretKey() || !getStripeWebhookSecret()) {
    return Response.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      getStripeWebhookSecret(),
    );
  } catch {
    return Response.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object;
  if (session?.payment_status !== "paid") {
    return Response.json({ received: true });
  }

  const metadata = session.metadata && typeof session.metadata === "object"
    ? session.metadata
    : {};
  const clientId = typeof metadata.client_id === "string" ? metadata.client_id.trim() : "";
  const paymentType =
    typeof metadata.payment_type === "string" ? metadata.payment_type.trim() : "";

  if (!clientId) {
    console.error("Stripe webhook rejected: missing client_id metadata.");
    return Response.json({ error: "Missing client metadata." }, { status: 400 });
  }

  if (paymentType !== PAYMENT_TYPES.deposit && paymentType !== PAYMENT_TYPES.full) {
    console.error("Stripe webhook rejected: invalid payment_type metadata.");
    return Response.json({ error: "Invalid payment type metadata." }, { status: 400 });
  }

  if (!Number.isFinite(session.amount_total) || session.amount_total <= 0) {
    console.error("Stripe webhook rejected: missing paid amount.");
    return Response.json({ error: "Invalid payment amount." }, { status: 400 });
  }

  const amount = Math.round(session.amount_total) / 100;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.rpc("apply_stripe_checkout_payment", {
      p_session_id: session.id,
      p_payment_intent_id: paymentIntentId(session),
      p_client_id: clientId,
      p_payment_type: paymentType,
      p_amount: amount,
      p_event_id: event.id,
      p_payment_date: paymentDateFromSession(session),
    });

    if (error) {
      console.error("Stripe webhook could not apply payment.");
      return Response.json({ error: "Could not apply this payment." }, { status: 500 });
    }

    return Response.json({ received: true });
  } catch {
    console.error("Stripe webhook could not apply payment.");
    return Response.json({ error: "Could not apply this payment." }, { status: 500 });
  }
}
