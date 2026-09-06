"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ABOUT_CONTENT_ID,
  getDefaultAboutForm,
  mergeAboutForm,
} from "@/lib/about/content";

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

export default function AboutEditor() {
  const [form, setForm] = useState(getDefaultAboutForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("about_content")
          .select("data")
          .eq("id", ABOUT_CONTENT_ID)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load About content. Run supabase/migrations/005_about_content.sql if the table is missing.",
          });
          setForm(getDefaultAboutForm());
          return;
        }

        setForm(mergeAboutForm(data?.data));
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Could not load About content.",
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

  function updateValue(index, field, value) {
    setForm((current) => ({
      ...current,
      values: current.values.map((item, itemIndex) =>
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
      const { error } = await supabase.from("about_content").upsert({
        id: ABOUT_CONTENT_ID,
        data: form,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(
          error.message ||
            "Could not save About content. Run supabase/migrations/005_about_content.sql if the table is missing.",
        );
      }

      setMessage({ type: "success", text: "About page content saved." });
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
        About
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Edit the existing About page copy. The public layout, images, and spacing
        stay the same.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading About content…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Hero
            </legend>
            <Field id="about-hero-eyebrow" label="Eyebrow">
              <input
                id="about-hero-eyebrow"
                type="text"
                value={form.hero.eyebrow}
                onChange={(event) =>
                  updateSection("hero", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="about-hero-heading-1" label="Heading line 1">
              <input
                id="about-hero-heading-1"
                type="text"
                value={form.hero.headingLine1}
                onChange={(event) =>
                  updateSection("hero", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="about-hero-heading-2" label="Heading line 2">
              <input
                id="about-hero-heading-2"
                type="text"
                value={form.hero.headingLine2}
                onChange={(event) =>
                  updateSection("hero", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field
              id="about-hero-copy"
              label="Supporting line"
              hint="Use a new line to keep the current two-line layout."
            >
              <textarea
                id="about-hero-copy"
                rows={2}
                value={form.hero.copy}
                onChange={(event) =>
                  updateSection("hero", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Story
            </legend>
            <Field id="about-story-heading-1" label="Heading line 1">
              <input
                id="about-story-heading-1"
                type="text"
                value={form.story.headingLine1}
                onChange={(event) =>
                  updateSection("story", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="about-story-heading-2" label="Heading line 2">
              <input
                id="about-story-heading-2"
                type="text"
                value={form.story.headingLine2}
                onChange={(event) =>
                  updateSection("story", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field
              id="about-story-copy"
              label="Body copy"
              hint="Separate paragraphs with a blank line."
            >
              <textarea
                id="about-story-copy"
                rows={8}
                value={form.story.copy}
                onChange={(event) =>
                  updateSection("story", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-6 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Value tiles
            </legend>
            {form.values.map((item, index) => (
              <div
                key={`about-value-${index}`}
                className="space-y-3 border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0"
              >
                <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  Tile {index + 1}
                </p>
                <Field id={`about-value-title-${index}`} label="Title">
                  <input
                    id={`about-value-title-${index}`}
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateValue(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  id={`about-value-copy-${index}`}
                  label="Description"
                  hint="Use a new line to keep the current two-line layout."
                >
                  <textarea
                    id={`about-value-copy-${index}`}
                    rows={2}
                    value={item.copy}
                    onChange={(event) =>
                      updateValue(index, "copy", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            ))}
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Approach
            </legend>
            <Field id="about-approach-eyebrow" label="Eyebrow">
              <input
                id="about-approach-eyebrow"
                type="text"
                value={form.approach.eyebrow}
                onChange={(event) =>
                  updateSection("approach", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="about-approach-heading-1" label="Heading line 1">
              <input
                id="about-approach-heading-1"
                type="text"
                value={form.approach.headingLine1}
                onChange={(event) =>
                  updateSection("approach", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="about-approach-heading-2" label="Heading line 2">
              <input
                id="about-approach-heading-2"
                type="text"
                value={form.approach.headingLine2}
                onChange={(event) =>
                  updateSection("approach", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field
              id="about-approach-copy"
              label="Body copy"
              hint="Separate paragraphs with a blank line."
            >
              <textarea
                id="about-approach-copy"
                rows={8}
                value={form.approach.copy}
                onChange={(event) =>
                  updateSection("approach", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Final CTA
            </legend>
            <Field id="about-cta-eyebrow" label="Heading">
              <input
                id="about-cta-eyebrow"
                type="text"
                value={form.cta.eyebrow}
                onChange={(event) =>
                  updateSection("cta", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="about-cta-heading" label="Supporting line">
              <input
                id="about-cta-heading"
                type="text"
                value={form.cta.heading}
                onChange={(event) =>
                  updateSection("cta", "heading", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="about-cta-label" label="CTA label">
              <input
                id="about-cta-label"
                type="text"
                value={form.cta.label}
                onChange={(event) =>
                  updateSection("cta", "label", event.target.value)
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
