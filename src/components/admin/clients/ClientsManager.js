"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  CLIENT_STATUSES,
  clientStatusLabel,
  formatClientDate,
} from "@/lib/clients/constants";

const FILTERS = [{ value: "all", label: "All" }, ...CLIENT_STATUSES];

function contactLine(client) {
  return [client.email, client.phone].filter(Boolean).join(" · ") || "No email or phone";
}

export default function ClientsManager() {
  const supabaseConfigured = Boolean(getSupabaseEnv());
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [message, setMessage] = useState(
    supabaseConfigured
      ? null
      : {
          type: "error",
          text: "Supabase is not configured. Add the environment variables to manage clients.",
        },
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

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
            "id, name, email, phone, event_date, event_type, status, created_at",
          )
          .order("created_at", { ascending: false });

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load clients. Run supabase/migrations/012_clients.sql if the table is missing.",
          });
          return;
        }

        setClients(data ?? []);
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error ? error.message : "Could not load clients.",
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
  }, [supabaseConfigured]);

  const visibleClients = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return clients.filter((client) => {
      if (statusFilter !== "all" && client.status !== statusFilter) {
        return false;
      }
      if (!needle) return true;
      return [client.name, client.email, client.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [clients, query, statusFilter]);

  return (
    <section>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Clients
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Website inquiries and event status. Newest inquiries appear first.
        </p>
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

      <div className="mt-6 flex flex-col gap-4">
        <label className="block max-w-md">
          <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, or phone"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-md px-3 py-1.5 text-[0.68rem] font-medium tracking-[0.12em] uppercase ${
                  isActive
                    ? "bg-[#B5935A] text-white"
                    : "border border-neutral-300 text-neutral-700"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading clients…</p>
      ) : visibleClients.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          {clients.length === 0
            ? "No inquiries yet. New Contact form submissions will appear here."
            : "No clients match this search or filter."}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {visibleClients.map((client) => (
            <li key={client.id}>
              <Link
                href={`/admin/clients/${client.id}`}
                className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-4 transition-colors hover:border-[#B5935A]/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-neutral-900">
                    {client.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {[
                      formatClientDate(client.event_date ?? ""),
                      client.event_type,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "No event date or type"}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">{contactLine(client)}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1 sm:items-end">
                  <span className="text-xs font-medium tracking-[0.12em] text-[#8a6d3c] uppercase">
                    {clientStatusLabel(client.status)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Received {formatClientDate(client.created_at ?? "")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
