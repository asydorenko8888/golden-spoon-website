"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/data/siteContent";
import {
  SITE_SETTINGS_ID,
  getDefaultSettingsForm,
  mergeSettingsForm,
} from "@/lib/settings/content";

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

export default function SettingsEditor() {
  const [form, setForm] = useState(getDefaultSettingsForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("data")
          .eq("id", SITE_SETTINGS_ID)
          .maybeSingle();

        if (!active) return;

        if (error) {
          setMessage({
            type: "error",
            text:
              error.message ||
              "Could not load Settings. Run supabase/migrations/010_site_settings.sql if the table is missing.",
          });
          setForm(getDefaultSettingsForm());
          return;
        }

        setForm(mergeSettingsForm(data?.data));
      } catch (error) {
        if (active) {
          setMessage({
            type: "error",
            text:
              error instanceof Error
                ? error.message
                : "Could not load Settings.",
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

  function updateList(section, field, index, value) {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: current[section][field].map((item, itemIndex) =>
          itemIndex === index ? value : item,
        ),
      },
    }));
  }

  function updateHeading(field, value) {
    setForm((current) => ({
      ...current,
      footer: {
        ...current.footer,
        headings: { ...current.footer.headings, [field]: value },
      },
    }));
  }

  async function onSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("site_settings").upsert({
        id: SITE_SETTINGS_ID,
        data: form,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(
          error.message ||
            "Could not save Settings. Run supabase/migrations/010_site_settings.sql if the table is missing.",
        );
      }

      setMessage({ type: "success", text: "Site settings saved." });
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
        Settings
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
        Edit global website information used in the header and footer. Page
        content and the inquiry form recipient stay separate.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading settings…</p>
      ) : (
        <form onSubmit={onSave} className="mt-8 max-w-3xl space-y-10">
          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Company
            </legend>
            <Field id="settings-name" label="Company name">
              <input
                id="settings-name"
                type="text"
                value={form.company.name}
                onChange={(event) =>
                  updateSection("company", "name", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="settings-tagline" label="Tagline">
              <textarea
                id="settings-tagline"
                rows={2}
                value={form.company.tagline}
                onChange={(event) =>
                  updateSection("company", "tagline", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="settings-location" label="Location">
              <input
                id="settings-location"
                type="text"
                value={form.company.location}
                onChange={(event) =>
                  updateSection("company", "location", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field
              id="settings-copyright"
              label="Mobile copyright name"
              hint="Currently shown in the mobile footer copyright line."
            >
              <input
                id="settings-copyright"
                type="text"
                value={form.company.copyrightName}
                onChange={(event) =>
                  updateSection("company", "copyrightName", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="settings-meta-title" label="Browser title">
              <input
                id="settings-meta-title"
                type="text"
                value={form.company.metaTitle}
                onChange={(event) =>
                  updateSection("company", "metaTitle", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="settings-meta-description" label="Browser description">
              <textarea
                id="settings-meta-description"
                rows={3}
                value={form.company.metaDescription}
                onChange={(event) =>
                  updateSection("company", "metaDescription", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Contact
            </legend>
            <Field id="settings-phone" label="Public phone">
              <input
                id="settings-phone"
                type="text"
                value={form.contact.phone}
                onChange={(event) =>
                  updateSection("contact", "phone", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field
              id="settings-email"
              label="Public email"
              hint="Leave blank to keep the current “email to be confirmed” footer state. This does not change the form recipient."
            >
              <input
                id="settings-email"
                type="text"
                value={form.contact.email}
                onChange={(event) =>
                  updateSection("contact", "email", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Social media
            </legend>
            <Field id="settings-instagram-handle" label="Instagram handle">
              <input
                id="settings-instagram-handle"
                type="text"
                value={form.contact.instagramHandle}
                onChange={(event) =>
                  updateSection("contact", "instagramHandle", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field id="settings-instagram-url" label="Instagram URL">
              <input
                id="settings-instagram-url"
                type="text"
                value={form.contact.instagramUrl}
                onChange={(event) =>
                  updateSection("contact", "instagramUrl", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Header and navigation
            </legend>
            {form.nav.map((label, index) => (
              <Field
                key={site.navigation[index].href}
                id={`settings-nav-${index}`}
                label={`${site.navigation[index].href} label`}
              >
                <input
                  id={`settings-nav-${index}`}
                  type="text"
                  value={label}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nav: current.nav.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            ))}
            <Field id="settings-cta-short" label="Header / footer short CTA">
              <input
                id="settings-cta-short"
                type="text"
                value={form.cta.short}
                onChange={(event) => updateSection("cta", "short", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="settings-cta-full" label="Mobile menu CTA">
              <input
                id="settings-cta-full"
                type="text"
                value={form.cta.full}
                onChange={(event) => updateSection("cta", "full", event.target.value)}
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Footer labels
            </legend>
            <Field id="settings-heading-explore" label="Explore heading">
              <input
                id="settings-heading-explore"
                type="text"
                value={form.footer.headings.explore}
                onChange={(event) => updateHeading("explore", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="settings-heading-quick" label="Quick links heading">
              <input
                id="settings-heading-quick"
                type="text"
                value={form.footer.headings.quickLinks}
                onChange={(event) => updateHeading("quickLinks", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="settings-heading-services" label="Services heading">
              <input
                id="settings-heading-services"
                type="text"
                value={form.footer.headings.services}
                onChange={(event) => updateHeading("services", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="settings-heading-area" label="Service area heading">
              <input
                id="settings-heading-area"
                type="text"
                value={form.footer.headings.serviceArea}
                onChange={(event) => updateHeading("serviceArea", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="settings-heading-contact" label="Contact heading">
              <input
                id="settings-heading-contact"
                type="text"
                value={form.footer.headings.contact}
                onChange={(event) => updateHeading("contact", event.target.value)}
                className={inputClass}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Footer quick links
            </legend>
            {form.footer.quickLinks.map((label, index) => (
              <Field
                key={site.footer.quickLinks[index].href}
                id={`settings-quick-${index}`}
                label={site.footer.quickLinks[index].href}
              >
                <input
                  id={`settings-quick-${index}`}
                  type="text"
                  value={label}
                  onChange={(event) =>
                    updateList("footer", "quickLinks", index, event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            ))}
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Footer services
            </legend>
            {form.footer.services.map((label, index) => (
              <Field
                key={`desktop-service-${index}`}
                id={`settings-service-${index}`}
                label={`Desktop item ${index + 1}`}
              >
                <input
                  id={`settings-service-${index}`}
                  type="text"
                  value={label}
                  onChange={(event) =>
                    updateList("footer", "services", index, event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            ))}
            {form.footer.mobileServices.map((label, index) => (
              <Field
                key={`mobile-service-${index}`}
                id={`settings-mobile-service-${index}`}
                label={`Mobile item ${index + 1}`}
              >
                <input
                  id={`settings-mobile-service-${index}`}
                  type="text"
                  value={label}
                  onChange={(event) =>
                    updateList("footer", "mobileServices", index, event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            ))}
          </fieldset>

          <fieldset className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
              Footer service area
            </legend>
            {form.footer.serviceArea.map((label, index) => (
              <Field
                key={`area-${index}`}
                id={`settings-area-${index}`}
                label={`Desktop item ${index + 1}`}
              >
                <input
                  id={`settings-area-${index}`}
                  type="text"
                  value={label}
                  onChange={(event) =>
                    updateList("footer", "serviceArea", index, event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            ))}
            {form.footer.mobileServiceArea.map((label, index) => (
              <Field
                key={`mobile-area-${index}`}
                id={`settings-mobile-area-${index}`}
                label={`Mobile item ${index + 1}`}
              >
                <input
                  id={`settings-mobile-area-${index}`}
                  type="text"
                  value={label}
                  onChange={(event) =>
                    updateList(
                      "footer",
                      "mobileServiceArea",
                      index,
                      event.target.value,
                    )
                  }
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
