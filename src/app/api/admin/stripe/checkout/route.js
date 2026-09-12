import { createClient } from "@/lib/supabase/server";
import { getCheckoutAmountFromClient } from "@/lib/payments/checkoutAmount";
import { PAYMENT_TYPES } from "@/lib/payments/createPaymentLink";
import { STRIPE_CHECKOUT_SITE_URL } from "@/lib/payments/site";
import { getStripe, getStripeSecretKey } from "@/lib/payments/stripeServer";

export const runtime = "nodejs";

function productName(paymentType) {
  return paymentType === PAYMENT_TYPES.deposit
    ? "Golden Spoon Boutique Catering — Event Deposit"
    : "Golden Spoon Boutique Catering — Event Balance";
}

export async function POST(request) {
  if (!getStripeSecretKey()) {
    return Response.json(
      {
        error: "stripe_not_configured",
        message: "Stripe is not configured.",
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized.", message: "Unauthorized." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request.", message: "Invalid request." }, { status: 400 });
  }

  const clientId = typeof body?.client_id === "string" ? body.client_id.trim() : "";
  const paymentType =
    typeof body?.payment_type === "string" ? body.payment_type.trim() : "";

  if (!clientId) {
    return Response.json(
      { error: "missing_client", message: "A client is required." },
      { status: 400 },
    );
  }

  if (paymentType !== PAYMENT_TYPES.deposit && paymentType !== PAYMENT_TYPES.full) {
    return Response.json(
      { error: "invalid_payment_type", message: "Choose a valid payment type." },
      { status: 400 },
    );
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select(
      "id, name, email, event_date, event_type, proposal_amount, deposit_paid, deposit_required, balance_due",
    )
    .eq("id", clientId)
    .maybeSingle();

  if (clientError) {
    return Response.json(
      {
        error: "supabase_failure",
        message: "Could not load this client from Supabase.",
      },
      { status: 500 },
    );
  }

  if (!client) {
    return Response.json(
      { error: "missing_client", message: "This client could not be found." },
      { status: 404 },
    );
  }

  const checkout = getCheckoutAmountFromClient(client, paymentType);
  if (!checkout.ok) {
    return Response.json(
      { error: checkout.error, message: checkout.message },
      { status: 400 },
    );
  }

  const amountCents = Math.round(checkout.amount * 100);
  if (amountCents < 50) {
    return Response.json(
      {
        error: "amount_too_small",
        message: "Stripe requires a payment of at least $0.50.",
      },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: client.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: productName(paymentType),
              description: [client.name, client.event_type, client.event_date]
                .filter(Boolean)
                .join(" · "),
            },
          },
        },
      ],
      success_url: `${STRIPE_CHECKOUT_SITE_URL}/admin/clients/${client.id}?payment=success`,
      cancel_url: `${STRIPE_CHECKOUT_SITE_URL}/admin/clients/${client.id}?payment=cancelled`,
      metadata: {
        client_id: client.id,
        payment_type: paymentType,
        proposal_amount: String(client.proposal_amount ?? ""),
        expected_payment_amount: String(checkout.amount),
      },
    });

    if (!session.url) {
      return Response.json(
        {
          error: "stripe_checkout_failed",
          message: "Stripe did not return a checkout URL.",
        },
        { status: 502 },
      );
    }

    return Response.json({
      url: session.url,
      amount: checkout.amount,
      payment_type: paymentType,
    });
  } catch {
    return Response.json(
      {
        error: "stripe_checkout_failed",
        message: "The Stripe payment link could not be created. Please try again.",
      },
      { status: 502 },
    );
  }
}
