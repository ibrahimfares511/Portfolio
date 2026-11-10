"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TOOL_LOGOS } from "./logos";

type Row = { label: string; items: string[] };

const SPEEDS = [34, 28, 31, 38]; // px per second, as in the old site's rows
const COPIES = 4;

/**
 * Four rows of tool chips in the old site's look (logo + name), alternating
 * directions. New: the rows follow the scroll. Scroll down and they run their
 * normal way, faster while you scroll; scroll up and every row turns round.
 * Rows only move while the section is on screen. Reduced motion: still rows.
 */
export function ToolsMarquee({ rows }: { rows: Row[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tracks = Array.from(el.querySelectorAll<HTMLElement>("[data-track]"));
    const state = tracks.map((t, i) => ({
      t,
      x: 0,
      width: 0,
      base: i % 2 === 0 ? -1 : 1, // row 1 → left, row 2 → right, ...
      speed: SPEEDS[i % SPEEDS.length],
    }));
    const measure = () => state.forEach((s) => (s.width = s.t.scrollWidth / COPIES));
    measure();

    // Direction comes from what the reader does (wheel, finger, keys), not
    // from scroll events: the desktop section snap also scrolls the page and
    // would otherwise flip the rows on its own.
    let dir = 1; // 1 after scrolling down, -1 after scrolling up
    let boost = 0;
    let lastY = window.scrollY;
    let touchY = 0;
    let visible = false;
    const onScroll = () => {
      const y = window.scrollY;
      boost = Math.min(6, boost + Math.abs(y - lastY) / 40);
      lastY = y;
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2) dir = e.deltaY > 0 ? 1 : -1;
    };
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchY - e.touches[0].clientY; // finger up = page goes down
      if (Math.abs(dy) > 4) dir = dy > 0 ? 1 : -1;
      touchY = e.touches[0].clientY;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "End"].includes(e.key)) dir = 1;
      if (["ArrowUp", "PageUp", "Home"].includes(e.key)) dir = -1;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px 0px" });
    io.observe(el);

    const tick = (_time: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      boost *= 0.92; // eases back to the normal speed
      state.forEach((s) => {
        if (!s.width) return;
        s.x += s.base * dir * s.speed * (1 + boost) * dt;
        // wrap within one copy's width so the loop is seamless
        s.x = ((s.x % s.width) - s.width) % s.width;
        s.t.style.transform = `translate3d(${s.x}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={root} className="tools-marquee relative mx-auto mt-12 flex max-w-5xl flex-col gap-4 md:mt-14" dir="ltr">
      {rows.map((row, r) => (
        <div key={r} role="list" aria-label={row.label} className="relative overflow-hidden py-3">
          <div data-track className="flex w-max will-change-transform">
            {Array.from({ length: COPIES }).flatMap((_, c) =>
              row.items.map((name) => {
                const tool = TOOL_LOGOS[name];
                return (
                  <div
                    key={`${c}-${name}`}
                    role={c === 0 ? "listitem" : undefined}
                    aria-hidden={c === 0 ? undefined : true}
                    style={{ ["--tool" as string]: tool?.color === "currentColor" ? "var(--ink)" : tool?.color }}
                    className="tool-chip group mx-2 flex shrink-0 cursor-default items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-3 shadow-sm select-none sm:mx-3"
                  >
                    <span className="flex items-center justify-center text-ink transition-transform duration-300 group-hover:scale-105">
                      {tool?.logo ?? <span className="size-5 rounded-md border border-dashed border-ink-muted" />}
                    </span>
                    <span className="text-[13px] font-semibold tracking-wide whitespace-nowrap text-ink-muted transition-colors duration-300 group-hover:text-ink">
                      {name}
                    </span>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
