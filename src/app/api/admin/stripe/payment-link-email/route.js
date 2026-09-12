import { createClient } from "@/lib/supabase/server";
import { getCheckoutAmountFromClient } from "@/lib/payments/checkoutAmount";
import { PAYMENT_TYPES } from "@/lib/payments/createPaymentLink";
import {
  isStripeCheckoutUrl,
  isValidEmail,
  sendPaymentLinkEmail,
} from "@/lib/payments/sendPaymentLinkEmail";

export const runtime = "nodejs";

export async function POST(request) {
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
  const paymentUrl =
    typeof body?.payment_url === "string" ? body.payment_url.trim() : "";

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

  if (!isStripeCheckoutUrl(paymentUrl)) {
    return Response.json(
      {
        error: "invalid_payment_url",
        message: "A valid Stripe payment link is required.",
      },
      { status: 400 },
    );
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name, email, proposal_amount, deposit_paid, deposit_required, balance_due")
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

  const clientEmail = typeof client.email === "string" ? client.email.trim() : "";
  if (!isValidEmail(clientEmail)) {
    return Response.json(
      {
        error: "missing_email",
        message: "This client does not have a valid email address.",
      },
      { status: 400 },
    );
  }

  const checkout = getCheckoutAmountFromClient(client, paymentType);
  if (!checkout.ok) {
    return Response.json(
      { error: checkout.error, message: checkout.message },
      { status: 400 },
    );
  }

  try {
    await sendPaymentLinkEmail({
      clientName: client.name,
      clientEmail,
      amount: checkout.amount,
      paymentUrl,
    });

    return Response.json({
      ok: true,
      email: clientEmail,
    });
  } catch (error) {
    const status = error instanceof Error && error.status ? error.status : 502;
    return Response.json(
      {
        error: "email_failed",
        message:
          error instanceof Error && error.message
            ? error.message
            : "The payment link email could not be sent.",
      },
      { status },
    );
  }
}
