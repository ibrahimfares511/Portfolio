"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Words } from "@/components/ui/Words";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollToPlugin);

type Step = { lead: string; text: string; pose: string };
const pad = (n: number) => String(n).padStart(2, "0");

/** Words of a chapter come out of a blur one after another; the rest follows. */
function writeIn(slide: HTMLElement, at: number, t: gsap.core.Timeline) {
  t.fromTo(
    slide.querySelectorAll("[data-reveal='word']"),
    { opacity: 0, filter: "blur(10px)", y: "0.25em" },
    { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.5, stagger: 0.035, ease: "power2.out", clearProps: "filter,transform" },
    at,
  ).fromTo(
    slide.querySelectorAll("[data-st]"),
    { opacity: 0, filter: "blur(8px)", y: 12 },
    { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out", clearProps: "filter,transform" },
    at + 0.15,
  );
}

/**
 * "How we work together" told as a short story in four chapters.
 *
 * Desktop (lg+): one screen per chapter. The stage sticks while the page scrolls through it (the
 * SectionPager moves exactly one screen inside this band). Each chapter swaps the character's pose,
 * slides a giant chapter number behind him, and writes its words in out of a blur. A path along the
 * bottom fills as the story moves on; every stop on it is clickable. The last chapter ends on the
 * closing promise. The first chapter enters with the section (<Reveal>), like every other section.
 *
 * Phones and tablets: the chapters follow each other, each one entering as it comes into view.
 */
export function ProcessStory({
  steps,
  lang,
  title,
  sub,
  closing,
}: {
  steps: Step[];
  lang: "ar" | "en";
  title: string;
  sub: string;
  closing: string;
}) {
  const section = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const shown = useRef(0);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const n = steps.length;
  const isAr = lang === "ar";
  const desktop = () => window.matchMedia("(min-width: 1024px)").matches;

  const goTo = useCallback(
    (i: number) => {
      const sec = section.current;
      if (!sec || !desktop()) return;
      const k = Math.max(0, Math.min(n - 1, i));
      const top = sec.getBoundingClientRect().top + window.scrollY + k * window.innerHeight;
      gsap.to(window, { scrollTo: { y: top, autoKill: false }, duration: 0.9, ease: "power3.out" });
    },
    [n],
  );

  // Which chapter is on stage (desktop): switches 15% into the scroll, in the direction of travel.
  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    let raf = 0;
    let lastRaw = 0;
    const read = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (!desktop()) return;
      const raw = -r.top / vh;
      const down = raw >= lastRaw;
      lastRaw = raw;
      const k = down ? Math.floor(raw + 0.85) : Math.ceil(raw - 0.85);
      setActive(Math.max(0, Math.min(n - 1, k)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  // The chapter change.
  useEffect(() => {
    const ol = list.current;
    if (!ol || !desktop()) return;
    const from = shown.current, to = active;
    if (from === to) return;
    shown.current = to;
    const slides = Array.from(ol.children) as HTMLElement[];
    const out = slides[from], inn = slides[to];
    if (!out || !inn) return;
    tl.current?.progress(1).kill();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(out, { visibility: "hidden" });
      gsap.set(inn, { visibility: "visible" });
      return;
    }
    const fwd = to > from ? 1 : -1;
    const side = (document.documentElement.dir === "rtl" ? -1 : 1) * fwd;
    const q = (el: HTMLElement, s: string) => el.querySelectorAll<HTMLElement>(s);
    const t = gsap.timeline({ defaults: { overwrite: "auto" } });
    t.to(q(out, "[data-reveal='word'], [data-st]"), { opacity: 0, y: -10, filter: "blur(6px)", duration: 0.3, stagger: 0.01, ease: "power2.in" }, 0)
      .to(q(out, "[data-pose]"), { opacity: 0, xPercent: -8 * side, scale: 0.97, filter: "blur(6px)", duration: 0.45, ease: "power2.in" }, 0)
      .to(q(out, "[data-big]"), { yPercent: -35 * fwd, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
      .set(out, { visibility: "hidden" })
      .set(inn, { visibility: "visible" }, 0.3)
      .fromTo(q(inn, "[data-big]"), { yPercent: 35 * fwd, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.3)
      .fromTo(
        q(inn, "[data-pose]"),
        { opacity: 0, xPercent: 10 * side, scale: 0.96, filter: "blur(8px)" },
        { opacity: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 0.85, ease: "power3.out", clearProps: "filter,transform" },
        0.32,
      );
    writeIn(inn, 0.42, t);
    tl.current = t;
  }, [active]);

  return (
    <div ref={section} data-screens="" className="relative lg:h-[calc(var(--n)*100dvh)]" style={{ ["--n" as string]: n }}>
      <div className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:pt-[92px] lg:pb-7">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:min-h-0">
          <Reveal>
            <SectionHeading id="process-title" locale={lang} title={title} sub={sub} />
          </Reveal>

          {/* The chapters: one after another on phones, one stage on desktop */}
          <ol ref={list} className="mt-12 grid gap-16 lg:mt-4 lg:min-h-0 lg:flex-1 lg:gap-0">
            {steps.map((s, i) => {
              const last = i === n - 1;
              return (
                <li
                  key={i}
                  aria-label={`${pad(i + 1)} / ${pad(n)}`}
                  className={`lg:min-h-0 lg:[grid-area:1/1] ${i === 0 ? "" : "lg:invisible"}`}
                >
                  <Reveal className="h-full">
                    <article className="grid h-full items-center gap-6 lg:grid-cols-12 lg:gap-10">
                      {/* The character in this chapter, a giant chapter number behind him */}
                      <div className="relative flex h-[260px] items-end justify-center overflow-hidden sm:h-[320px] lg:col-span-5 lg:h-full lg:min-h-0">
                        <span
                          data-big
                          aria-hidden
                          className="num pointer-events-none absolute start-0 top-0 font-display text-[150px] leading-none text-transparent select-none [-webkit-text-stroke:1.5px_color-mix(in_oklab,var(--clay)_55%,transparent)] lg:top-[4%] lg:text-[min(30vh,280px)]"
                        >
                          {pad(i + 1)}
                        </span>
                        <span
                          aria-hidden
                          className="absolute bottom-0 left-1/2 aspect-square w-[80%] max-w-[420px] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent)]"
                        />
                        <span aria-hidden className="absolute inset-x-[12%] bottom-0 h-px bg-line" />
                        <div data-pose data-reveal="block" className="relative h-full">
                          <picture className="block h-full">
                            <source
                              type="image/avif"
                              srcSet={`/avatar/${s.pose}-320.avif 320w, /avatar/${s.pose}-480.avif 480w`}
                              sizes="(min-width: 1024px) 320px, 180px"
                            />
                            <img
                              src={`/avatar/${s.pose}-480.webp`}
                              srcSet={`/avatar/${s.pose}-320.webp 320w, /avatar/${s.pose}-480.webp 480w`}
                              sizes="(min-width: 1024px) 320px, 180px"
                              width={842}
                              height={1264}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="h-full w-auto object-contain select-none lg:max-h-[560px]"
                              draggable={false}
                            />
                          </picture>
                        </div>
                      </div>

                      {/* The chapter */}
                      <div className="flex flex-col lg:col-span-7 lg:ps-6">
                        <p data-st data-reveal="text" className="flex items-center gap-3 text-[14px] leading-[22px] text-ink-muted">
                          <span className="num text-clay">{pad(i + 1)}</span>
                          <span aria-hidden className="h-px w-10 bg-clay/60" />
                          <span className="num">{pad(n)}</span>
                        </p>
                        <h3
                          className={
                            isAr
                              ? "mt-3 text-[44px] leading-[64px] font-semibold text-ink lg:text-[64px] lg:leading-[92px]"
                              : "mt-3 font-latin text-[44px] leading-[48px] font-bold tracking-[-0.03em] text-ink lg:text-[68px] lg:leading-[72px]"
                          }
                        >
                          <Words text={s.lead} />
                          <span className="ms-2 inline-block size-[0.16em] rounded-full bg-clay" aria-hidden />
                        </h3>
                        <p className="mt-4 max-w-xl text-[18px] leading-[32px] text-ink-muted lg:text-[21px] lg:leading-[38px]">
                          <Words text={s.text} />
                        </p>
                        {last ? (
                          <p
                            data-st
                            data-reveal="text"
                            className={`mt-8 max-w-xl border-s-2 border-clay ps-5 ${
                              isAr ? "text-[22px] leading-[36px] font-medium text-ink lg:text-[26px] lg:leading-[42px]" : "font-display text-[26px] leading-[34px] text-ink lowercase lg:text-[32px] lg:leading-[40px]"
                            }`}
                          >
                            {closing}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          {/* The path: four stops, filled up to where the story is; click a stop to go there */}
          <nav aria-label={title} className="relative mt-6 hidden lg:block">
            <span aria-hidden className="absolute inset-x-[12.5%] top-[11px] h-[2px] rounded-full bg-line" />
            <span
              aria-hidden
              className="absolute start-[12.5%] top-[11px] h-[2px] rounded-full bg-clay transition-[width] duration-700 ease-out"
              style={{ width: `${(active / Math.max(1, n - 1)) * 75}%` }}
            />
            <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
              {steps.map((s, i) => {
                const reached = i <= active;
                return (
                  <li key={i} className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      className="group flex flex-col items-center gap-2"
                    >
                      <span
                        className={`grid size-6 place-items-center rounded-full border-2 bg-bg transition-colors duration-500 ${reached ? "border-clay" : "border-line group-hover:border-ink-muted"}`}
                      >
                        <span className={`size-2.5 rounded-full bg-clay transition-transform duration-500 ${i === active ? "scale-100" : reached ? "scale-75 opacity-60" : "scale-0"}`} />
                      </span>
                      <span className={`flex gap-1.5 text-[14px] leading-[20px] transition-colors ${i === active ? "text-ink" : "text-ink-muted group-hover:text-ink"}`}>
                        <span className="num">{pad(i + 1)}</span>
                        <span>{s.lead}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}
