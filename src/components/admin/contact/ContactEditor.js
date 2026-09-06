"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CONTACT_CONTENT_ID,
  getDefaultContactForm,
  mergeContactForm,
} from "@/lib/contact/content";

const STRIP_HINTS = ["Address", "Phone", "Email", "Instagram"];
const FORM_LABEL_FIELDS = [
  ["name", "Full name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["date", "Event date"],
  ["eventType", "Event type"],
  ["guests", "Number of guests"],
  ["location", "Event location"],
  ["message", "Message"],
];

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

export default function ContactEditor() {
  const [form, setForm] = useState(getDefaultContactForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("contact_content")
          .select("data")
          .eq("id", CONTACT_CONTENT_ID)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load Contact content. Run supabase/migrations/009_contact_content.sql if the table is missing.",
          });
          setForm(getDefaultContactForm());
          return;
        }

        setForm(mergeContactForm(data?.data));
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Could not load Contact content.",
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

  function updateFormLabel(key, value) {
    setForm((current) => ({
      ...current,
      form: {
        ...current.form,
        labels: { ...current.form.labels, [key]: value },
      },
    }));
  }

  function updateEventTypeLabel(index, value) {
    setForm((current) => ({
      ...current,
      form: {
        ...current.form,
        eventTypeLabels: current.form.eventTypeLabels.map((label, itemIndex) =>
          itemIndex === index ? value : label,
        ),
      },
    }));
  }

  function updateFormField(field, value) {
    setForm((current) => ({
      ...current,
      form: { ...current.form, [field]: value },
    }));
  }

  async function onSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_content").upsert({
        id: CONTACT_CONTENT_ID,
        data: form,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(
          error.message ||
            "Could not save Contact content. Run supabase/migrations/009_contact_content.sql if the table is missing.",
        );
      }

      setMessage({ type: "success", text: "Contact page content saved." });
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
        Contact
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Edit the existing Contact page copy. The inquiry form still submits the
        same way. Public phone and email links stay in sync with the displayed
        values.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading Contact content…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Hero
            </legend>
            <Field id="contact-hero-eyebrow" label="Eyebrow">
              <input
                id="contact-hero-eyebrow"
                type="text"
                value={form.hero.eyebrow}
                onChange={(event) =>
                  updateSection("hero", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-hero-heading-1" label="Heading line 1">
              <input
                id="contact-hero-heading-1"
                type="text"
                value={form.hero.headingLine1}
                onChange={(event) =>
                  updateSection("hero", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-hero-heading-2" label="Heading line 2">
              <input
                id="contact-hero-heading-2"
                type="text"
                value={form.hero.headingLine2}
                onChange={(event) =>
                  updateSection("hero", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-hero-copy" label="Supporting line">
              <textarea
                id="contact-hero-copy"
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
              Contact details
            </legend>
            {form.strip.map((item, index) => (
              <div
                key={`contact-strip-${index}`}
                className="space-y-3 border-t border-neutral-100 pt-5 first:border-t-0 first:pt-0"
              >
                <p className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase">
                  {STRIP_HINTS[index] ?? `Item ${index + 1}`}
                </p>
                <Field id={`contact-strip-title-${index}`} label="Title">
                  <input
                    id={`contact-strip-title-${index}`}
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateStrip(index, "title", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field id={`contact-strip-copy-${index}`} label="Displayed text">
                  <input
                    id={`contact-strip-copy-${index}`}
                    type="text"
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
              Inquiry section
            </legend>
            <Field id="contact-inquiry-eyebrow" label="Eyebrow">
              <input
                id="contact-inquiry-eyebrow"
                type="text"
                value={form.inquiry.eyebrow}
                onChange={(event) =>
                  updateSection("inquiry", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-inquiry-heading-1" label="Heading line 1">
              <input
                id="contact-inquiry-heading-1"
                type="text"
                value={form.inquiry.headingLine1}
                onChange={(event) =>
                  updateSection("inquiry", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-inquiry-heading-2" label="Heading line 2">
              <input
                id="contact-inquiry-heading-2"
                type="text"
                value={form.inquiry.headingLine2}
                onChange={(event) =>
                  updateSection("inquiry", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-inquiry-copy" label="Body copy">
              <textarea
                id="contact-inquiry-copy"
                rows={3}
                value={form.inquiry.copy}
                onChange={(event) =>
                  updateSection("inquiry", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-inquiry-note" label="Supporting note">
              <textarea
                id="contact-inquiry-note"
                rows={2}
                value={form.inquiry.note}
                onChange={(event) =>
                  updateSection("inquiry", "note", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Form labels
            </legend>
            {FORM_LABEL_FIELDS.map(([key, label]) => (
              <Field key={key} id={`contact-form-label-${key}`} label={label}>
                <input
                  id={`contact-form-label-${key}`}
                  type="text"
                  value={form.form.labels[key]}
                  onChange={(event) => updateFormLabel(key, event.target.value)}
                  className={inputClass}
                />
              </Field>
            ))}
            <Field id="contact-form-placeholder" label="Message placeholder">
              <textarea
                id="contact-form-placeholder"
                rows={2}
                value={form.form.messagePlaceholder}
                onChange={(event) =>
                  updateFormField("messagePlaceholder", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-form-submit" label="Submit button">
              <input
                id="contact-form-submit"
                type="text"
                value={form.form.submitLabel}
                onChange={(event) =>
                  updateFormField("submitLabel", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Event type options
            </legend>
            <p className="text-sm text-neutral-500">
              Labels only. The submitted values stay the same.
            </p>
            {form.form.eventTypeLabels.map((label, index) => (
              <Field
                key={`event-type-${index}`}
                id={`contact-event-type-${index}`}
                label={index === 0 ? "Placeholder option" : `Option ${index}`}
              >
                <input
                  id={`contact-event-type-${index}`}
                  type="text"
                  value={label}
                  onChange={(event) =>
                    updateEventTypeLabel(index, event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            ))}
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Form success message
            </legend>
            <Field id="contact-success-eyebrow" label="Eyebrow">
              <input
                id="contact-success-eyebrow"
                type="text"
                value={form.inquiry.successEyebrow}
                onChange={(event) =>
                  updateSection("inquiry", "successEyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-success-copy" label="Message">
              <textarea
                id="contact-success-copy"
                rows={2}
                value={form.inquiry.successCopy}
                onChange={(event) =>
                  updateSection("inquiry", "successCopy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Service area
            </legend>
            <Field id="contact-area-eyebrow" label="Eyebrow">
              <input
                id="contact-area-eyebrow"
                type="text"
                value={form.serviceArea.eyebrow}
                onChange={(event) =>
                  updateSection("serviceArea", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-area-heading-1" label="Heading line 1">
              <input
                id="contact-area-heading-1"
                type="text"
                value={form.serviceArea.headingLine1}
                onChange={(event) =>
                  updateSection("serviceArea", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-area-heading-2" label="Heading line 2">
              <input
                id="contact-area-heading-2"
                type="text"
                value={form.serviceArea.headingLine2}
                onChange={(event) =>
                  updateSection("serviceArea", "headingLine2", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-area-copy" label="Body copy">
              <textarea
                id="contact-area-copy"
                rows={3}
                value={form.serviceArea.copy}
                onChange={(event) =>
                  updateSection("serviceArea", "copy", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-area-support" label="Supporting line">
              <textarea
                id="contact-area-support"
                rows={3}
                value={form.serviceArea.support}
                onChange={(event) =>
                  updateSection("serviceArea", "support", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Closing
            </legend>
            <Field id="contact-closing-eyebrow" label="Eyebrow">
              <input
                id="contact-closing-eyebrow"
                type="text"
                value={form.closing.eyebrow}
                onChange={(event) =>
                  updateSection("closing", "eyebrow", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-closing-heading-1" label="Heading line 1">
              <input
                id="contact-closing-heading-1"
                type="text"
                value={form.closing.headingLine1}
                onChange={(event) =>
                  updateSection("closing", "headingLine1", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="contact-closing-heading-2" label="Heading line 2">
              <input
                id="contact-closing-heading-2"
                type="text"
                value={form.closing.headingLine2}
                onChange={(event) =>
                  updateSection("closing", "headingLine2", event.target.value)
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
