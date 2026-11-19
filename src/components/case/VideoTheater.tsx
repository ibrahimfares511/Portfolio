"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LoopVideo } from "@/components/projects/LoopVideo";
import type { Clip } from "@/lib/project-page";

const pad = (n: number) => String(n).padStart(2, "0");
const STEP = 0.8; // screens of scrolling per video

/**
 * The videos as a small theatre (desktop): the stage stays on screen while
 * the page scrolls past it (plain native scrolling, a sticky stage), and each
 * stretch of scrolling brings the next video in. The chapter list beside it
 * marks the playing one and fills a line as you go; a click on a chapter
 * scrolls to it. Phones and tablets: the videos one after another, each with
 * its text.
 */
export function VideoTheater({ clips, lang, heading }: { clips: Clip[]; lang: "ar" | "en"; heading: ReactNode }) {
  const n = clips.length;
  const outer = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [local, setLocal] = useState(0); // 0–1 inside the current video's stretch
  const [inView, setInView] = useState(false);
  const rtl = lang === "ar";

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setInView(r.top < vh * 0.6 && r.bottom > vh * 0.4);
      const span = el.offsetHeight - vh;
      const p = span > 0 ? Math.min(0.9999, Math.max(0, -r.top / span)) : 0;
      const x = p * n;
      setActive(Math.floor(x));
      setLocal(x - Math.floor(x));
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

  const jump = (i: number) => {
    const el = outer.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + (span * (i + 0.05)) / n;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const frame = (c: Clip, playing: boolean) => (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_50px_100px_-40px_rgba(0,0,0,0.75)]" dir="ltr">
      <div className="flex h-8 items-center gap-1.5 border-b border-line bg-bg/70 px-3" aria-hidden>
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
      </div>
      <LoopVideo mp4={c.mp4} webm={c.webm} poster={c.poster} active={playing} label={c.caption[lang]} />
    </div>
  );

  return (
    <>
      {/* desktop: the theatre */}
      <div ref={outer} className="relative hidden lg:block" style={{ height: `calc(${n * STEP * 100}dvh + 100dvh)` }}>
        <div className="sticky top-0 flex h-dvh flex-col justify-center pt-[72px]">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-12 items-center gap-12 px-6">
            <div className="col-span-5">
              {heading}
              <ol className="mt-10 grid gap-1">
                {clips.map((c, i) => {
                  const on = i === active;
                  return (
                    <li key={c.name}>
                      <button type="button" onClick={() => jump(i)} aria-current={on ? "true" : undefined} className="group w-full py-3 text-start">
                        <span className="flex items-start gap-4">
                          <span className={`num font-display text-[22px] leading-[30px] transition-colors duration-500 ${on ? "text-clay" : "text-ink-muted/60"}`}>{pad(i + 1)}</span>
                          <span
                            className={`transition-[color,opacity] duration-500 ${on ? "text-ink" : "text-ink-muted/70 group-hover:text-ink-muted"} ${
                              rtl ? "text-[17px] leading-[30px] font-medium" : "font-latin text-[17px] leading-[27px] font-semibold"
                            }`}
                          >
                            {c.caption[lang]}
                          </span>
                        </span>
                        <span className="ms-[42px] mt-3 block h-[2px] overflow-hidden rounded-full bg-line" aria-hidden>
                          <span
                            className="block h-full rounded-full bg-clay"
                            style={{
                              transform: `scaleX(${i < active ? 1 : on ? local : 0})`,
                              transformOrigin: rtl ? "right" : "left",
                              opacity: i < active ? 0.35 : 1,
                            }}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="relative col-span-7 aspect-[16/10.8]">
              {clips.map((c, i) => {
                const d = i - active;
                return (
                  <div
                    key={c.name}
                    className="absolute inset-0 transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                    style={{
                      opacity: d === 0 ? 1 : 0,
                      transform: d === 0 ? "none" : `translateY(${d > 0 ? 60 : -60}px) scale(0.94)`,
                      filter: d === 0 ? "none" : "blur(10px)",
                      pointerEvents: d === 0 ? "auto" : "none",
                    }}
                    aria-hidden={d !== 0}
                  >
                    {frame(c, d === 0 && inView)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* phones and tablets: one after another */}
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:hidden">
        {heading}
        <ol className="mt-10 grid gap-12">
          {clips.map((c, i) => (
            <li key={c.name} data-reveal="block">
              <MobileClip c={c} lang={lang} i={i} frame={frame} />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function MobileClip({ c, lang, i, frame }: { c: Clip; lang: "ar" | "en"; i: number; frame: (c: Clip, playing: boolean) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref}>
      {frame(c, on)}
      <p className="mt-4 flex gap-3">
        <span className="num font-display text-[22px] leading-[28px] text-clay">{pad(i + 1)}</span>
        <span className={lang === "ar" ? "text-[17px] leading-[30px] font-medium text-ink" : "font-latin text-[17px] leading-[27px] font-semibold text-ink"}>{c.caption[lang]}</span>
      </p>
    </div>
  );
}
