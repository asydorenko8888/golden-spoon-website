"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MENUS_CONTENT_ID,
  getDefaultMenusForm,
  mergeMenusForm,
} from "@/lib/menus/content";

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

export default function MenusEditor() {
  const [form, setForm] = useState(getDefaultMenusForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("menus_content")
          .select("data")
          .eq("id", MENUS_CONTENT_ID)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load Menus content. Run supabase/migrations/007_menus_content.sql if the table is missing.",
          });
          setForm(getDefaultMenusForm());
          return;
        }

        setForm(mergeMenusForm(data?.data));
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Could not load Menus content.",
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

  function updateCollectionItem(index, field, value) {
    setForm((current) => ({
      ...current,
      collections: {
        ...current.collections,
        items: current.collections.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }

  async function onSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("menus_content").upsert({
        id: MENUS_CONTENT_ID,
        data: form,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(
          error.message ||
            "Could not save Menus content. Run supabase/migrations/007_menus_content.sql if the table is missing.",
        );
      }

      setMessage({ type: "success", text: "Menus page content saved." });
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
        Menus
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Edit the existing Menus page copy. Images, order, and layout stay the
        same.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading Menus content…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Hero
            </legend>
            <Field id="menus-hero-eyebrow" label="Eyebrow">
              <input
                id="menus-hero-eyebrow"
                type="text"
                value={form.hero.eyebrow}
                onChange={(event) =>
                  updateSection("hero", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-hero-heading-1" label="Heading line 1">
              <input
                id="menus-hero-heading-1"
                type="text"
                value={form.hero.headingLine1}
                onChange={(event) =>
                  updateSection("hero", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-hero-heading-2" label="Heading line 2">
              <input
                id="menus-hero-heading-2"
                type="text"
                value={form.hero.headingLine2}
                onChange={(event) =>
                  updateSection("hero", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-hero-copy" label="Supporting line">
              <textarea
                id="menus-hero-copy"
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
                key={`menus-strip-${index}`}
                className="space-y-3 border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0"
              >
                <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Item {index + 1}
                </p>
                <Field id={`menus-strip-title-${index}`} label="Title">
                  <input
                    id={`menus-strip-title-${index}`}
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateStrip(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  id={`menus-strip-copy-${index}`}
                  label="Text"
                  hint="Use a new line to keep the current two-line layout."
                >
                  <textarea
                    id={`menus-strip-copy-${index}`}
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
              Catering collections
            </legend>
            <Field id="menus-collections-eyebrow" label="Eyebrow">
              <input
                id="menus-collections-eyebrow"
                type="text"
                value={form.collections.eyebrow}
                onChange={(event) =>
                  updateSection("collections", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-collections-heading-1" label="Heading line 1">
              <input
                id="menus-collections-heading-1"
                type="text"
                value={form.collections.headingLine1}
                onChange={(event) =>
                  updateSection("collections", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-collections-heading-2" label="Heading line 2">
              <input
                id="menus-collections-heading-2"
                type="text"
                value={form.collections.headingLine2}
                onChange={(event) =>
                  updateSection("collections", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-collections-copy" label="Introduction">
              <textarea
                id="menus-collections-copy"
                rows={3}
                value={form.collections.copy}
                onChange={(event) =>
                  updateSection("collections", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Collection items
            </h2>
            {form.collections.items.map((item, index) => (
              <fieldset
                key={item.number}
                className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5"
              >
                <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
                  {Number(item.number)}. {item.title || "Collection item"}
                </legend>
                <Field id={`menus-item-title-${item.number}`} label="Title">
                  <input
                    id={`menus-item-title-${item.number}`}
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateCollectionItem(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  id={`menus-item-note-${item.number}`}
                  label="Note"
                  hint="Leave blank to keep the current placeholder lines on the page."
                >
                  <textarea
                    id={`menus-item-note-${item.number}`}
                    rows={2}
                    value={item.note}
                    onChange={(event) =>
                      updateCollectionItem(index, "note", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </fieldset>
            ))}
          </div>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Custom menu
            </legend>
            <Field id="menus-custom-eyebrow" label="Eyebrow">
              <input
                id="menus-custom-eyebrow"
                type="text"
                value={form.custom.eyebrow}
                onChange={(event) =>
                  updateSection("custom", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-custom-heading-1" label="Heading line 1">
              <input
                id="menus-custom-heading-1"
                type="text"
                value={form.custom.headingLine1}
                onChange={(event) =>
                  updateSection("custom", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-custom-heading-2" label="Heading line 2">
              <input
                id="menus-custom-heading-2"
                type="text"
                value={form.custom.headingLine2}
                onChange={(event) =>
                  updateSection("custom", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-custom-copy" label="Body copy">
              <textarea
                id="menus-custom-copy"
                rows={4}
                value={form.custom.copy}
                onChange={(event) =>
                  updateSection("custom", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-custom-cta" label="CTA label">
              <input
                id="menus-custom-cta"
                type="text"
                value={form.custom.ctaLabel}
                onChange={(event) =>
                  updateSection("custom", "ctaLabel", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Closing CTA
            </legend>
            <Field id="menus-cta-eyebrow" label="Eyebrow">
              <input
                id="menus-cta-eyebrow"
                type="text"
                value={form.cta.eyebrow}
                onChange={(event) =>
                  updateSection("cta", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-cta-heading" label="Heading">
              <input
                id="menus-cta-heading"
                type="text"
                value={form.cta.heading}
                onChange={(event) =>
                  updateSection("cta", "heading", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-cta-copy" label="Supporting line">
              <textarea
                id="menus-cta-copy"
                rows={3}
                value={form.cta.copy}
                onChange={(event) =>
                  updateSection("cta", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-cta-button" label="CTA label">
              <input
                id="menus-cta-button"
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
