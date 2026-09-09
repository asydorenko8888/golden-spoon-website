export const CLIENT_STATUSES = [
  {
    value: "new",
    label: "New",
    meaning: "New inquiry received.",
  },
  {
    value: "contacted",
    label: "Contacted",
    meaning: "Golden Spoon has contacted the client.",
  },
  {
    value: "proposal_sent",
    label: "Proposal Sent",
    meaning: "A proposal has been sent.",
  },
  {
    value: "deposit_paid",
    label: "Deposit Paid",
    meaning: "The required deposit has been received.",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    meaning: "The event is confirmed/reserved.",
  },
  {
    value: "completed",
    label: "Completed",
    meaning: "The event has been completed.",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    meaning: "The inquiry/event was cancelled.",
  },
];

export const CLIENT_STATUS_VALUES = CLIENT_STATUSES.map((item) => item.value);

export function clientStatusLabel(value) {
  return CLIENT_STATUSES.find((item) => item.value === value)?.label ?? value ?? "";
}

export function formatClientDate(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "";
  }

  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (dayMatch) {
    const date = new Date(
      Date.UTC(Number(dayMatch[1]), Number(dayMatch[2]) - 1, Number(dayMatch[3])),
    );
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function displayClientField(value) {
  if (value === 0) return "0";
  if (value == null) return "—";
  const text = String(value).trim();
  return text === "" ? "—" : text;
}
