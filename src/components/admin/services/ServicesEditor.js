"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  SERVICES_CONTENT_ID,
  getDefaultServicesForm,
  mergeServicesForm,
} from "@/lib/services/content";

function Field({ id, label, hint, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[0.68rem] font-medium tracking-[0.12em] text-neutral-500 uppercase">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-neutral-500">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#B5935A]";

export default function ServicesEditor() {
  const [form, setForm] = useState(getDefaultServicesForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("services_content")
          .select("data")
          .eq("id", SERVICES_CONTENT_ID)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load Services content. Run supabase/migrations/006_services_content.sql if the table is missing.",
          });
          setForm(getDefaultServicesForm());
          return;
        }

        setForm(mergeServicesForm(data?.data));
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Could not load Services content.",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  function updateHero(field, value) {
    setForm((current) => ({
      ...current,
      hero: { ...current.hero, [field]: value },
    }));
  }

  function updateStrip(index, field, value) {
    setForm((current) => ({
      ...current,
      strip: current.strip.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateItem(index, field, value) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  async function onSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("services_content").upsert({
        id: SERVICES_CONTENT_ID,
        data: form,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(
          error.message ||
            "Could not save Services content. Run supabase/migrations/006_services_content.sql if the table is missing.",
        );
      }

      setMessage({ type: "success", text: "Services page content saved." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Services
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Edit the existing Services page copy. Images, order, numbering, and
        layout stay the same.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading Services content…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Hero
            </legend>
            <Field id="services-hero-eyebrow" label="Eyebrow">
              <input
                id="services-hero-eyebrow"
                type="text"
                value={form.hero.eyebrow}
                onChange={(event) => updateHero("eyebrow", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="services-hero-heading-1" label="Heading line 1">
              <input
                id="services-hero-heading-1"
                type="text"
                value={form.hero.headingLine1}
                onChange={(event) => updateHero("headingLine1", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="services-hero-heading-2" label="Heading line 2">
              <input
                id="services-hero-heading-2"
                type="text"
                value={form.hero.headingLine2}
                onChange={(event) => updateHero("headingLine2", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="services-hero-lead" label="Supporting line">
              <input
                id="services-hero-lead"
                type="text"
                value={form.hero.lead}
                onChange={(event) => updateHero("lead", event.target.value)}
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-6 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Information strip
            </legend>
            {form.strip.map((item, index) => (
              <div
                key={`services-strip-${index}`}
                className="space-y-3 border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0"
              >
                <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Item {index + 1}
                </p>
                <Field id={`services-strip-title-${index}`} label="Title">
                  <input
                    id={`services-strip-title-${index}`}
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateStrip(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  id={`services-strip-copy-${index}`}
                  label="Text"
                  hint="Use a new line to keep the current two-line layout."
                >
                  <textarea
                    id={`services-strip-copy-${index}`}
                    rows={2}
                    value={item.copy}
                    onChange={(event) =>
                      updateStrip(index, "copy", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            ))}
          </fieldset>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Service items
            </h2>
            {form.items.map((item, index) => (
              <fieldset
                key={item.number}
                className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5"
              >
                <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
                  {Number(item.number)}. {item.title.replace(/\n/g, " ")}
                </legend>
                <Field
                  id={`services-item-title-${item.number}`}
                  label="Title"
                  hint="Use a new line to keep the current two-line title."
                >
                  <textarea
                    id={`services-item-title-${item.number}`}
                    rows={2}
                    value={item.title}
                    onChange={(event) =>
                      updateItem(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field id={`services-item-copy-${item.number}`} label="Description">
                  <textarea
                    id={`services-item-copy-${item.number}`}
                    rows={3}
                    value={item.copy}
                    onChange={(event) =>
                      updateItem(index, "copy", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </fieldset>
            ))}
          </div>

          {message ? (
            <p
              className={`text-sm ${
                message.type === "error" ? "text-red-700" : "text-emerald-700"
              }`}
            >
              {message.text}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#B5935A] px-4 py-2.5 text-xs font-medium tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#9a7b45] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      )}
    </section>
  );
}
