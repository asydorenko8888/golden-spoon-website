"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  HOME_CONTENT_ID,
  PREVIEW_SERVICE_SLOTS,
  getDefaultHomeForm,
  mergeHomeForm,
} from "@/lib/home/content";

const SERVICE_LABELS = {
  "service-private": "Private parties card",
  "service-corporate": "Corporate events card",
  "service-yacht": "Yacht catering card",
};

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

export default function HomeEditor() {
  const [form, setForm] = useState(getDefaultHomeForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("home_content")
          .select("data")
          .eq("id", HOME_CONTENT_ID)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load Home content. Run supabase/migrations/004_home_content.sql if the table is missing.",
          });
          setForm(getDefaultHomeForm());
          return;
        }

        setForm(mergeHomeForm(data?.data));
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Could not load Home content.",
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

  function updateFeature(index, field, value) {
    setForm((current) => ({
      ...current,
      features: current.features.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateServiceTitle(slot, value) {
    setForm((current) => ({
      ...current,
      serviceTitles: { ...current.serviceTitles, [slot]: value },
    }));
  }

  async function onSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("home_content").upsert({
        id: HOME_CONTENT_ID,
        data: form,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(
          error.message ||
            "Could not save Home content. Run supabase/migrations/004_home_content.sql if the table is missing.",
        );
      }

      setMessage({ type: "success", text: "Home page content saved." });
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
        Home
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Edit the existing Home page copy. The public layout, images, and spacing
        stay the same.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading Home content…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Hero
            </legend>
            <Field id="hero-eyebrow" label="Eyebrow">
              <input
                id="hero-eyebrow"
                type="text"
                value={form.hero.eyebrow}
                onChange={(event) => updateHero("eyebrow", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="hero-heading-1" label="Heading line 1">
              <input
                id="hero-heading-1"
                type="text"
                value={form.hero.headingLine1}
                onChange={(event) => updateHero("headingLine1", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="hero-heading-2" label="Heading line 2">
              <input
                id="hero-heading-2"
                type="text"
                value={form.hero.headingLine2}
                onChange={(event) => updateHero("headingLine2", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="hero-script" label="Supporting line">
              <input
                id="hero-script"
                type="text"
                value={form.hero.script}
                onChange={(event) => updateHero("script", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="hero-copy" label="Description">
              <textarea
                id="hero-copy"
                rows={3}
                value={form.hero.copy}
                onChange={(event) => updateHero("copy", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="hero-cta" label="CTA label">
              <input
                id="hero-cta"
                type="text"
                value={form.hero.ctaLabel}
                onChange={(event) => updateHero("ctaLabel", event.target.value)}
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-6 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Value blocks
            </legend>
            {form.features.map((item, index) => (
              <div
                key={`feature-${index}`}
                className="space-y-3 border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0"
              >
                <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Block {index + 1}
                </p>
                <Field id={`feature-title-${index}`} label="Title">
                  <input
                    id={`feature-title-${index}`}
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateFeature(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  id={`feature-copy-${index}`}
                  label="Description"
                  hint="Use a new line to keep the current two-line layout."
                >
                  <textarea
                    id={`feature-copy-${index}`}
                    rows={2}
                    value={item.copy}
                    onChange={(event) =>
                      updateFeature(index, "copy", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            ))}
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Services preview titles
            </legend>
            <p className="text-sm text-neutral-500">
              Titles only. Images, descriptions, and layout stay as they are.
            </p>
            {PREVIEW_SERVICE_SLOTS.map((slot) => (
              <Field key={slot} id={`service-${slot}`} label={SERVICE_LABELS[slot]}>
                <input
                  id={`service-${slot}`}
                  type="text"
                  value={form.serviceTitles[slot] ?? ""}
                  onChange={(event) => updateServiceTitle(slot, event.target.value)}
                  className={inputClass}
                />
              </Field>
            ))}
          </fieldset>

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
