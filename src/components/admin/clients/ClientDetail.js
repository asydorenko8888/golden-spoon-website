"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  CLIENT_STATUSES,
  CLIENT_STATUS_VALUES,
  displayClientField,
  formatClientDate,
} from "@/lib/clients/constants";
import {
  deriveFinancials,
  formatMoney,
  moneyInputValue,
  parseMoneyInput,
  paymentStatusLabel,
} from "@/lib/clients/finance";
import {
  PAYMENT_TYPES,
  getPaymentLinkAvailability,
  getPaymentProviderLabel,
  isPaymentProviderConfigured,
} from "@/lib/payments/createPaymentLink";
import PaymentLinkDialog from "@/components/admin/clients/PaymentLinkDialog";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]";

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export default function ClientDetail({ clientId }) {
  const router = useRouter();
  const supabaseConfigured = Boolean(getSupabaseEnv());
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState("new");
  const [internalNotes, setInternalNotes] = useState("");
  const [proposalAmount, setProposalAmount] = useState("");
  const [depositPaid, setDepositPaid] = useState("0");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [loading, setLoading] = useState(supabaseConfigured);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [paymentDraft, setPaymentDraft] = useState(null);
  const [message, setMessage] = useState(
    supabaseConfigured
      ? null
      : {
          type: "error",
          text: "Supabase is not configured.",
        },
  );

  useEffect(() => {
    if (!supabaseConfigured) {
      return undefined;
    }

    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("clients")
          .select(
            "id, name, email, phone, event_date, event_type, location, guest_count, service_type, estimated_budget, message, status, internal_notes, inquiry_source, created_at, updated_at, proposal_amount, deposit_paid, deposit_required, balance_due, payment_status, payment_date, payment_notes",
          )
          .eq("id", clientId)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load this client. Run supabase/migrations/013_clients_financial.sql if financial columns are missing.",
          });
          return;
        }

        if (!data) {
          setMessage({ type: "error", text: "This client could not be found." });
          return;
        }

        setClient(data);
        setStatus(data.status ?? "new");
        setInternalNotes(data.internal_notes ?? "");
        setProposalAmount(moneyInputValue(data.proposal_amount));
        setDepositPaid(moneyInputValue(data.deposit_paid ?? 0) || "0");
        setPaymentDate(data.payment_date ?? "");
        setPaymentNotes(data.payment_notes ?? "");
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error ? error.message : "Could not load this client.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [clientId, supabaseConfigured]);

  async function onSave(event) {
    event.preventDefault();
    if (!CLIENT_STATUS_VALUES.includes(status)) {
      setMessage({ type: "error", text: "Choose a valid status." });
      return;
    }

    const proposal = proposalAmount.trim() === "" ? null : parseMoneyInput(proposalAmount);
    if (proposalAmount.trim() !== "" && proposal == null) {
      setMessage({ type: "error", text: "Proposal Amount must be a valid amount of $0 or more." });
      return;
    }

    const deposit =
      depositPaid.trim() === "" ? 0 : parseMoneyInput(depositPaid);
    if (depositPaid.trim() !== "" && deposit == null) {
      setMessage({ type: "error", text: "Deposit Paid must be a valid amount of $0 or more." });
      return;
    }

    const financialsOnSave = deriveFinancials(proposal, deposit);
    const depositRequired = financialsOnSave.depositRequired;
    const hasProposal = proposal != null && proposal > 0;
    const meetsFullPayment = hasProposal && deposit >= proposal;
    const meetsDeposit =
      hasProposal && depositRequired != null && deposit >= depositRequired;
    const belowDeposit = hasProposal && !meetsDeposit;
    const isFinancialStatus = status === "deposit_paid" || status === "confirmed";
    const keepManualStatus = status === "completed" || status === "cancelled";

    let nextStatus = status;
    if (!keepManualStatus && meetsFullPayment) {
      nextStatus = "confirmed";
    } else if (!keepManualStatus && meetsDeposit) {
      nextStatus = "deposit_paid";
    } else if (
      (belowDeposit || deposit === 0) &&
      isFinancialStatus
    ) {
      nextStatus = "proposal_sent";
    }

    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("clients")
        .update({
          status: nextStatus,
          internal_notes: internalNotes.trim() === "" ? null : internalNotes.trim(),
          proposal_amount: proposal,
          deposit_paid: deposit,
          payment_date: paymentDate.trim() === "" ? null : paymentDate,
          payment_notes: paymentNotes.trim() === "" ? null : paymentNotes.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId);

      if (error) {
        throw new Error(error.message || "Could not save changes.");
      }

      setStatus(nextStatus);
      setMessage({ type: "success", text: "Client updated." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Could not save changes.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const confirmed = window.confirm(
      `Delete “${client?.name ?? "this client"}” and their inquiry? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("clients").delete().eq("id", clientId);
      if (error) {
        throw new Error(error.message || "Could not delete this client.");
      }
      router.replace("/admin/clients");
      router.refresh();
    } catch (error) {
      setDeleting(false);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Could not delete this client.",
      });
    }
  }

  const selectedMeaning =
    CLIENT_STATUSES.find((item) => item.value === status)?.meaning ?? "";
  const financials = deriveFinancials(proposalAmount, depositPaid);
  const paymentLinks = getPaymentLinkAvailability(financials);

  function openPaymentDraft(paymentType, amount) {
    setPaymentDraft({
      paymentType,
      amount,
      clientName: client?.name ?? "",
      clientEmail: client?.email ?? "",
      eventType: client?.event_type ?? "",
      eventDate: client?.event_date ?? "",
    });
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {client?.name || "Client"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            Inquiry details and event status.
          </p>
        </div>
        <Link
          href="/admin/clients"
          className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase"
        >
          Back to clients
        </Link>
      </div>

      {message ? (
        <p
          className={`mt-4 text-sm ${
            message.type === "error" ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading client…</p>
      ) : !client ? null : (
        <div className="mt-8 max-w-3xl space-y-8">
          <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Contact
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Name" value={displayClientField(client.name)} />
              <Detail label="Email" value={displayClientField(client.email)} />
              <Detail label="Phone" value={displayClientField(client.phone)} />
            </dl>
          </section>

          <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Event
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail
                label="Event date"
                value={displayClientField(formatClientDate(client.event_date ?? ""))}
              />
              <Detail label="Event type" value={displayClientField(client.event_type)} />
              <Detail label="Location" value={displayClientField(client.location)} />
              <Detail
                label="Guest count"
                value={displayClientField(client.guest_count)}
              />
              <Detail
                label="Service type"
                value={displayClientField(client.service_type)}
              />
              <Detail
                label="Estimated budget"
                value={displayClientField(client.estimated_budget)}
              />
            </dl>
          </section>

          <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Inquiry
            </h2>
            <dl className="grid grid-cols-1 gap-4">
              <Detail label="Message" value={displayClientField(client.message)} />
              <Detail
                label="Received date"
                value={displayClientField(formatClientDate(client.created_at ?? ""))}
              />
              <Detail
                label="Source"
                value={displayClientField(client.inquiry_source)}
              />
            </dl>
          </section>

          <form onSubmit={onSave} className="space-y-8">
          <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Financial
            </h2>
            {financials.eventDateReserved ? (
              <p className="rounded-md bg-[#B5935A]/12 px-3 py-2 text-sm font-medium text-[#8a6d3c]">
                Event date reserved
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label htmlFor="proposal-amount" className="block">
                <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Proposal Amount
                </span>
                <input
                  id="proposal-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={proposalAmount}
                  onChange={(event) => setProposalAmount(event.target.value)}
                  className={inputClass}
                />
              </label>
              <div>
                <p className="mb-1.5 text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Deposit Required
                </p>
                <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900">
                  {formatMoney(financials.depositRequired)}
                </p>
              </div>
              <label htmlFor="deposit-paid" className="block">
                <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Deposit Paid
                </span>
                <input
                  id="deposit-paid"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={depositPaid}
                  onChange={(event) => setDepositPaid(event.target.value)}
                  className={inputClass}
                />
              </label>
              <div>
                <p className="mb-1.5 text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Balance Due
                </p>
                <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900">
                  {formatMoney(financials.balanceDue)}
                </p>
              </div>
              <div>
                <p className="mb-1.5 text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Payment Status
                </p>
                <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900">
                  {paymentStatusLabel(financials.paymentStatus)}
                </p>
              </div>
              <label htmlFor="payment-date" className="block">
                <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Payment Date
                </span>
                <input
                  id="payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(event) => setPaymentDate(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label htmlFor="payment-notes" className="block sm:col-span-2">
                <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Payment Notes
                </span>
                <textarea
                  id="payment-notes"
                  rows={4}
                  value={paymentNotes}
                  onChange={(event) => setPaymentNotes(event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <h3 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
                Payment link
              </h3>
              <p className="mt-3 text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                Payment provider
              </p>
              <p className="mt-1 text-sm text-neutral-900">{getPaymentProviderLabel()}</p>
              {isPaymentProviderConfigured() ? null : (
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Payment link generation is ready. Connect a payment provider to
                  activate secure checkout links.
                </p>
              )}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={!paymentLinks.canCreateDeposit}
                  onClick={() =>
                    openPaymentDraft(PAYMENT_TYPES.deposit, paymentLinks.depositAmount)
                  }
                  className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase disabled:opacity-40"
                >
                  Create deposit payment link
                </button>
                <button
                  type="button"
                  disabled={!paymentLinks.canCreateFull}
                  onClick={() =>
                    openPaymentDraft(PAYMENT_TYPES.full, paymentLinks.fullAmount)
                  }
                  className="rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-neutral-700 uppercase disabled:opacity-40"
                >
                  Create full payment link
                </button>
              </div>
            </div>
          </section>

          <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              CRM
            </h2>
            <label htmlFor="client-status" className="block">
              <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                Status
              </span>
              <select
                id="client-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={inputClass}
              >
                {CLIENT_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              {selectedMeaning ? (
                <span className="mt-1 block text-xs text-neutral-500">
                  {selectedMeaning}
                </span>
              ) : null}
            </label>
            <label htmlFor="client-notes" className="block">
              <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
                Internal notes
              </span>
              <textarea
                id="client-notes"
                rows={5}
                value={internalNotes}
                onChange={(event) => setInternalNotes(event.target.value)}
                className={inputClass}
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                disabled={saving || deleting}
                className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9a7b45] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                disabled={saving || deleting}
                onClick={onDelete}
                className="text-xs text-red-700 hover:underline disabled:opacity-40"
              >
                {deleting ? "Deleting…" : "Delete client"}
              </button>
            </div>
          </div>
          </form>
          <PaymentLinkDialog
            draft={paymentDraft}
            onClose={() => setPaymentDraft(null)}
          />
        </div>
      )}
    </section>
  );
}
