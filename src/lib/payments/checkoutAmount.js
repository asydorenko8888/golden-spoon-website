import { PAYMENT_TYPES } from "@/lib/payments/createPaymentLink";

function toAmount(value) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : null;
}

export function getCheckoutAmountFromClient(client, paymentType) {
  const proposalAmount = toAmount(client?.proposal_amount);
  const depositPaid = toAmount(client?.deposit_paid) ?? 0;

  if (proposalAmount == null || proposalAmount <= 0) {
    return {
      ok: false,
      error: "missing_proposal_amount",
      message: "A proposal amount greater than $0 is required before creating a payment link.",
    };
  }

  const depositRequired = Math.round(proposalAmount * 50) / 100;
  const remainingDeposit = Math.round((depositRequired - depositPaid) * 100) / 100;
  const remainingBalance = Math.round((proposalAmount - depositPaid) * 100) / 100;

  if (paymentType === PAYMENT_TYPES.deposit) {
    if (remainingDeposit <= 0) {
      return {
        ok: false,
        error: "deposit_already_paid",
        message: "The required deposit has already been paid.",
      };
    }

    return { ok: true, amount: remainingDeposit };
  }

  if (paymentType === PAYMENT_TYPES.full) {
    if (remainingBalance <= 0) {
      return {
        ok: false,
        error: "zero_balance",
        message: "This client has no remaining balance.",
      };
    }

    return { ok: true, amount: remainingBalance };
  }

  return {
    ok: false,
    error: "invalid_payment_type",
    message: "Choose a valid payment type.",
  };
}
