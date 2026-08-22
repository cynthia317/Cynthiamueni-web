"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { CONTACT_EMAIL, HARUNLUCAS_DEV_URL } from "@/lib/constants";

type EnquiryType =
  | "osh"
  | "ehs-systems"
  | "digital-communication"
  | "professional-opportunity"
  | "collaboration"
  | "other";

const ENQUIRY_OPTIONS: { value: EnquiryType; label: string }[] = [
  { value: "osh", label: "Occupational Safety & Health" },
  { value: "ehs-systems", label: "EHS Systems" },
  { value: "digital-communication", label: "Digital Communication" },
  { value: "professional-opportunity", label: "Professional Opportunity" },
  { value: "collaboration", label: "Collaboration" },
  { value: "other", label: "Other" },
];

interface FormValues {
  name: string;
  email: string;
  organisation: string;
  phone: string;
  enquiryType: EnquiryType | "";
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  organisation: "",
  phone: "",
  enquiryType: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.enquiryType) errors.enquiryType = "Please select an enquiry type.";
  if (!values.subject.trim()) errors.subject = "Please add a subject.";
  if (!values.message.trim()) errors.message = "Please add a message.";
  return errors;
}

function buildMailto(values: FormValues) {
  const enquiryLabel = ENQUIRY_OPTIONS.find((option) => option.value === values.enquiryType)?.label ?? "General";
  const subjectLine = `[${enquiryLabel}] ${values.subject}`;
  const bodyLines = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    values.organisation ? `Organisation: ${values.organisation}` : null,
    values.phone ? `Phone: ${values.phone}` : null,
    `Enquiry type: ${enquiryLabel}`,
    "",
    values.message,
  ].filter((line): line is string => Boolean(line));

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

const FIELD_CLASSES =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600";
const FIELD_VALID = "border-slate-300 focus:border-amber-500 focus:ring-amber-500/30 dark:border-slate-700 dark:focus:border-amber-400";
const FIELD_INVALID = "border-red-400 focus:border-red-500 focus:ring-red-500/30 dark:border-red-500/70";
const LABEL_CLASSES = "text-sm font-medium text-slate-700 dark:text-slate-300";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });

      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-6 dark:border-red-500/25 dark:bg-red-500/[0.06] sm:p-8"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Something went wrong sending your message
          </p>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Please try again, or email me directly and I&apos;ll get back to you as soon as I can.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={buildMailto(values)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 underline decoration-amber-300 underline-offset-4 hover:decoration-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400 dark:decoration-amber-500/40"
          >
            {CONTACT_EMAIL}
          </a>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-sm font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:decoration-slate-700 dark:hover:text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-500/25 dark:bg-emerald-500/[0.06] sm:p-8"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-50">Your message has been sent</p>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Thanks for reaching out — I aim to respond to professional enquiries within 24 hours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 underline decoration-amber-300 underline-offset-4 hover:decoration-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400 dark:decoration-amber-500/40"
          >
            {CONTACT_EMAIL}
          </a>
          <button
            type="button"
            onClick={() => {
              setValues(INITIAL_VALUES);
              setStatus("idle");
            }}
            className="text-sm font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-slate-400 dark:decoration-slate-700 dark:hover:text-white"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="contact-form"
      noValidate
      onSubmit={handleSubmit}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
    >
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className={LABEL_CLASSES}>
              Name <span className="text-amber-600 dark:text-amber-400">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Your full name"
              className={`${FIELD_CLASSES} ${errors.name ? FIELD_INVALID : FIELD_VALID}`}
            />
            {errors.name ? (
              <p id="contact-name-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className={LABEL_CLASSES}>
              Email <span className="text-amber-600 dark:text-amber-400">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              className={`${FIELD_CLASSES} ${errors.email ? FIELD_INVALID : FIELD_VALID}`}
            />
            {errors.email ? (
              <p id="contact-email-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-organisation" className={LABEL_CLASSES}>
              Organisation
            </label>
            <input
              id="contact-organisation"
              name="organisation"
              type="text"
              autoComplete="organization"
              value={values.organisation}
              onChange={(event) => updateField("organisation", event.target.value)}
              placeholder="Company or organisation (optional)"
              className={`${FIELD_CLASSES} ${FIELD_VALID}`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-phone" className={LABEL_CLASSES}>
              Phone
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Optional"
              className={`${FIELD_CLASSES} ${FIELD_VALID}`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-enquiry-type" className={LABEL_CLASSES}>
            Enquiry Type <span className="text-amber-600 dark:text-amber-400">*</span>
          </label>
          <select
            id="contact-enquiry-type"
            name="enquiryType"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.enquiryType)}
            aria-describedby={errors.enquiryType ? "contact-enquiry-type-error" : undefined}
            value={values.enquiryType}
            onChange={(event) => updateField("enquiryType", event.target.value as EnquiryType)}
            className={`${FIELD_CLASSES} ${errors.enquiryType ? FIELD_INVALID : FIELD_VALID}`}
          >
            <option value="" disabled>
              Select an enquiry type
            </option>
            {ENQUIRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.enquiryType ? (
            <p id="contact-enquiry-type-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errors.enquiryType}
            </p>
          ) : null}

          {values.enquiryType === "other" ? (
            <p className="mt-1 rounded-lg border border-amber-200 bg-amber-50/60 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600 dark:border-amber-500/20 dark:bg-amber-500/[0.06] dark:text-slate-400">
              Looking for general software, websites or business digital solutions?{" "}
              <a
                href={HARUNLUCAS_DEV_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit HarunLucas Dev (opens in a new tab)"
                className="inline-flex items-center gap-1 font-semibold text-amber-700 underline decoration-amber-300 underline-offset-4 hover:decoration-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-400 dark:decoration-amber-500/40"
              >
                Visit HarunLucas Dev
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-subject" className={LABEL_CLASSES}>
            Subject <span className="text-amber-600 dark:text-amber-400">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            value={values.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            placeholder="What's this about?"
            className={`${FIELD_CLASSES} ${errors.subject ? FIELD_INVALID : FIELD_VALID}`}
          />
          {errors.subject ? (
            <p id="contact-subject-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errors.subject}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-message" className={LABEL_CLASSES}>
            Message <span className="text-amber-600 dark:text-amber-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Tell me a little about what you'd like to discuss."
            className={`${FIELD_CLASSES} resize-y ${errors.message ? FIELD_INVALID : FIELD_VALID}`}
          />
          {errors.message ? (
            <p id="contact-message-error" role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errors.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-fit"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Preparing your message…
            </>
          ) : (
            <>
              Send Message
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
