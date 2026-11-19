"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Shot } from "@/lib/project-page";
import { ShotPicture } from "./ShotPicture";
import { Lightbox, type LightboxStrings } from "./Lightbox";

const DURATION = 5.5; // seconds per screen while it plays on its own
const pad = (n: number) => String(n).padStart(2, "0");

const CSS = `
@keyframes dv-wipe-r { from { clip-path: inset(0 0 0 100%) } to { clip-path: inset(0 0 0 0) } }
@keyframes dv-wipe-l { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
@keyframes dv-zoom { from { transform: scale(1.08) } to { transform: scale(1) } }
@keyframes dv-cap { from { opacity: 0; filter: blur(8px); transform: translateY(10px) } to { opacity: 1; filter: blur(0); transform: none } }
@keyframes dv-fill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.dv-in-r { animation: dv-wipe-r .95s cubic-bezier(.77,0,.18,1) both }
.dv-in-l { animation: dv-wipe-l .95s cubic-bezier(.77,0,.18,1) both }
.dv-in-r > *, .dv-in-l > * { animation: dv-zoom 1.3s cubic-bezier(.2,.8,.2,1) both }
.dv-cap { animation: dv-cap .6s cubic-bezier(.2,.8,.2,1) both }
.dv-fill { animation: dv-fill linear both; transform-origin: left center }
[dir="rtl"] .dv-fill { transform-origin: right center }
@media (prefers-reduced-motion: reduce) {
  .dv-in-r, .dv-in-l, .dv-in-r > *, .dv-in-l > *, .dv-cap { animation: none }
}
`;

/**
 * The desktop screens: one large viewer and a strip of every screen under it.
 * The viewer plays through the screens on its own (each thumbnail fills as its
 * turn runs out) until the visitor picks one; a pick swaps the screen with a
 * wipe. Hovering pauses it, and it only runs while on screen. A click on the
 * large screen opens it full size.
 */
export function DesktopShots({
  shots,
  lang,
  strings,
}: {
  shots: Shot[];
  lang: "ar" | "en";
  strings: LightboxStrings & { play: string; pause: string; open: string };
}) {
  const n = shots.length;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [prev, setPrev] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  // drag the strip with the mouse (touch scrolls it natively)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const go = useCallback(
    (i: number, user = true) => {
      const k = (i + n) % n;
      if (k === active) return;
      if (user) setAuto(false);
      setDir(i > active || (active === n - 1 && k === 0 && !user) ? 1 : -1);
      setPrev(active);
      setActive(k);
    },
    [active, n],
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    return () => io.disconnect();
  }, []);

  // keep the current thumbnail in view inside the strip (never moves the page)
  useEffect(() => {
    const s = strip.current;
    const th = s?.children[active] as HTMLElement | undefined;
    if (!s || !th) return;
    const sr = s.getBoundingClientRect(), tr = th.getBoundingClientRect();
    const delta = tr.left + tr.width / 2 - (sr.left + sr.width / 2);
    s.scrollBy({ left: delta, behavior: "smooth" });
  }, [active]);

  const running = auto && visible && !hover && open === null;
  const rtl = lang === "ar";
  // forward comes in from the end side of the reading direction
  const inClass = (dir === 1) !== rtl ? "dv-in-r" : "dv-in-l";
  const shot = shots[active];

  return (
    <div ref={root}>
      <style href="desktop-shots" precedence="default">{CSS}</style>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* the viewer */}
        <div className="lg:col-span-8" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div className="rounded-[26px] bg-[radial-gradient(110%_90%_at_10%_0%,var(--sky-soft),transparent_62%),radial-gradient(90%_80%_at_100%_100%,var(--clay-soft),transparent_66%)] p-2.5 ring-1 ring-line sm:p-4 lg:p-5">
            <div className="overflow-hidden rounded-xl border border-line/70 bg-surface shadow-[0_40px_80px_-40px_rgba(22,48,58,0.6)] dark:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]" dir="ltr">
              <div className="flex h-8 items-center gap-1.5 border-b border-line bg-bg/70 px-3" aria-hidden>
                <span className="size-2 rounded-full bg-line" />
                <span className="size-2 rounded-full bg-line" />
                <span className="size-2 rounded-full bg-line" />
                <span className="mx-auto hidden h-5 w-1/2 max-w-[340px] items-center justify-center truncate rounded-md bg-surface px-3 text-[11px] text-ink-muted sm:flex" dir={rtl ? "rtl" : "ltr"}>
                  {shot.caption[lang]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(active)}
                aria-label={`${strings.open}: ${shot.caption[lang]}`}
                data-cursor-label={strings.open}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-surface"
              >
                {shots.map((s, i) =>
                  i === active || i === prev ? (
                    <div
                      key={`${s.name}-${i === active ? active : "prev"}`}
                      className={`absolute inset-0 ${i === active ? `z-[2] ${prev === null ? "" : inClass}` : "z-[1]"}`}
                    >
                      <ShotPicture shot={s} alt="" sizes="(min-width: 1024px) 760px, 100vw" lazy={i !== 0} className="block size-full object-cover object-top" />
                    </div>
                  ) : null,
                )}
              </button>
            </div>
          </div>
        </div>

        {/* counter, caption, controls */}
        <div className="lg:col-span-4">
          <p className="num flex items-baseline gap-2 font-display leading-none" aria-live="polite">
            <span className="text-[64px] text-clay md:text-[88px]">{pad(active + 1)}</span>
            <span className="text-[22px] text-ink-muted md:text-[26px]">/ {pad(n)}</span>
          </p>
          <p key={active} className={`dv-cap mt-5 min-h-[3lh] text-ink ${rtl ? "text-[20px] leading-[34px] font-medium md:text-[23px] md:leading-[38px]" : "font-latin text-[20px] leading-[30px] font-semibold md:text-[23px] md:leading-[33px]"}`}>
            {shot.caption[lang]}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <button type="button" onClick={() => go(active - 1)} aria-label={strings.prev} className="grid size-11 place-items-center rounded-full border-[1.5px] border-line text-ink transition-colors hover:border-petrol/60 hover:text-petrol">
              <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M13 8H3M7 4 3 8l4 4" /></svg>
            </button>
            <button type="button" onClick={() => go(active + 1)} aria-label={strings.next} className="grid size-11 place-items-center rounded-full bg-ink text-bg transition-[filter] hover:brightness-110">
              <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </button>
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              aria-label={auto ? strings.pause : strings.play}
              aria-pressed={auto}
              className="ms-1 grid size-11 place-items-center rounded-full text-ink-muted transition-colors hover:text-ink"
            >
              {auto ? (
                <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden><rect x="4" y="3" width="2.6" height="10" rx="1" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="currentColor" aria-hidden><path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* every screen, as a strip */}
      <div
        ref={strip}
        className="-mx-4 mt-8 flex cursor-grab gap-3 overflow-x-auto px-4 pt-1 pb-3 select-none [scrollbar-width:none] active:cursor-grabbing sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-10 lg:px-0 [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          drag.current = { down: true, x: e.clientX, left: strip.current!.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) > 6) d.moved = true;
          if (d.moved) strip.current!.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
        onClickCapture={(e) => {
          // a drag is not a pick
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {shots.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.name}
              type="button"
              onClick={() => go(i)}
              aria-label={s.caption[lang]}
              aria-current={on ? "true" : undefined}
              className={`group relative w-[120px] shrink-0 overflow-hidden rounded-lg border bg-surface transition-[transform,opacity,border-color,box-shadow] duration-500 md:w-[148px] ${
                on ? "-translate-y-1 border-clay opacity-100 shadow-[0_16px_30px_-18px_rgba(194,96,63,0.7)]" : "border-line opacity-55 hover:opacity-100"
              }`}
              dir="ltr"
            >
              <ShotPicture shot={s} alt="" sizes="150px" className="block aspect-[16/10] w-full object-cover object-top" />
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/10" aria-hidden>
                {on ? (
                  <span
                    key={`${active}-${auto}`}
                    className={`block h-full bg-clay ${auto ? "dv-fill" : ""}`}
                    style={auto ? { animationDuration: `${DURATION}s`, animationPlayState: running ? "running" : "paused" } : undefined}
                    onAnimationEnd={() => go(active + 1, false)}
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <Lightbox
        shots={shots}
        index={open}
        lang={lang}
        strings={strings}
        onClose={() => setOpen(null)}
        onStep={(d) => setOpen((i) => (i === null ? i : (i + d + n) % n))}
      />
    </div>
  );
}
