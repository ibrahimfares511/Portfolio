import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { PROJECT_TYPES, isEmail, isPhone } from "@/lib/contact";

/**
 * Contact form → email to Ibrahim.
 *
 * Sends through any SMTP server set in the environment (see .env.example).
 * Easiest on the VPS: a Gmail "App password" (smtp.gmail.com:465). Resend or
 * another provider's SMTP works the same way.
 *
 * Spam guards: a hidden honeypot field, a minimum time on the form, and a
 * small per-IP rate limit (in memory; fine for one VPS process).
 */
export const runtime = "nodejs";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  reach: z
    .string()
    .trim()
    .min(5)
    .max(160)
    .refine((v) => isEmail(v) || isPhone(v)),
  type: z.enum(PROJECT_TYPES),
  idea: z.string().trim().min(1).max(4000),
  locale: z.enum(["ar", "en"]).default("ar"),
  company: z.string().max(0).optional(), // honeypot: must stay empty
  elapsed: z.number().min(2500), // ms the form was open before sending
});

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5; // 5 messages per 10 minutes per IP
}

const TYPE_LABEL = {
  internal: "نظام داخلي لشركة / Internal system for a company",
  platform: "منصة أو تطبيق ويب / Platform or web app",
  other: "شيء آخر / Something else",
};

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });

  let data: z.infer<typeof Body>;
  try {
    data = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const lines = [
    `Name / الاسم: ${data.name}`,
    `Reach / التواصل: ${data.reach}`,
    `Type / النوع: ${TYPE_LABEL[data.type]}`,
    `Site language / لغة الموقع: ${data.locale}`,
    "",
    data.idea,
  ];
  const text = lines.join("\n");

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] SMTP not configured; message:\n" + text);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[contact] SMTP is not configured");
    return NextResponse.json({ ok: false, error: "config" }, { status: 503 });
  }

  try {
    const port = Number(SMTP_PORT ?? 465);
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: CONTACT_FROM || `ibrahimfares.dev <${SMTP_USER}>`,
      to: CONTACT_TO || "ibrahimfares511@gmail.com",
      replyTo: isEmail(data.reach) ? data.reach : undefined,
      subject: `ibrahimfares.dev: ${data.name}`,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] send failed", e);
    return NextResponse.json({ ok: false, error: "send" }, { status: 502 });
  }
}
