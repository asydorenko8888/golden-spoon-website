"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FAQ_CONTENT_ID,
  getDefaultFaqForm,
  mergeFaqForm,
} from "@/lib/faq/content";

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

export default function FaqEditor() {
  const [form, setForm] = useState(getDefaultFaqForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("faq_content")
          .select("data")
          .eq("id", FAQ_CONTENT_ID)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load FAQ content. Run supabase/migrations/008_faq_content.sql if the table is missing.",
          });
          setForm(getDefaultFaqForm());
          return;
        }

        setForm(mergeFaqForm(data?.data));
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Could not load FAQ content.",
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

  function updateSection(section, field, value) {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
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
      const { error } = await supabase.from("faq_content").upsert({
        id: FAQ_CONTENT_ID,
        data: form,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(
          error.message ||
            "Could not save FAQ content. Run supabase/migrations/008_faq_content.sql if the table is missing.",
        );
      }

      setMessage({ type: "success", text: "FAQ page content saved." });
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
        FAQ
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Edit the existing FAQ page copy. Item order, accordion behavior, and
        layout stay the same.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading FAQ content…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Hero
            </legend>
            <Field id="faq-hero-eyebrow" label="Eyebrow">
              <input
                id="faq-hero-eyebrow"
                type="text"
                value={form.hero.eyebrow}
                onChange={(event) =>
                  updateSection("hero", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-hero-heading-1" label="Heading line 1">
              <input
                id="faq-hero-heading-1"
                type="text"
                value={form.hero.headingLine1}
                onChange={(event) =>
                  updateSection("hero", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-hero-heading-2" label="Heading line 2">
              <input
                id="faq-hero-heading-2"
                type="text"
                value={form.hero.headingLine2}
                onChange={(event) =>
                  updateSection("hero", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-hero-copy" label="Supporting line">
              <textarea
                id="faq-hero-copy"
                rows={3}
                value={form.hero.copy}
                onChange={(event) =>
                  updateSection("hero", "copy", event.target.value)
                }
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
                key={`faq-strip-${index}`}
                className="space-y-3 border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0"
              >
                <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Item {index + 1}
                </p>
                <Field id={`faq-strip-title-${index}`} label="Title">
                  <input
                    id={`faq-strip-title-${index}`}
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateStrip(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field id={`faq-strip-copy-${index}`} label="Text">
                  <textarea
                    id={`faq-strip-copy-${index}`}
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

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Questions intro
            </legend>
            <Field id="faq-intro-eyebrow" label="Eyebrow">
              <input
                id="faq-intro-eyebrow"
                type="text"
                value={form.intro.eyebrow}
                onChange={(event) =>
                  updateSection("intro", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-intro-heading" label="Heading">
              <input
                id="faq-intro-heading"
                type="text"
                value={form.intro.heading}
                onChange={(event) =>
                  updateSection("intro", "heading", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-intro-copy" label="Supporting line">
              <textarea
                id="faq-intro-copy"
                rows={3}
                value={form.intro.copy}
                onChange={(event) =>
                  updateSection("intro", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              FAQ items
            </h2>
            {form.items.map((item, index) => (
              <fieldset
                key={item.id}
                className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5"
              >
                <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
                  {index + 1}. FAQ item
                </legend>
                <Field id={`${item.id}-question`} label="Question">
                  <input
                    id={`${item.id}-question`}
                    type="text"
                    value={item.question}
                    onChange={(event) =>
                      updateItem(index, "question", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field id={`${item.id}-answer`} label="Answer">
                  <textarea
                    id={`${item.id}-answer`}
                    rows={5}
                    value={item.answer}
                    onChange={(event) =>
                      updateItem(index, "answer", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </fieldset>
            ))}
          </div>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Closing CTA
            </legend>
            <Field id="faq-cta-eyebrow" label="Eyebrow">
              <input
                id="faq-cta-eyebrow"
                type="text"
                value={form.cta.eyebrow}
                onChange={(event) =>
                  updateSection("cta", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-cta-heading" label="Heading">
              <input
                id="faq-cta-heading"
                type="text"
                value={form.cta.heading}
                onChange={(event) =>
                  updateSection("cta", "heading", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-cta-copy" label="Supporting line">
              <textarea
                id="faq-cta-copy"
                rows={3}
                value={form.cta.copy}
                onChange={(event) =>
                  updateSection("cta", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="faq-cta-button" label="CTA label">
              <input
                id="faq-cta-button"
                type="text"
                value={form.cta.buttonLabel}
                onChange={(event) =>
                  updateSection("cta", "buttonLabel", event.target.value)
                }
                className={inputClass}
              />
            </Field>
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
