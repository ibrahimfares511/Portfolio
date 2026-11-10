"use client";

import type { Project } from "@/lib/projects";
import { projectBySlug } from "@/lib/projects";
import { LoopVideo } from "./LoopVideo";

type Lang = "ar" | "en";
export type CardStrings = { cta: string; status: { live: string; delivered: string } };

/**
 * One project card: the screen recording in a soft browser frame on the
 * brand gradient, then the name, line, role, two numbers, the link to the
 * related card and "Read the story". All copy comes from project.json.
 */
export function ProjectCard({
  project: p,
  index,
  total,
  lang,
  strings,
  active,
}: {
  project: Project;
  index: number;
  total: number;
  lang: Lang;
  strings: CardStrings;
  active: boolean;
}) {
  const isAr = lang === "ar";
  const pad = (n: number) => String(n).padStart(2, "0");
  const live = p.status === "live";
  const links = [
    ...p.related.map((r) => ({ slug: r.slug, label: r.relation[lang], name: projectBySlug(r.slug)?.name[lang] ?? r.slug })),
  ];

  return (
    <article
      aria-labelledby={`project-${p.slug}-name`}
      className="relative grid h-full grid-cols-1 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_60px_-40px_rgba(22,48,58,0.45)] lg:grid-cols-12 dark:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
    >
      {/* Media */}
      <div className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_15%_0%,var(--sky-soft),transparent_60%),radial-gradient(90%_80%_at_100%_100%,var(--clay-soft),transparent_65%)] p-4 sm:p-6 lg:col-span-7 lg:p-8 dark:bg-[radial-gradient(120%_90%_at_15%_0%,var(--sky-soft),transparent_60%),radial-gradient(80%_70%_at_100%_100%,color-mix(in_oklab,var(--clay-soft)_55%,transparent),transparent_65%)]">
        <div data-reveal="block" className="w-full overflow-hidden rounded-lg border border-line/80 bg-surface shadow-[0_24px_50px_-28px_rgba(22,48,58,0.55)]" dir="ltr">
          <div className="flex h-7 items-center gap-1.5 border-b border-line bg-bg/70 px-3" aria-hidden>
            <span className="size-2 rounded-full bg-line" />
            <span className="size-2 rounded-full bg-line" />
            <span className="size-2 rounded-full bg-line" />
          </div>
          <LoopVideo
            mp4={p.media.loop.mp4}
            webm={p.media.loop.webm}
            poster={p.media.loop.poster}
            active={active}
            label={p.title[lang]}
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-4 p-5 sm:p-7 lg:col-span-5 lg:gap-5 lg:p-9">
        <div data-reveal="text" className="flex items-center justify-between gap-3">
          <span className="num font-display text-[22px] leading-none text-petrol" aria-hidden>
            {pad(index + 1)}
            <span className="text-ink-muted/60"> / {pad(total)}</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[13px] text-ink-muted">
            <span className={`relative size-2 rounded-full ${live ? "bg-petrol" : "bg-ink-muted/50"}`} aria-hidden>
              {live ? <span className="absolute inset-0 animate-ping rounded-full bg-petrol/60" /> : null}
            </span>
            {strings.status[p.status]}
          </span>
        </div>

        <div data-reveal="text">
          {p.partOf ? (
            <a
              href={`#project-${p.partOf.slug}`}
              className="mb-2 inline-flex items-center gap-1.5 rounded-sm bg-sky-soft/70 px-2 py-0.5 text-[13px] text-petrol transition-colors hover:bg-sky-soft"
            >
              {p.partOf.tag[lang]}
            </a>
          ) : null}
          <h3
            id={`project-${p.slug}-name`}
            className={isAr ? "text-[26px] leading-[40px] font-medium md:text-[30px] md:leading-[46px]" : "font-latin text-[26px] leading-[34px] font-bold tracking-[-0.01em] md:text-[30px] md:leading-[38px]"}
          >
            {p.name[lang]}
          </h3>
          <p className="mt-2 text-[16px] leading-[28px] text-ink-muted md:text-[17px] md:leading-[30px]">{p.card.line[lang]}</p>
        </div>

        <p data-reveal="text" className="flex items-start gap-2 text-[14px] leading-[22px] text-ink">
          <span className="mt-[9px] h-px w-4 shrink-0 bg-clay" aria-hidden />
          {p.card.role[lang]}
        </p>

        <dl data-reveal="text" className="grid grid-cols-2 gap-4 border-t border-line pt-4">
          {p.card.stats.map((s, i) => (
            <div key={i} className="flex flex-col-reverse gap-1">
              <dt className="text-[13px] leading-[20px] text-ink-muted">{s.label[lang]}</dt>
              <dd className="num self-start font-display text-[34px] leading-[38px] text-petrol md:text-[40px] md:leading-[44px]">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div data-reveal="text" className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
          {links.map((l) => (
            <a
              key={l.slug}
              href={`#project-${l.slug}`}
              className="group inline-flex max-w-full items-center gap-2 text-[13px] leading-[20px] text-ink-muted transition-colors hover:text-petrol"
            >
              <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M6 3h7v7M13 3 4 12" />
              </svg>
              <span>
                {l.label} · <span className="text-ink group-hover:text-petrol">{l.name}</span>
              </span>
            </a>
          ))}
          <a
            href={`/${lang}/projects/${p.slug}`}
            className="ms-auto inline-flex h-11 items-center gap-2 rounded-md border-[1.5px] border-ink/80 px-5 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            {strings.cta}
            <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
