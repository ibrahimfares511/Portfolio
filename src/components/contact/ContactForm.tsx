"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLocale, useMessages } from "next-intl";
import { PROJECT_TYPES, isEmail, isPhone, type ProjectType } from "@/lib/contact";

type Strings = {
  name: string;
  reach: string;
  reachHint: string;
  type: string;
  types: string[];
  idea: string;
  ideaHint: string;
  send: string;
  sending: string;
  required: string;
  invalidReach: string;
  successTitle: string;
  successText: string;
  error: string;
  sendAnother: string;
};
type Errors = Partial<Record<"name" | "reach" | "type" | "idea", string>>;

/**
 * The short guided form: four fields only (sitemap). Checks each field in the
 * browser, sends to /api/contact, then thanks the visitor with the thumbs-up
 * pose. A hidden "company" field and a minimum time on the form keep bots out.
 */
export function ContactForm() {
  const s = (useMessages() as { contactSection: Strings }).contactSection;
  const locale = useLocale();
  const id = useId();
  const opened = useRef(0);
  const [type, setType] = useState<ProjectType | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    opened.current = Date.now();
  }, []);

  const validate = (f: FormData): Errors => {
    const e: Errors = {};
    const name = String(f.get("name") ?? "").trim();
    const reach = String(f.get("reach") ?? "").trim();
    const idea = String(f.get("idea") ?? "").trim();
    if (!name) e.name = s.required;
    if (!reach) e.reach = s.required;
    else if (!isEmail(reach) && !isPhone(reach)) e.reach = s.invalidReach;
    if (!type) e.type = s.required;
    if (!idea) e.idea = s.required;
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const f = new FormData(form);
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) {
      form.querySelector<HTMLElement>(`[aria-invalid="true"], [data-invalid]`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          reach: f.get("reach"),
          type,
          idea: f.get("idea"),
          company: f.get("company") ?? "",
          locale,
          elapsed: Date.now() - opened.current,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      form.reset();
      setType(null);
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div role="status" className="flex min-h-[360px] flex-col items-center justify-center gap-4 py-6 text-center sm:flex-row sm:text-start">
        <picture className="shrink-0">
          <source type="image/avif" srcSet="/avatar/09-thumbs-up-320.avif" />
          <img src="/avatar/09-thumbs-up-320.webp" width={848} height={1264} alt="" className="h-[200px] w-auto" />
        </picture>
        <div>
          <p className="text-[24px] leading-[36px] font-medium text-ink">{s.successTitle}</p>
          <p className="mt-1 text-[16px] text-ink-muted">{s.successText}</p>
          <button
            type="button"
            onClick={() => {
              setState("idle");
              opened.current = Date.now();
            }}
            className="mt-5 text-[15px] text-petrol underline-offset-4 hover:underline"
          >
            {s.sendAnother}
          </button>
        </div>
      </div>
    );
  }

  const field =
    "mt-2 block w-full rounded-md border border-line bg-bg/60 px-4 text-[16px] text-ink placeholder:text-ink-muted/70 transition-colors focus:border-petrol focus:outline-none focus:ring-2 focus:ring-petrol/20 aria-[invalid=true]:border-clay";
  const hintCls = `text-[13px] text-ink-muted ${locale === "en" ? "first-letter:uppercase" : ""}`;
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 text-[13px] text-clay-strong">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      // Clear a field's message as soon as it is edited.
      onChange={(e) => {
        const name = (e.target as unknown as HTMLInputElement).name as keyof Errors;
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
        if (state === "error") setState("idle");
      }}
      className="grid gap-6"
    >
      {/* 1. Name */}
      <div>
        <label htmlFor={`${id}-name`} className="text-[15px] font-medium text-ink">
          {s.name}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          className={`${field} h-12`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id}-name-err` : undefined}
        />
        {err("name")}
      </div>

      {/* 2. Email or WhatsApp */}
      <div>
        <label htmlFor={`${id}-reach`} className="text-[15px] font-medium text-ink">
          {s.reach}
        </label>
        <p id={`${id}-reach-hint`} className={hintCls}>
          {s.reachHint}
        </p>
        <input
          id={`${id}-reach`}
          name="reach"
          dir="ltr"
          inputMode="email"
          autoComplete="email"
          className={`${field} h-12 ${locale === "ar" ? "text-end" : ""}`}
          aria-invalid={!!errors.reach}
          aria-describedby={`${id}-reach-hint${errors.reach ? ` ${id}-reach-err` : ""}`}
        />
        {err("reach")}
      </div>

      {/* 3. Project type */}
      <fieldset>
        <legend className="text-[15px] font-medium text-ink">{s.type}</legend>
        <div className="mt-3 flex flex-wrap gap-2" data-invalid={errors.type ? "" : undefined} tabIndex={errors.type ? -1 : undefined}>
          {PROJECT_TYPES.map((t, i) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full border px-4 py-2.5 text-[15px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-petrol/40 ${
                type === t ? "border-petrol bg-petrol text-bg" : "border-line bg-bg/60 text-ink hover:border-petrol/50"
              } ${locale === "en" ? "first-letter:uppercase" : ""}`}
            >
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
              {s.types[i]}
            </label>
          ))}
        </div>
        {err("type")}
      </fieldset>

      {/* 4. The idea */}
      <div>
        <label htmlFor={`${id}-idea`} className="text-[15px] font-medium text-ink">
          {s.idea}
        </label>
        <p id={`${id}-idea-hint`} className={hintCls}>
          {s.ideaHint}
        </p>
        <textarea
          id={`${id}-idea`}
          name="idea"
          rows={5}
          className={`${field} resize-y py-3 leading-[28px]`}
          aria-invalid={!!errors.idea}
          aria-describedby={`${id}-idea-hint${errors.idea ? ` ${id}-idea-err` : ""}`}
        />
        {err("idea")}
      </div>

      {/* Honeypot: hidden from people, bots fill it in. */}
      <div aria-hidden className="absolute -start-[9999px] h-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-clay-strong px-7 text-[16px] font-medium text-on-clay shadow-[0_8px_24px_-12px_var(--clay-strong)] transition-[filter,transform] hover:-translate-y-px hover:brightness-[1.06] disabled:cursor-wait disabled:opacity-70"
        >
          {state === "sending" ? s.sending : s.send}
          <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
        {state === "error" ? (
          <p role="alert" className="text-[14px] text-clay-strong">
            {s.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
