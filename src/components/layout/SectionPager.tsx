"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(Observer, ScrollToPlugin);

const HEADER = 72;

/**
 * Home page, section by section.
 *
 * Every device: the header (and anything with .tone-follow) takes the tone of
 * the band under it, and the side indicator tracks where you are.
 *
 * Desktop (fine pointer, motion allowed): GSAP Observer takes the wheel,
 * PageUp/Down, Space and the arrow keys. One gesture = one smooth move:
 * to the next band, or, inside a band taller than the screen (the project
 * stack), one screen further down it. A gesture only counts once the
 * previous one has come to rest, so trackpad momentum can't skip sections.
 * The browser scrollbar is hidden; the side indicator replaces it (its dots
 * jump to a band).
 */
export function SectionPager({ paging = true }: { paging?: boolean } = {}) {
  const [labels, setLabels] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [inner, setInner] = useState(0); // progress inside the active band (0–1)
  const [flash, setFlash] = useState(false); // show the active label for a moment
  const goRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-band]"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the bands are server-rendered siblings
    setLabels(els.map((el) => el.dataset.label ?? ""));
    const root = document.documentElement;
    const followers = () => document.querySelectorAll<HTMLElement>(".tone-follow");
    const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
    const indexAt = (y: number) => {
      let i = 0;
      els.forEach((el, k) => {
        if (top(el) <= y + 1) i = k;
      });
      return i;
    };

    // Tracking: tone under the header, active band, progress inside it.
    let raf = 0;
    let last = -1;
    let flashTimer = 0;
    const track = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const tone = els[indexAt(y + HEADER / 2)]?.dataset.tone;
      followers().forEach((f) => {
        if (tone) f.dataset.tone = tone;
        else delete f.dataset.tone;
      });
      const i = indexAt(y + vh / 2);
      const el = els[i];
      const span = el.offsetHeight - vh;
      setInner(span > 8 ? Math.min(1, Math.max(0, (y - top(el)) / span)) : 1);
      setActive(i);
      if (i !== last) {
        if (last !== -1) {
          setFlash(true);
          window.clearTimeout(flashTimer);
          flashTimer = window.setTimeout(() => setFlash(false), 1400);
        }
        last = i;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(track);
    };
    track();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Paging (desktop)
    // paging={false} (case studies): plain native scrolling; only the indicator and the header tone stay.
    const mq = window.matchMedia(
      paging ? "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)" : "not all",
    );
    let animating = false;
    let gate = true; // a new gesture may start
    let lastInput = 0;

    const move = (y: number, duration: number) => {
      animating = true;
      gate = false;
      gsap.to(window, {
        scrollTo: { y, autoKill: false },
        duration,
        // Starts moving at once and settles softly: feels like the page
        // answered the wheel, not like it waited and then jumped.
        ease: "power3.out",
        onComplete: () => {
          animating = false;
          if (performance.now() - lastInput > 220) gate = true;
        },
      });
    };
    const go = (i: number) => {
      const k = Math.max(0, Math.min(els.length - 1, i));
      move(top(els[k]), 1.05);
    };
    goRef.current = (i) => (mq.matches ? go(i) : els[i]?.scrollIntoView({ behavior: "smooth" }));

    const step = (dir: 1 | -1) => {
      if (animating || !gate) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const i = indexAt(y + 2);
      const el = els[i];
      const t = top(el);
      const b = t + el.offsetHeight;
      const tall = el.offsetHeight > vh + 8;
      const page = vh * 0.85;
      // A band built of whole screens (the projects showcase): one step = exactly one screen.
      const screens = el.querySelector<HTMLElement>("[data-screens]");
      const st = screens ? top(screens) : t;
      const snap = (k: number) => Math.max(t, Math.min(st + k * vh, b - vh));
      const at = screens ? Math.round((y - st) / vh) : 0;
      if (dir > 0) {
        if (screens && y + vh < b - 4) return move(snap(at + 1), 0.9);
        if (tall && y + vh < b - 4) return move(Math.min(y + page, b - vh), 0.8);
        if (i < els.length - 1) return go(i + 1);
        const end = document.documentElement.scrollHeight - vh; // footer
        if (y < end - 2) move(end, 0.75);
        return;
      }
      if (screens && y > t + 4) return move(at - 1 <= 0 ? t : snap(at - 1), 0.9);
      if (y > t + 4) return move(tall ? Math.max(t, y - page) : t, tall ? 0.75 : 1);
      if (i > 0) {
        const prev = els[i - 1];
        const ph = prev.offsetHeight;
        move(ph > vh + 8 ? top(prev) + ph - vh : top(prev), 1);
      }
    };

    let obs: Observer | undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable], [role=tablist], dialog")) return;
      const down = e.key === "PageDown" || e.key === "ArrowDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "PageUp" || e.key === "ArrowUp" || (e.key === " " && e.shiftKey);
      const home = e.key === "Home";
      const end = e.key === "End";
      if (!down && !up && !home && !end) return;
      e.preventDefault();
      if (animating) return;
      gate = true;
      if (home) return go(0);
      if (end) return move(document.documentElement.scrollHeight - window.innerHeight, 1.2);
      step(down ? 1 : -1);
    };
    // Same-page links (#projects, #contact…): glide instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href*='#']");
      if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
      const target = a.hash && document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      history.replaceState(history.state, "", a.hash);
      move(Math.max(0, top(target.closest<HTMLElement>("[data-band]") ?? target)), 1);
    };

    const on = () => {
      root.classList.add("if-paging");
      obs = Observer.create({
        target: window,
        type: "wheel",
        wheelSpeed: -1,
        tolerance: 12,
        preventDefault: true,
        ignore: "dialog, textarea, [data-native-scroll]",
        onChange: () => (lastInput = performance.now()),
        onUp: () => step(1),
        onDown: () => step(-1),
        onStop: () => {
          if (!animating) gate = true;
        },
        onStopDelay: 0.18,
      });
      window.addEventListener("keydown", onKey);
      document.addEventListener("click", onClick);
    };
    const off = () => {
      root.classList.remove("if-paging");
      obs?.kill();
      obs = undefined;
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
    const apply = () => (mq.matches ? on() : off());
    apply();
    mq.addEventListener("change", apply);

    return () => {
      off();
      mq.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      followers().forEach((f) => delete f.dataset.tone);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(flashTimer);
      gsap.killTweensOf(window);
    };
  }, [paging]);

  // Without paging (case studies) the page scrolls freely; no side indicator over the bleeding screens.
  if (!labels.length || !paging) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 end-3 z-40 hidden items-center lg:flex xl:end-6">
      <div className="tone-follow flex flex-col items-center gap-3">
        <div className="pointer-events-auto flex flex-col items-center gap-[9px] rounded-full border border-line bg-surface/75 px-[10px] py-[14px] shadow-[0_10px_30px_-18px_rgba(22,48,58,0.5)] backdrop-blur-md">
          {labels.map((label, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                onClick={() => goRef.current(i)}
                className="group relative grid w-3 place-items-center py-[2px]"
              >
                <span
                  className={`relative block w-[7px] overflow-hidden rounded-full transition-[height,background-color] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
                    on ? "h-10 bg-clay/25" : "h-[7px] bg-ink-muted/35 group-hover:bg-ink-muted"
                  }`}
                >
                  {on ? (
                    <span
                      className="absolute inset-x-0 top-0 rounded-full bg-clay transition-[height] duration-150"
                      style={{ height: `${Math.max(22, inner * 100)}%` }}
                    />
                  ) : null}
                </span>
                {/* label: on hover, and for a moment when the section changes */}
                <span
                  className={`pointer-events-none absolute end-6 top-1/2 -translate-y-1/2 rounded-full border border-line bg-surface px-3 py-1 text-[13px] whitespace-nowrap text-ink shadow-[0_8px_20px_-14px_rgba(22,48,58,0.6)] transition-[opacity,transform] duration-300 ${
                    on && flash ? "opacity-100" : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 rtl:-translate-x-1"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <span className="num font-display text-[15px] leading-none text-ink-muted">
          {pad(active + 1)}
          <span className="opacity-50">/{pad(labels.length)}</span>
        </span>
      </div>
    </div>
  );
}
