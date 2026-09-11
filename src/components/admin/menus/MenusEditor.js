"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MENUS_CONTENT_ID,
  getDefaultMenusForm,
  mergeMenusForm,
} from "@/lib/menus/content";
import MenuImageField from "@/components/admin/menus/MenuImageField";
import MenuItemsManager from "@/components/admin/menus/MenuItemsManager";

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

  function showMessage(type, text) {
    setMessage(text ? { type, text } : null);
  }

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

      showMessage("success", "Menus page content saved.");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Save failed.",
      );
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
        Manage the current public Menus page: hero, information strip, intro,
        yacht collections, private celebrations, and custom event menus.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading Menus content…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-4xl space-y-10">
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
            <MenuImageField
              id="menus-hero-image"
              image={form.hero.image}
              folder="hero"
              onChange={(image) => updateSection("hero", "image", image)}
              onError={(text) => {
                if (text) showMessage("error", text);
              }}
            />
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
                  label="Supporting text"
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
              Intro
            </legend>
            <Field id="menus-intro-heading-1" label="Heading line 1">
              <input
                id="menus-intro-heading-1"
                type="text"
                value={form.intro.headingLine1}
                onChange={(event) =>
                  updateSection("intro", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-intro-heading-2" label="Heading line 2">
              <input
                id="menus-intro-heading-2"
                type="text"
                value={form.intro.headingLine2}
                onChange={(event) =>
                  updateSection("intro", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-intro-copy" label="Body text">
              <textarea
                id="menus-intro-copy"
                rows={4}
                value={form.intro.copy}
                onChange={(event) =>
                  updateSection("intro", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-intro-price" label="Italic pricing note">
              <textarea
                id="menus-intro-price"
                rows={3}
                value={form.intro.priceGuidance}
                onChange={(event) =>
                  updateSection("intro", "priceGuidance", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <MenuImageField
              id="menus-intro-image"
              image={form.intro.image}
              folder="intro"
              onChange={(image) => updateSection("intro", "image", image)}
              onError={(text) => {
                if (text) showMessage("error", text);
              }}
            />
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Yacht Catering Collections
            </legend>
            <Field id="menus-yacht-eyebrow" label="Section eyebrow">
              <input
                id="menus-yacht-eyebrow"
                type="text"
                value={form.yacht.eyebrow}
                onChange={(event) =>
                  updateSection("yacht", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-yacht-note" label="Section note">
              <textarea
                id="menus-yacht-note"
                rows={3}
                value={form.yacht.attendantNote}
                onChange={(event) =>
                  updateSection("yacht", "attendantNote", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <MenuItemsManager
              sectionId="yacht"
              items={form.yacht.items}
              folder="yacht"
              showPrice
              showMinimum
              onChange={(items) => updateSection("yacht", "items", items)}
              onError={(text) => {
                if (text) showMessage("error", text);
              }}
            />
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Private Celebrations
            </legend>
            <Field id="menus-celebrations-eyebrow" label="Section eyebrow">
              <input
                id="menus-celebrations-eyebrow"
                type="text"
                value={form.celebrations.eyebrow}
                onChange={(event) =>
                  updateSection("celebrations", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-celebrations-copy" label="Introduction">
              <textarea
                id="menus-celebrations-copy"
                rows={3}
                value={form.celebrations.copy}
                onChange={(event) =>
                  updateSection("celebrations", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="menus-celebrations-note" label="Supporting note">
              <textarea
                id="menus-celebrations-note"
                rows={3}
                value={form.celebrations.note}
                onChange={(event) =>
                  updateSection("celebrations", "note", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <MenuItemsManager
              sectionId="celebrations"
              items={form.celebrations.items}
              folder="celebrations"
              showPrice
              onChange={(items) =>
                updateSection("celebrations", "items", items)
              }
              onError={(text) => {
                if (text) showMessage("error", text);
              }}
            />
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Custom Event Menus
            </legend>
            <MenuItemsManager
              sectionId="custom"
              items={form.customEvents.items}
              folder="custom"
              titleMultiline
              onChange={(items) =>
                updateSection("customEvents", "items", items)
              }
              onError={(text) => {
                if (text) showMessage("error", text);
              }}
            />
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
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}
    </section>
  );
}
