"use client";

import { useId, useState } from "react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  date: "",
  eventType: "",
  serviceType: "",
  guests: "",
  budget: "",
  location: "",
  message: "",
};

const DEFAULT_SUCCESS = {
  eyebrow: "Thank You",
  copy: "Thank you for contacting Golden Spoon. Your inquiry has been received. We’ll review your event details and get back to you shortly.",
  note: "Please note: submitting an inquiry does not reserve your event date.",
};

const DEFAULT_BOOKING_NOTICE =
  "Submitting an inquiry does not reserve your event date. Your date is confirmed upon approval of the proposal and receipt of the required deposit.";

const DEFAULT_SERVICE_TYPES = [
  { value: "", label: "Select service type" },
  { value: "drop-off", label: "Drop-Off Catering" },
  { value: "full-service", label: "Full-Service Catering" },
  { value: "staffed", label: "Staffed Service" },
  { value: "not-sure", label: "Not Sure — I’d Like a Recommendation" },
];

const DEFAULT_BUDGET_OPTIONS = [
  { value: "", label: "Select budget" },
  { value: "under-1000", label: "Under $1,000" },
  { value: "1000-2500", label: "$1,000 – $2,500" },
  { value: "2500-5000", label: "$2,500 – $5,000" },
  { value: "5000-10000", label: "$5,000 – $10,000" },
  { value: "10000-plus", label: "$10,000+" },
  { value: "not-sure", label: "Not Sure Yet" },
];

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
  serviceTypes = DEFAULT_SERVICE_TYPES,
  budgetOptions = DEFAULT_BUDGET_OPTIONS,
  success,
  bookingNotice = DEFAULT_BOOKING_NOTICE,
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
    serviceType: "Service Type",
    guests: "Number of Guests",
    budget: "Estimated Catering Budget",
    location: "Event Location",
    message: "Tell Us About Your Event",
    ...labels,
  };
  const confirmation = {
    eyebrow: success?.eyebrow || DEFAULT_SUCCESS.eyebrow,
    copy: DEFAULT_SUCCESS.copy,
    note: success?.note || DEFAULT_SUCCESS.note,
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
    if (!nextValues.serviceType.trim()) {
      nextErrors.serviceType = "Please select a service type.";
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
          {confirmation.eyebrow}
        </p>
        <p className="mt-3 text-[0.95rem] leading-7 text-ink lg:text-[18px] lg:leading-[1.7]">
          {confirmation.copy}
        </p>
        <p className="mt-4 text-[0.9rem] leading-6 text-ink-soft italic lg:text-[17.4px]">
          {confirmation.note}
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

        <Field
          id={`${formId}-serviceType`}
          label={fieldLabels.serviceType}
          error={errors.serviceType}
          errorId={`${formId}-serviceType-error`}
        >
          <select
            id={`${formId}-serviceType`}
            name="serviceType"
            required
            value={values.serviceType}
            onChange={(event) => update("serviceType", event.target.value)}
            aria-invalid={Boolean(errors.serviceType)}
            aria-describedby={
              errors.serviceType ? `${formId}-serviceType-error` : undefined
            }
            className={`${fieldClass} bg-ivory`}
          >
            {serviceTypes.map((option) => (
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

        <Field id={`${formId}-budget`} label={fieldLabels.budget}>
          <select
            id={`${formId}-budget`}
            name="budget"
            value={values.budget}
            onChange={(event) => update("budget", event.target.value)}
            className={`${fieldClass} bg-ivory`}
          >
            {budgetOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          className="inline-flex min-h-12 w-full items-center justify-center border border-gold bg-transparent px-8 text-center text-[0.68rem] font-medium tracking-[0.22em] text-gold uppercase lg:text-[0.816rem] transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ivory disabled:opacity-60 sm:w-auto lg:h-10 lg:min-h-10"
        >
          {submitting ? "Sending…" : submitLabel}
        </button>
        <p className="mt-4 max-w-[36rem] text-[0.78rem] leading-5 text-ink-soft lg:text-[0.864rem] lg:leading-6">
          {bookingNotice}
        </p>
      </div>
    </form>
  );
}
