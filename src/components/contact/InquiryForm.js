"use client";

import { useId, useState } from "react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  date: "",
  eventType: "",
  guests: "",
  location: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "gs-field block w-full appearance-none rounded-none border-0 border-b border-gold/40 bg-transparent px-0 py-2.5 text-[0.95rem] text-ink lg:text-[1.14rem] outline-none transition-colors placeholder:text-ink/40";

const labelClass =
  "block text-[0.68rem] font-medium tracking-[0.18em] text-ink uppercase lg:text-[0.816rem]";

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.72rem] leading-4 text-gold-deep lg:text-[0.864rem]">
      {message}
    </p>
  );
}

function Field({ id, label, className = "", error, errorId, children }) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        {children}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export default function InquiryForm({
  eventTypes,
  success,
  labels = {},
  messagePlaceholder = "Tell us about your event, preferences and anything you’d like us to know.",
  submitLabel = "Send Inquiry",
}) {
  const fieldLabels = {
    name: "Full Name *",
    email: "Email *",
    phone: "Phone",
    date: "Event Date",
    eventType: "Event Type",
    guests: "Number of Guests",
    location: "Event Location",
    message: "Tell Us About Your Event",
    ...labels,
  };
  const formId = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryError, setDeliveryError] = useState(null);
  const [honeypot, setHoneypot] = useState("");

  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  }

  function validate(nextValues) {
    const nextErrors = {};
    if (!nextValues.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }
    if (!nextValues.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!emailPattern.test(nextValues.email.trim())) {
      nextErrors.email = "Please enter a valid email.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setDeliveryError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload.errors && typeof payload.errors === "object") {
          setErrors(payload.errors);
        }
        setDeliveryError(
          typeof payload.error === "string"
            ? payload.error
            : "Your inquiry could not be sent. Please try again.",
        );
        return;
      }

      setValues(initialValues);
      setSubmitted(true);
    } catch {
      setDeliveryError("Your inquiry could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="flex min-h-[18rem] flex-col justify-center lg:min-h-[22rem]"
        role="status"
        aria-live="polite"
      >
        <p className="text-[0.68rem] font-medium tracking-[0.26em] text-gold uppercase lg:text-[0.816rem]">
          {success.eyebrow}
        </p>
        <p className="mt-3 font-serif text-[1.7rem] leading-[1.12] font-medium tracking-tight text-ink uppercase sm:text-[1.95rem] lg:text-[2.34rem]">
          {success.copy}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="min-w-0">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label={fieldLabels.name}
          error={errors.name}
          errorId={`${formId}-name-error`}
        >
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className={fieldClass}
          />
        </Field>

        <Field
          id={`${formId}-email`}
          label={fieldLabels.email}
          error={errors.email}
          errorId={`${formId}-email-error`}
        >
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            className={fieldClass}
          />
        </Field>

        <Field id={`${formId}-phone`} label={fieldLabels.phone}>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field id={`${formId}-date`} label={fieldLabels.date}>
          <input
            id={`${formId}-date`}
            name="date"
            type="date"
            value={values.date}
            onChange={(event) => update("date", event.target.value)}
            className={`${fieldClass} [color-scheme:light]`}
          />
        </Field>

        <Field id={`${formId}-eventType`} label={fieldLabels.eventType}>
          <select
            id={`${formId}-eventType`}
            name="eventType"
            value={values.eventType}
            onChange={(event) => update("eventType", event.target.value)}
            className={`${fieldClass} bg-ivory`}
          >
            {eventTypes.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field id={`${formId}-guests`} label={fieldLabels.guests}>
          <input
            id={`${formId}-guests`}
            name="guests"
            type="number"
            inputMode="numeric"
            value={values.guests}
            onChange={(event) => update("guests", event.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field
          id={`${formId}-location`}
          label={fieldLabels.location}
          className="sm:col-span-2"
        >
          <input
            id={`${formId}-location`}
            name="location"
            type="text"
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
            className={fieldClass}
          />
        </Field>

        <Field
          id={`${formId}-message`}
          label={fieldLabels.message}
          className="sm:col-span-2"
        >
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder={messagePlaceholder}
            className={`${fieldClass} resize-y`}
          />
        </Field>
      </div>

      <div className="mt-6">
        {deliveryError ? (
          <p className="mb-3 text-[0.72rem] leading-4 text-gold-deep lg:text-[0.864rem]" role="alert">
            {deliveryError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex min-h-12 w-full items-center justify-center border border-gold bg-gold px-8 text-center text-[0.68rem] font-medium tracking-[0.22em] text-ivory uppercase lg:text-[0.816rem] transition-colors duration-300 hover:border-gold-deep hover:bg-gold-deep disabled:opacity-60 sm:w-auto lg:h-10 lg:min-h-10"
        >
          {submitting ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
