"use client";

import { useEffect, useState } from "react";
import { displayClientField, formatClientDate } from "@/lib/clients/constants";
import { formatMoney } from "@/lib/clients/finance";
import {
  PAYMENT_TYPE_LABELS,
  createPaymentLink,
} from "@/lib/payments/createPaymentLink";

export default function PaymentLinkDialog({ draft, onClose, onCreated }) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [createdUrl, setCreatedUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!draft) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !creating) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [creating, draft, onClose]);

  if (!draft) return null;

  async function onCreateStripeLink() {
    setCreating(true);
    setError(null);

    const result = await createPaymentLink({
      clientId: draft.clientId,
      paymentType: draft.paymentType,
    });

    setCreating(false);

    if (!result.ok || !result.url) {
      setError(result.message || "The Stripe payment link could not be created.");
      return;
    }

    setCreatedUrl(result.url);
    onCreated?.({
      url: result.url,
      paymentType: draft.paymentType,
      amount: draft.amount,
    });
  }

  async function onCopy() {
    if (!createdUrl) return;
    try {
      await navigator.clipboard.writeText(createdUrl);
      setCopied(true);
    } catch {
      setError("The payment link could not be copied.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close payment link confirmation"
        onClick={creating ? undefined : onClose}
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
        {createdUrl ? (
          <div className="mt-4 space-y-3">
            <p className="break-all rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
              {createdUrl}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase"
              >
                {copied ? "Copied" : "Copy payment link"}
              </button>
              <a
                href={createdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase"
              >
                Open payment page
              </a>
            </div>
          </div>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={creating}
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase disabled:opacity-60"
          >
            {createdUrl ? "Close" : "Cancel"}
          </button>
          {createdUrl ? null : (
            <button
              type="button"
              disabled={creating}
              onClick={onCreateStripeLink}
              className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9a7b45] disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create Stripe payment link"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
