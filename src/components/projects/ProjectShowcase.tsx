"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type { Project } from "@/lib/projects";
import { projectBySlug } from "@/lib/projects";
import { LoopVideo } from "./LoopVideo";

gsap.registerPlugin(ScrollToPlugin);

type Lang = "ar" | "en";
export type ShowcaseStrings = {
  cta: string;
  status: { live: string; delivered: string };
  next: string;
  prev: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Selected work" as a horizontal showcase.
 *
 * Desktop (lg+): the section is one screen per project; the stage sticks to the screen while the page
 * scrolls through it, and every scroll step (the SectionPager moves exactly one screen here) swaps the
 * project with a horizontal wipe: the old one slides out, the new screen recording is revealed from
 * the side and its text comes in word-group by word-group out of a blur.
 *
 * Phones and tablets: a native horizontal swipe carousel (scroll-snap), one project per card.
 * Only the project in front plays its video.
 */
export function ProjectShowcase({
  projects,
  lang,
  strings,
  title,
  sub,
}: {
  projects: Project[];
  lang: Lang;
  strings: ShowcaseStrings;
  title: string;
  sub: string;
}) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const shown = useRef(0);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const isAr = lang === "ar";
  const n = projects.length;
  const indexOf = (slug: string) => projects.findIndex((p) => p.slug === slug);

  const desktop = () => window.matchMedia("(min-width: 1024px)").matches;

  // Go to a project: on desktop scroll the page to its screen, on phones scroll the carousel.
  const goTo = useCallback((i: number) => {
    const k = Math.max(0, Math.min(n - 1, i));
    const sec = section.current, list = track.current;
    if (!sec || !list) return;
    if (desktop()) {
      const top = sec.getBoundingClientRect().top + window.scrollY + k * window.innerHeight;
      gsap.to(window, { scrollTo: { y: top, autoKill: false }, duration: 0.9, ease: "power3.out" });
    } else {
      const li = list.children[k] as HTMLElement | undefined;
      li?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [n]);

  // Which project is in front.
  useEffect(() => {
    const sec = section.current, list = track.current;
    if (!sec || !list) return;
    let raf = 0;
    let lastRaw = 0;
    const read = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      setInView(r.bottom > vh * 0.25 && r.top < vh * 0.75);
      if (desktop()) {
        // switch early in the scroll (15% of the way), so the swap starts with the wheel, not halfway through
        const raw = -r.top / vh;
        const down = raw >= lastRaw;
        lastRaw = raw;
        const k = down ? Math.floor(raw + 0.85) : Math.ceil(raw - 0.85);
        setActive(Math.max(0, Math.min(n - 1, k)));
      } else {
        // the card whose centre is closest to the carousel's centre
        const c = list.getBoundingClientRect();
        const mid = c.left + c.width / 2;
        let best = 0, d = Infinity;
        Array.from(list.children).forEach((li, i) => {
          const b = (li as HTMLElement).getBoundingClientRect();
          const dd = Math.abs(b.left + b.width / 2 - mid);
          if (dd < d) { d = dd; best = i; }
        });
        setActive(best);
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    list.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      list.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  // The swap (desktop only).
  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const from = shown.current, to = active;
    if (from === to) return;
    shown.current = to;
    const slides = Array.from(list.children) as HTMLElement[];
    if (!desktop()) {
      gsap.set(slides, { clearProps: "visibility" });
      return;
    }
    const out = slides[from], inn = slides[to];
    if (!out || !inn) return;
    tl.current?.progress(1).kill();
    const q = (el: HTMLElement, s: string) => Array.from(el.querySelectorAll<HTMLElement>(s));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(out, { visibility: "hidden" });
      gsap.set(inn, { visibility: "visible" });
      return;
    }
    // forward = towards the end of the reading direction
    const fwd = to > from ? 1 : -1;
    const toStart = (document.documentElement.dir === "rtl" ? -1 : 1) * fwd; // +1: new one comes from the right
    const t = gsap.timeline({ defaults: { overwrite: "auto" } });
    t.to(q(out, "[data-txt]"), { y: -14, opacity: 0, filter: "blur(6px)", duration: 0.32, stagger: 0.025, ease: "power2.in" }, 0)
      .to(q(out, "[data-media]"), { xPercent: -10 * toStart, opacity: 0, scale: 0.96, duration: 0.5, ease: "power2.in" }, 0)
      .to(q(out, "[data-num]"), { yPercent: -60 * fwd, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
      .set(out, { visibility: "hidden" })
      .set(inn, { visibility: "visible" }, 0.28)
      .fromTo(
        q(inn, "[data-media]"),
        { xPercent: 0, opacity: 1, scale: 1, clipPath: toStart > 0 ? "inset(0% 0% 0% 100% round 28px)" : "inset(0% 100% 0% 0% round 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1, ease: "power4.out", clearProps: "clipPath" },
        0.28,
      )
      .fromTo(q(inn, "[data-media-in]"), { scale: 1.14, xPercent: 6 * toStart }, { scale: 1, xPercent: 0, duration: 1.25, ease: "power3.out", clearProps: "transform" }, 0.28)
      .fromTo(q(inn, "[data-num]"), { yPercent: 60 * fwd, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.4)
      .fromTo(
        q(inn, "[data-txt]"),
        { y: 22, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, stagger: 0.06, ease: "power3.out", clearProps: "filter,transform" },
        0.45,
      );
    tl.current = t;
  }, [active]);

  // Leaving desktop (resize): drop the inline states the swap left behind.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const reset = () => {
      const list = track.current;
      if (!list) return;
      tl.current?.progress(1).kill();
      const slides = Array.from(list.children) as HTMLElement[];
      gsap.set(slides.flatMap((s) => [s, ...Array.from(s.querySelectorAll("[data-media],[data-media-in],[data-txt],[data-num]"))]), { clearProps: "all" });
      shown.current = active;
    };
    mq.addEventListener("change", reset);
    return () => mq.removeEventListener("change", reset);
  }, [active]);

  return (
    <div
      ref={section}
      className="relative lg:h-[calc(var(--n)*100dvh)]"
      style={{ ["--n" as string]: n }}
      data-screens=""
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:pt-[92px] lg:pb-6">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:min-h-0">
          {/* Title, counter, arrows */}
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div className="max-w-2xl">
              <h2
                id="projects-title"
                className={
                  isAr
                    ? "text-[30px] leading-[46px] font-medium md:text-[38px] md:leading-[56px]"
                    : "font-display text-[38px] leading-[46px] lowercase md:text-[46px] md:leading-[52px]"
                }
              >
                {title}
                <span className="ms-1 inline-block size-[0.22em] rounded-full bg-clay align-baseline" aria-hidden />
              </h2>
              <p className="mt-1 text-[15px] leading-[26px] text-ink-muted md:text-[16px]">{sub}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <p className="num font-display text-[20px] leading-none text-ink-muted" aria-live="polite">
                <span className="text-ink">{pad(active + 1)}</span> / {pad(n)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label={strings.prev}
                  className="inline-flex size-11 items-center justify-center rounded-full border-[1.5px] border-line text-ink transition-colors hover:border-petrol/60 hover:text-petrol disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink"
                >
                  <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                    <path d="M13 8H3M7 4 3 8l4 4" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === n - 1}
                  aria-label={strings.next}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-ink text-bg transition-[filter,opacity] hover:brightness-110 disabled:opacity-35"
                >
                  <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* The projects: a swipe row on phones, stacked in one place on desktop */}
          <ol
            ref={track}
            className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-7 lg:grid lg:min-h-0 lg:flex-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((p, i) => (
              <Slide
                key={p.slug}
                p={p}
                i={i}
                n={n}
                lang={lang}
                strings={strings}
                playing={i === active && inView}
                onJump={(slug) => {
                  const k = indexOf(slug);
                  if (k >= 0) goTo(k);
                  else window.location.assign(`/${lang}/projects/${slug}`);
                }}
              />
            ))}
          </ol>

          {/* Project index: every name, the current one marked; click to jump */}
          <ol className="mt-5 hidden grid-cols-6 gap-3 lg:grid" aria-label={title}>
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "true" : undefined}
                  className="group block w-full text-start"
                >
                  <span className="block h-[3px] overflow-hidden rounded-full bg-line">
                    <span
                      className={`block h-full rounded-full bg-clay transition-[width] duration-700 ease-out ${i === active ? "w-full" : i < active ? "w-full opacity-35" : "w-0"}`}
                    />
                  </span>
                  <span
                    className={`mt-2 flex gap-1.5 text-[13px] leading-[20px] transition-colors ${i === active ? "text-ink" : "text-ink-muted group-hover:text-ink"}`}
                  >
                    <span className="num shrink-0">{pad(i + 1)}</span>
                    <span className="truncate">{p.name[lang]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {/* Phones: dots */}
          <div className="mt-4 flex justify-center gap-2 lg:hidden" aria-hidden>
            {projects.map((p, i) => (
              <span key={p.slug} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-clay" : "w-1.5 bg-line"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide({
  p,
  i,
  n,
  lang,
  strings,
  playing,
  onJump,
}: {
  p: Project;
  i: number;
  n: number;
  lang: Lang;
  strings: ShowcaseStrings;
  playing: boolean;
  onJump: (slug: string) => void;
}) {
  const isAr = lang === "ar";
  const live = p.status === "live";
  const story = `/${lang}/projects/${p.slug}`;
  const links = p.related.map((r) => ({ slug: r.slug, label: r.relation[lang], name: projectBySlug(r.slug)?.name[lang] ?? r.slug }));

  return (
    <li
      id={`project-${p.slug}`}
      aria-roledescription="slide"
      aria-label={`${pad(i + 1)} / ${pad(n)}`}
      className={`w-[86%] shrink-0 snap-center sm:w-[70%] lg:w-auto lg:[grid-area:1/1] lg:min-h-0 ${i === 0 ? "" : "lg:invisible"}`}
    >
      <article aria-labelledby={`project-${p.slug}-name`} className="grid h-full grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* The screen recording, large, on the brand gradient */}
        <div className="relative lg:col-span-8 lg:flex lg:h-full lg:min-h-0 lg:items-center lg:justify-center">
          <div
            data-media
            className="relative w-full overflow-hidden rounded-[22px] bg-[radial-gradient(110%_90%_at_10%_0%,var(--sky-soft),transparent_62%),radial-gradient(90%_80%_at_100%_100%,var(--clay-soft),transparent_66%)] p-3 ring-1 ring-line sm:p-5 lg:max-w-[calc((100dvh-300px)*1.5)] lg:rounded-[28px] lg:p-7 dark:bg-[radial-gradient(110%_90%_at_10%_0%,var(--sky-soft),transparent_62%),radial-gradient(80%_70%_at_100%_100%,color-mix(in_oklab,var(--clay-soft)_55%,transparent),transparent_66%)]"
          >
            <div data-media-in className="overflow-hidden rounded-xl border border-line/70 bg-surface shadow-[0_30px_60px_-30px_rgba(22,48,58,0.55)] dark:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]" dir="ltr">
              <div className="flex h-7 items-center gap-1.5 border-b border-line bg-bg/70 px-3" aria-hidden>
                <span className="size-2 rounded-full bg-line" />
                <span className="size-2 rounded-full bg-line" />
                <span className="size-2 rounded-full bg-line" />
              </div>
              <LoopVideo mp4={p.media.loop.mp4} webm={p.media.loop.webm} poster={p.media.loop.poster} active={playing} label={p.title[lang]} />
            </div>
            {/* the picture opens the story too (mouse only; the button is the real link) */}
            <a href={story} aria-hidden tabIndex={-1} data-cursor-label={strings.cta} className="absolute inset-0 z-10" />
          </div>
        </div>

        {/* The story in short */}
        <div className="flex flex-col gap-4 lg:col-span-4 lg:gap-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <span data-num className="num font-display text-[44px] leading-none text-petrol lg:text-[64px]" aria-hidden>
              {pad(i + 1)}
            </span>
            <div data-txt className="flex flex-col gap-1.5">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 text-[13px] text-ink-muted">
                <span className={`relative size-2 rounded-full ${live ? "bg-petrol" : "bg-ink-muted/50"}`} aria-hidden>
                  {live ? <span className="absolute inset-0 animate-ping rounded-full bg-petrol/60" /> : null}
                </span>
                {p.status === "live" ? strings.status.live : strings.status.delivered}
              </span>
              <span className="num text-[13px] text-ink-muted">{p.year}</span>
            </div>
          </div>

          <div data-txt>
            {p.partOf ? (
              <button
                type="button"
                onClick={() => onJump(p.partOf!.slug)}
                className="mb-2 inline-flex items-center gap-1.5 rounded-sm bg-sky-soft/70 px-2 py-0.5 text-[13px] text-petrol transition-colors hover:bg-sky-soft"
              >
                {p.partOf.tag[lang]}
              </button>
            ) : null}
            <h3
              id={`project-${p.slug}-name`}
              className={
                isAr
                  ? "text-[26px] leading-[40px] font-medium lg:text-[32px] lg:leading-[48px]"
                  : "font-latin text-[26px] leading-[32px] font-bold tracking-[-0.015em] lg:text-[34px] lg:leading-[40px]"
              }
            >
              {p.name[lang]}
            </h3>
          </div>

          <p data-txt className="text-[16px] leading-[28px] text-ink-muted lg:text-[17px] lg:leading-[30px]">
            {p.card.line[lang]}
          </p>

          <p data-txt className="flex items-start gap-2 text-[14px] leading-[22px] text-ink">
            <span className="mt-[10px] h-px w-4 shrink-0 bg-clay" aria-hidden />
            {p.card.role[lang]}
          </p>

          <dl data-txt className="grid grid-cols-2 gap-4 border-t border-line pt-4">
            {p.card.stats.map((s, k) => (
              <div key={k} className="flex flex-col-reverse gap-1">
                <dt className="text-[13px] leading-[20px] text-ink-muted">{s.label[lang]}</dt>
                <dd className="num self-start font-display text-[32px] leading-[36px] text-petrol lg:text-[38px] lg:leading-[42px]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div data-txt className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
            <a
              href={story}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-[15px] font-medium text-bg transition-[filter] hover:brightness-110"
            >
              {strings.cta}
              <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            {links.map((l) => (
              <button
                key={l.slug}
                type="button"
                onClick={() => onJump(l.slug)}
                className="group inline-flex max-w-full items-center gap-2 text-start text-[13px] leading-[20px] text-ink-muted transition-colors hover:text-petrol"
              >
                <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M6 3h7v7M13 3 4 12" />
                </svg>
                <span>
                  {l.label} · <span className="text-ink underline decoration-line underline-offset-4 group-hover:text-petrol group-hover:decoration-petrol">{l.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </article>
    </li>
  );
}
