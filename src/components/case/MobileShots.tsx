"use client";

import { useRef, useState } from "react";
import type { Shot } from "@/lib/project-page";
import { ShotPicture } from "./ShotPicture";
import { Lightbox, type LightboxStrings } from "./Lightbox";

const pad = (n: number) => String(n).padStart(2, "0");
const STEP = 112; // % of a screen's width between two screens in the row

/**
 * The phone screens: one phone stands still in the middle; the screens lie in
 * a row through it, as plain pictures on its left and right. Turning the row
 * (drag, swipe, the arrows, or a click on a side picture) slides the next
 * screen into the phone, where it grows to fill it. A click on the screen in
 * the phone opens it full size.
 */
export function MobileShots({ shots, lang, strings }: { shots: Shot[]; lang: "ar" | "en"; strings: LightboxStrings & { open: string } }) {
  const n = shots.length;
  const [active, setActive] = useState(Math.floor((n - 1) / 2));
  const [open, setOpen] = useState<number | null>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const rtl = lang === "ar";
  const go = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)));
  const shot = shots[active];

  return (
    <div>
      <div
        className="relative mx-auto h-[calc(var(--w)*844/390+56px)] w-full touch-pan-y overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [--w:200px] sm:[--w:230px] md:[--w:250px]"
        onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 50) {
            // dragging towards the start of the reading direction brings the next screen in
            go(active + ((dx < 0) !== rtl ? 1 : -1));
            d.x = e.clientX;
            d.moved = true;
          }
        }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
        onPointerLeave={() => (drag.current = null)}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* the row of screens; the one in the middle fills the phone */}
        {shots.map((s, i) => {
          const d = i - active;
          const ad = Math.abs(d);
          const x = (rtl ? -1 : 1) * d * STEP;
          const center = ad === 0;
          return (
            <button
              key={s.name}
              type="button"
              tabIndex={center ? 0 : -1}
              aria-label={center ? `${strings.open}: ${s.caption[lang]}` : s.caption[lang]}
              onClick={() => {
                if (drag.current?.moved) return;
                if (center) setOpen(i);
                else go(i);
              }}
              className="absolute top-1/2 left-1/2 w-[var(--w)] overflow-hidden transition-[transform,opacity,border-radius,filter,box-shadow] duration-[750ms] ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{
                transform: `translate(-50%, -50%) translateX(${x}%) scale(${center ? 1 : 0.84})`,
                borderRadius: center ? 30 : 18,
                opacity: ad > 4 ? 0 : 1,
                filter: center ? "none" : "saturate(.75)",
                boxShadow: center ? "none" : "0 22px 40px -26px rgba(22,48,58,.55)",
                zIndex: center ? 5 : 1,
                pointerEvents: ad > 4 ? "none" : "auto",
              }}
              dir="ltr"
            >
              <ShotPicture shot={s} alt="" sizes="260px" className="pointer-events-none block aspect-[390/844] w-full bg-surface object-cover object-top" />
              {!center ? <span className="absolute inset-0 bg-bg/25 transition-opacity duration-500 hover:opacity-0" aria-hidden /> : null}
            </button>
          );
        })}

        {/* the phone: it stays where it is, the screens pass through it */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[calc(var(--w)*844/390+16px)] w-[calc(var(--w)+16px)] -translate-x-1/2 -translate-y-1/2 rounded-[38px] border-[8px] border-[#16303A] shadow-[0_50px_80px_-30px_rgba(22,48,58,0.75)] dark:border-[#0b1a20] dark:shadow-[0_50px_80px_-30px_rgba(0,0,0,0.9)]"
        >
          <span className="absolute top-2 left-1/2 h-[20px] w-[70px] -translate-x-1/2 rounded-full bg-[#16303A] dark:bg-[#0b1a20]" />
          <span className="absolute top-[22%] -right-[11px] h-14 w-[3px] rounded-full bg-[#16303A] dark:bg-[#0b1a20]" />
          <span className="absolute top-[18%] -left-[11px] h-9 w-[3px] rounded-full bg-[#16303A] dark:bg-[#0b1a20]" />
          <span className="absolute top-[28%] -left-[11px] h-9 w-[3px] rounded-full bg-[#16303A] dark:bg-[#0b1a20]" />
        </div>
      </div>

      {/* caption and controls */}
      <div className="mx-auto mt-6 flex max-w-xl flex-col items-center text-center">
        <p key={active} className={`dv-cap min-h-[2lh] text-ink ${rtl ? "text-[18px] leading-[30px] font-medium" : "font-latin text-[18px] leading-[28px] font-semibold"}`}>
          {shot.caption[lang]}
        </p>
        <div className="mt-5 flex items-center gap-4">
          <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label={strings.prev} className="grid size-11 place-items-center rounded-full border-[1.5px] border-line text-ink transition-colors hover:border-petrol/60 hover:text-petrol disabled:opacity-35">
            <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M13 8H3M7 4 3 8l4 4" /></svg>
          </button>
          <div className="flex items-center gap-1.5" aria-hidden>
            {shots.map((s, i) => (
              <span key={s.name} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-clay" : "w-1.5 bg-line"}`} />
            ))}
          </div>
          <button type="button" onClick={() => go(active + 1)} disabled={active === n - 1} aria-label={strings.next} className="grid size-11 place-items-center rounded-full bg-ink text-bg transition-[filter] hover:brightness-110 disabled:opacity-35">
            <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </button>
        </div>
        <p className="num mt-3 text-[13px] text-ink-muted" aria-live="polite">
          {pad(active + 1)} / {pad(n)}
        </p>
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
