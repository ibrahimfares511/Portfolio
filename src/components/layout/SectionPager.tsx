"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type BandInfo = { el: HTMLElement; label: string };

const HEADER = 72;

/**
 * Home page, section by section.
 *
 * - Every device: the header (and anything with .tone-follow) takes the tone
 *   of the band under it, and the side navigation tracks where you are.
 * - Desktop with a fine pointer (and motion allowed): the wheel, PageUp/Down,
 *   Space and the arrow keys move one whole band at a time. A band taller
 *   than the screen (the project stack) scrolls natively until its edge,
 *   then the next move pages on.
 * - Side navigation (desktop): a pen line that draws with your progress, one
 *   dot per band; the current dot is the clay dot of the logo.
 */
export function SectionPager() {
  const [bands, setBands] = useState<BandInfo[]>([]);
  const [active, setActive] = useState(0);
  const line = useRef<HTMLSpanElement>(null);
  const nib = useRef<HTMLSpanElement>(null);
  const goRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-band]"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the bands are server-rendered siblings
    setBands(els.map((el) => ({ el, label: el.dataset.label ?? "" })));
    const root = document.documentElement;
    const followers = () => document.querySelectorAll<HTMLElement>(".tone-follow");

    const paging = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const setPaging = () => root.classList.toggle("if-paging", paging.matches);
    setPaging();
    paging.addEventListener("change", setPaging);

    const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
    const indexAt = (y: number) => {
      let i = 0;
      els.forEach((el, k) => {
        if (top(el) <= y + 1) i = k;
      });
      return i;
    };

    // Tone under the header, active band at the middle of the screen, progress line.
    let raf = 0;
    const track = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const tone = els[indexAt(y + HEADER / 2)]?.dataset.tone;
      followers().forEach((f) => {
        if (tone) f.dataset.tone = tone;
        else delete f.dataset.tone;
      });
      setActive(indexAt(y + vh / 2));
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (line.current) line.current.style.transform = `translateX(-50%) scaleY(${p})`;
      if (nib.current) nib.current.style.top = `${p * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(track);
    };
    track();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Paging
    let busy = false;
    let cooling = false;
    let coolTimer = 0;
    const cool = () => {
      cooling = true;
      window.clearTimeout(coolTimer);
      coolTimer = window.setTimeout(() => (cooling = false), 180);
    };
    const scrollToY = (y: number, from?: HTMLElement) => {
      busy = true;
      const proxy = { y: window.scrollY };
      const content = from?.firstElementChild as HTMLElement | null;
      const down = y > proxy.y;
      if (content) gsap.to(content, { opacity: 0.25, y: down ? -60 : 60, duration: 0.5, ease: "power2.in" });
      gsap.to(proxy, {
        y,
        duration: 0.95,
        ease: "power3.inOut",
        onUpdate: () => window.scrollTo(0, proxy.y),
        onComplete: () => {
          busy = false;
          cool();
          if (content) gsap.set(content, { clearProps: "opacity,transform" });
        },
      });
    };
    const go = (i: number) => {
      const k = Math.max(0, Math.min(els.length - 1, i));
      const cur = els[indexAt(window.scrollY + window.innerHeight / 2)];
      scrollToY(top(els[k]), cur !== els[k] ? cur : undefined);
    };
    goRef.current = go;

    /** Decide one step. Returns false to let the browser scroll natively. */
    const step = (dir: 1 | -1): boolean => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const i = indexAt(y + 2);
      const el = els[i];
      const t = top(el);
      const b = t + el.offsetHeight;
      const tall = el.offsetHeight > vh + 8;
      if (dir > 0) {
        if (tall && y + vh < b - 4) return false; // still inside a long band
        if (i < els.length - 1) scrollToY(top(els[i + 1]), el);
        else if (y + vh < document.documentElement.scrollHeight - 2) return false; // footer
        return true;
      }
      // up
      if (y > t + 4) {
        if (tall) return false;
        scrollToY(t);
        return true;
      }
      if (i > 0) {
        const prev = els[i - 1];
        const pt = top(prev);
        const ph = prev.offsetHeight;
        scrollToY(ph > vh + 8 ? pt + ph - vh : pt, el);
      }
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (!paging.matches || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (document.querySelector("dialog[open]")) return;
      if (busy || cooling) {
        e.preventDefault();
        if (cooling) cool();
        return;
      }
      if (Math.abs(e.deltaY) < 4) return;
      const handled = step(e.deltaY > 0 ? 1 : -1);
      if (handled) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!paging.matches || e.altKey || e.metaKey || e.ctrlKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable], [role=tablist], dialog")) return;
      const down = e.key === "PageDown" || e.key === "ArrowDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "PageUp" || e.key === "ArrowUp" || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      if (busy) return e.preventDefault();
      if (step(down ? 1 : -1)) e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      paging.removeEventListener("change", setPaging);
      root.classList.remove("if-paging");
      followers().forEach((f) => delete f.dataset.tone);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(coolTimer);
    };
  }, []);

  if (!bands.length) return null;
  return (
    <div
      aria-hidden
      className="tone-follow pointer-events-none fixed inset-y-0 end-4 z-40 hidden items-center lg:flex xl:end-7"
      data-tone={bands[active]?.el.dataset.tone}
    >
      <div className="relative flex h-[min(56vh,420px)] w-6 flex-col items-center justify-between py-1">
        {/* the pen line: track + progress, with the sky nib at its tip */}
        <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-line" />
        <span
          ref={line}
          className="absolute inset-x-0 top-0 left-1/2 h-full w-[2px] origin-top -translate-x-1/2 scale-y-0 rounded-full bg-petrol"
        />
        <span
          ref={nib}
          className="absolute left-1/2 h-[10px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay"
          style={{ top: 0 }}
        />
        {bands.map((b, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            onClick={() => goRef.current(i)}
            className="group pointer-events-auto relative z-10 grid size-6 place-items-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === active ? "size-3 bg-clay" : "size-2 border-[1.5px] border-ink-muted/60 bg-bg group-hover:border-ink"
              }`}
            />
            <span className="pointer-events-none absolute end-8 rounded-full bg-ink px-3 py-1 text-[13px] whitespace-nowrap text-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {b.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
