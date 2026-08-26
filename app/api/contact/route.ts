import { NextRequest, NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/constants";

// Server-only route — the browser never sees BREVO_API_KEY or the destination inbox.
// Flow: visitor -> this route (validates + rate-limits) -> Brevo Transactional Email API
// -> CONTACT_TO_EMAIL. Reply-To is always the visitor's own address, never the sender.
export const runtime = "nodejs";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  organisation: 160,
  phone: 40,
  subject: 200,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENQUIRY_LABELS: Record<string, string> = {
  osh: "Occupational Safety & Health",
  "ehs-systems": "EHS Systems",
  "digital-communication": "Digital Communication",
  "professional-opportunity": "Professional Opportunity",
  collaboration: "Collaboration",
  other: "Other",
};

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  organisation?: unknown;
  phone?: unknown;
  enquiryType?: unknown;
  subject?: unknown;
  message?: unknown;
  hp_field?: unknown; // honeypot — a real visitor never fills this in
}

function log(message: string, data?: Record<string, unknown>) {
  console.info(`[contact] ${message}`, data ?? "");
}

// Best-effort, per-instance only. Vercel serverless functions are stateless across cold
// starts and can run in multiple regions/instances, so this does not guarantee a hard cap —
// it only blunts naive repeated submissions from the same warm instance. See final report.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ValidatedFields {
  name: string;
  email: string;
  organisation: string;
  phone: string;
  enquiryLabel: string;
  subject: string;
  message: string;
}

function validate(body: ContactPayload): { errors: Record<string, string> } | { fields: ValidatedFields } {
  const errors: Record<string, string> = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const organisation = typeof body.organisation === "string" ? body.organisation.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const enquiryType = typeof body.enquiryType === "string" ? body.enquiryType.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > MAX_LENGTHS.name) errors.name = "Name is too long.";

  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_PATTERN.test(email) || email.length > MAX_LENGTHS.email) {
    errors.email = "Please enter a valid email address.";
  }

  if (organisation.length > MAX_LENGTHS.organisation) errors.organisation = "Organisation is too long.";
  if (phone.length > MAX_LENGTHS.phone) errors.phone = "Phone number is too long.";

  if (!subject) errors.subject = "Please add a subject.";
  else if (subject.length > MAX_LENGTHS.subject) errors.subject = "Subject is too long.";

  if (!message) errors.message = "Please add a message.";
  else if (message.length > MAX_LENGTHS.message) errors.message = "Message is too long.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    fields: {
      name,
      email,
      organisation,
      phone,
      enquiryLabel: ENQUIRY_LABELS[enquiryType] ?? "General",
      subject,
      message,
    },
  };
}

function buildEmailContent(fields: ValidatedFields) {
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });

  const rows: [string, string][] = [
    ["Name", fields.name],
    ["Email", fields.email],
  ];
  if (fields.organisation) rows.push(["Organisation", fields.organisation]);
  if (fields.phone) rows.push(["Phone", fields.phone]);
  rows.push(["Enquiry Type", fields.enquiryLabel]);
  rows.push(["Subject", fields.subject]);

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#0f172a;vertical-align:top;white-space:nowrap;">${escapeHtml(
          label
        )}</td><td style="padding:6px 0;color:#334155;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const htmlContent = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
      <h2 style="margin:0 0 4px;font-size:18px;color:#0f172a;">New Website Enquiry</h2>
      <p style="margin:0 0 16px;font-size:12px;color:#94a3b8;">cynthiamueni.com Contact Form</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${htmlRows}</table>
      <div style="margin-top:16px;">
        <div style="font-weight:600;font-size:14px;color:#0f172a;margin-bottom:6px;">Message</div>
        <div style="white-space:pre-wrap;border-left:3px solid #d97706;padding:2px 0 2px 12px;font-size:14px;color:#334155;">${escapeHtml(
          fields.message
        )}</div>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;">
        Submitted ${escapeHtml(timestamp)} (Africa/Nairobi) &middot; Source: cynthiamueni.com Contact Form
      </p>
    </div>
  </body>
</html>`;

  const textLines = [
    "NEW WEBSITE ENQUIRY",
    "",
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
  ];
  if (fields.organisation) textLines.push(`Organisation: ${fields.organisation}`);
  if (fields.phone) textLines.push(`Phone: ${fields.phone}`);
  textLines.push(
    `Enquiry Type: ${fields.enquiryLabel}`,
    `Subject: ${fields.subject}`,
    "",
    "Message:",
    fields.message,
    "",
    `Submitted: ${timestamp} (Africa/Nairobi)`,
    "Source: cynthiamueni.com Contact Form"
  );

  return { htmlContent, textContent: textLines.join("\n") };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  log("request received");

  if (!checkRateLimit(ip)) {
    log("result", { outcome: "failure", reason: "rate_limited" });
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    log("result", { outcome: "failure", reason: "invalid_body" });
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: a real visitor never fills this hidden field in. Return a generic success so
  // bots get no signal, but skip sending — mirrors the previous client-side behaviour.
  const honeypotTriggered = typeof body.hp_field === "string" && body.hp_field.trim() !== "";
  log("honeypot_triggered", { value: honeypotTriggered });
  if (honeypotTriggered) {
    log("result", { outcome: "success", reason: "honeypot_short_circuit_no_email_sent" });
    return NextResponse.json({ ok: true });
  }

  const result = validate(body);
  const validationPassed = !("errors" in result);
  log("validation_passed", { value: validationPassed, failedFields: "errors" in result ? Object.keys(result.errors) : [] });
  if ("errors" in result) {
    log("result", { outcome: "failure", reason: "validation" });
    return NextResponse.json({ ok: false, error: "validation", fields: result.errors }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || CONTACT_EMAIL;
  log("env_vars_present", {
    BREVO_API_KEY: Boolean(apiKey),
    CONTACT_TO_EMAIL: Boolean(toEmail),
    CONTACT_FROM_EMAIL: Boolean(process.env.CONTACT_FROM_EMAIL),
  });

  if (!apiKey || !toEmail) {
    console.error("[contact] Missing required environment variable(s): BREVO_API_KEY and/or CONTACT_TO_EMAIL.");
    log("result", { outcome: "failure", reason: "server_not_configured" });
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  const { fields } = result;
  const { htmlContent, textContent } = buildEmailContent(fields);

  try {
    log("brevo_request_attempted", { value: true });
    const brevoResponse = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "Cynthia Mueni Website", email: fromEmail },
        to: [{ email: toEmail }],
        replyTo: { email: fields.email, name: fields.name },
        subject: `New website enquiry — ${fields.subject}`,
        htmlContent,
        textContent,
      }),
    });

    const responseBody = await brevoResponse.text().catch(() => "");
    log("brevo_response", { status: brevoResponse.status, body: responseBody.slice(0, 500) });

    if (!brevoResponse.ok) {
      console.error(`[contact] Brevo API rejected the request (status ${brevoResponse.status}): ${responseBody}`);
      log("result", { outcome: "failure", reason: "send_failed", brevoStatus: brevoResponse.status });
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    log("result", { outcome: "success", reason: "brevo_accepted" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Unexpected error calling Brevo:", error);
    log("result", { outcome: "failure", reason: "brevo_fetch_threw" });
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
