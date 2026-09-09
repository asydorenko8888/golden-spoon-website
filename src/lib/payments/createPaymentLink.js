export const PAYMENT_TYPES = {
  deposit: "deposit",
  full: "full",
};

export const PAYMENT_TYPE_LABELS = {
  deposit: "Deposit",
  full: "Full Payment",
};

export function isPaymentProviderConfigured() {
  return false;
}

export function getPaymentProviderLabel() {
  return isPaymentProviderConfigured() ? "Connected" : "Not connected";
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

export async function createPaymentLink({
  clientId,
  paymentType,
  amount,
  clientName,
  clientEmail,
  eventType,
  eventDate,
}) {
  if (!isPaymentProviderConfigured()) {
    return {
      ok: false,
      configured: false,
      url: null,
      error: "payment_provider_not_configured",
      message:
        "Secure payment link generation will become available after the Golden Spoon payment account is connected.",
      request: {
        clientId,
        paymentType,
        amount,
        clientName,
        clientEmail,
        eventType,
        eventDate,
      },
    };
  }

  throw new Error("Payment provider implementation is not available yet.");
}
