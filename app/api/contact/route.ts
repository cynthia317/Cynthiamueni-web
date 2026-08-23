import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// Sender identity vs. delivery inbox are deliberately separate:
// - EMAIL_FROM is the professional address visitors see ("From"). Gmail's SMTP relay only
//   honors a From address other than the authenticated login once it's added as a verified
//   "Send mail as" alias on that Gmail account (Settings > Accounts and Import > Send mail
//   as). Until that's configured, Gmail silently rewrites this back to CONTACT_EMAIL_USER —
//   delivery still succeeds, only the visible From falls back.
// - EMAIL_TO is where enquiries actually land.
const DEFAULT_FROM_NAME = "Cynthia Mueni Website";
const DEFAULT_FROM_EMAIL = "hello@cynthiamueni.com";
const DEFAULT_TO_EMAIL = "ndukucynthia02@gmail.com";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Best-effort, per-instance rate limit. Serverless functions are stateless and can run as
 * multiple concurrent instances, so this Map is NOT a reliable limit across all traffic —
 * it only catches rapid repeat submissions that happen to land on the same warm instance.
 * A real limit needs shared state (Vercel KV / Upstash Redis) or an edge/WAF-level rule.
 */
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

interface ContactPayload {
  name?: string;
  email?: string;
  organisation?: string;
  phone?: string;
  enquiryType?: string;
  subject?: string;
  message?: string;
  company?: string;
}

function buildTransporter() {
  const user = process.env.CONTACT_EMAIL_USER;
  const pass = process.env.CONTACT_EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing CONTACT_EMAIL_USER or CONTACT_EMAIL_PASSWORD environment variables.");
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (payload.company) {
    return NextResponse.json({ ok: true });
  }

  const name = payload.name?.trim().slice(0, MAX_FIELD_LENGTH) ?? "";
  const email = payload.email?.trim().slice(0, MAX_FIELD_LENGTH) ?? "";
  const organisation = payload.organisation?.trim().slice(0, MAX_FIELD_LENGTH) ?? "";
  const phone = payload.phone?.trim().slice(0, MAX_FIELD_LENGTH) ?? "";
  const enquiryType = payload.enquiryType?.trim().slice(0, MAX_FIELD_LENGTH) ?? "";
  const subject = payload.subject?.trim().slice(0, MAX_FIELD_LENGTH) ?? "";
  const message = payload.message?.trim().slice(0, MAX_MESSAGE_LENGTH) ?? "";

  if (!name || !email || !subject || !message || !enquiryType || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Missing or invalid required fields." }, { status: 400 });
  }

  // CONTACT_EMAIL_USER (the authenticated mailbox) is the safe default From — Gmail's SMTP
  // relay rejects or silently rewrites a From address it hasn't verified as a "Send mail as"
  // alias, which would otherwise make the send fail outright. Only use EMAIL_FROM once that
  // alias is actually verified.
  const fromEmail = process.env.EMAIL_FROM || process.env.CONTACT_EMAIL_USER || DEFAULT_FROM_EMAIL;
  const toEmail = process.env.EMAIL_TO || process.env.CONTACT_EMAIL_TO || DEFAULT_TO_EMAIL;

  try {
    const transporter = buildTransporter();
    await transporter.sendMail({
      from: `"${DEFAULT_FROM_NAME}" <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `[${enquiryType}] ${subject}`,
      text: [
        "New Portfolio Enquiry",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        organisation ? `Organisation: ${organisation}` : null,
        phone ? `Phone: ${phone}` : null,
        `Enquiry Type: ${enquiryType}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
        "",
        "Source: cynthiamueni.com contact form",
      ]
        .filter((line): line is string => Boolean(line))
        .join("\n"),
    });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
