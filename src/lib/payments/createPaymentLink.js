export const PAYMENT_TYPES = {
  deposit: "deposit",
  full: "full",
};

export const PAYMENT_TYPE_LABELS = {
  deposit: "Deposit",
  full: "Full Payment",
};

export function isPaymentProviderConfigured() {
  return true;
}

export function getPaymentProviderLabel() {
  return "Stripe";
}

export function getPaymentLinkAvailability(financials) {
  const proposal = financials.proposalAmount;
  const depositRequired = financials.depositRequired;
  const depositPaid = financials.depositPaid ?? 0;
  const balanceDue = financials.balanceDue ?? 0;

  const canCreateDeposit =
    proposal != null &&
    proposal > 0 &&
    depositRequired != null &&
    depositRequired > 0 &&
    depositPaid < depositRequired;

  const canCreateFull = proposal != null && proposal > 0 && balanceDue > 0;

  return {
    canCreateDeposit,
    canCreateFull,
    depositAmount: canCreateDeposit
      ? Math.round((depositRequired - depositPaid) * 100) / 100
      : 0,
    fullAmount: canCreateFull ? Math.round(balanceDue * 100) / 100 : 0,
  };
}

export async function createPaymentLink({ clientId, paymentType }) {
  const response = await fetch("/api/admin/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      client_id: clientId,
      payment_type: paymentType,
    }),
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || !payload?.url) {
    return {
      ok: false,
      url: null,
      error: payload?.error || "stripe_checkout_failed",
      message:
        payload?.message ||
        "The Stripe payment link could not be created. Please try again.",
    };
  }

  return {
    ok: true,
    url: payload.url,
  };
}
