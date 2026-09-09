export const PAYMENT_STATUSES = [
  { value: "not_paid", label: "Not Paid" },
  { value: "deposit_paid", label: "Deposit Paid" },
  { value: "paid_in_full", label: "Paid in Full" },
];

export function paymentStatusLabel(value) {
  return (
    PAYMENT_STATUSES.find((item) => item.value === value)?.label ?? value ?? ""
  );
}

function toNumber(value) {
  if (value == null || value === "") return null;
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function parseMoneyInput(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed === "") return null;
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }
  return Math.round(amount * 100) / 100;
}

export function formatMoney(value) {
  const amount = toNumber(value);
  if (amount == null) return "—";
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function deriveFinancials(proposalAmount, depositPaid) {
  const proposal = toNumber(proposalAmount);
  const deposit = toNumber(depositPaid) ?? 0;
  const depositRequired =
    proposal == null ? null : Math.round(proposal * 50) / 100;
  const balanceDue = Math.max((proposal ?? 0) - deposit, 0);

  let paymentStatus = "not_paid";
  if (deposit <= 0) {
    paymentStatus = "not_paid";
  } else if (proposal == null || deposit < proposal) {
    paymentStatus = "deposit_paid";
  } else {
    paymentStatus = "paid_in_full";
  }

  return {
    proposalAmount: proposal,
    depositPaid: deposit,
    depositRequired,
    balanceDue,
    paymentStatus,
    eventDateReserved: proposal != null && proposal > 0 && deposit >= depositRequired,
  };
}

export function moneyInputValue(value) {
  if (value == null || value === "") return "";
  const amount = toNumber(value);
  if (amount == null) return "";
  return String(amount);
}
