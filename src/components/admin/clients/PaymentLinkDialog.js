"use client";

import { useEffect } from "react";
import { displayClientField, formatClientDate } from "@/lib/clients/constants";
import { formatMoney } from "@/lib/clients/finance";
import { PAYMENT_TYPE_LABELS } from "@/lib/payments/createPaymentLink";

export default function PaymentLinkDialog({ draft, onClose }) {
  useEffect(() => {
    if (!draft) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [draft, onClose]);

  if (!draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close payment link confirmation"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-link-title"
        className="relative w-full max-w-lg rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
      >
        <h3
          id="payment-link-title"
          className="text-sm font-semibold tracking-wide text-neutral-800 uppercase"
        >
          Payment link
        </h3>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
              Payment Type
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">
              {PAYMENT_TYPE_LABELS[draft.paymentType] ?? draft.paymentType}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
              Amount
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">{formatMoney(draft.amount)}</dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
              Client
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">
              {displayClientField(draft.clientName)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
              Client Email
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">
              {displayClientField(draft.clientEmail)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
              Event
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">
              {displayClientField(draft.eventType)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
              Event Date
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">
              {displayClientField(formatClientDate(draft.eventDate ?? ""))}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Secure payment link generation will become available after the Golden
          Spoon payment account is connected.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled
            className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase disabled:opacity-60"
          >
            Payment account not connected
          </button>
        </div>
      </div>
    </div>
  );
}
