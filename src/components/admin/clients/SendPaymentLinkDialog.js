"use client";

import { useEffect, useState } from "react";
import { displayClientField } from "@/lib/clients/constants";
import { formatMoney } from "@/lib/clients/finance";
import { sendPaymentLinkEmail } from "@/lib/payments/createPaymentLink";

export default function SendPaymentLinkDialog({ draft, onClose, onSent, onError }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!draft) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !sending) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [draft, onClose, sending]);

  if (!draft) return null;

  async function onSend() {
    setSending(true);
    setError(null);

    const result = await sendPaymentLinkEmail({
      clientId: draft.clientId,
      paymentType: draft.paymentType,
      paymentUrl: draft.url,
    });

    setSending(false);

    if (!result.ok) {
      const message = result.message || "The payment link email could not be sent.";
      setError(message);
      onError?.(message);
      return;
    }

    onSent?.(result.email || draft.clientEmail);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-900/40 px-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close send payment link confirmation"
        onClick={sending ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-payment-link-title"
        className="relative w-full max-w-lg rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
      >
        <h3
          id="send-payment-link-title"
          className="text-sm font-semibold tracking-wide text-neutral-800 uppercase"
        >
          Send payment link?
        </h3>
        <dl className="mt-4 grid grid-cols-1 gap-4">
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
              Email
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">
              {displayClientField(draft.clientEmail)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
              Amount
            </dt>
            <dd className="mt-1 text-sm text-neutral-900">{formatMoney(draft.amount)}</dd>
          </div>
        </dl>
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={sending}
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={sending}
            onClick={onSend}
            className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9a7b45] disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send email"}
          </button>
        </div>
      </div>
    </div>
  );
}
