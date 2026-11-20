"use client";

import { useEffect, useRef, useState } from "react";

const CSS = `
@keyframes cv-drop { 0% { transform: translateY(0); opacity: 1 } 45% { transform: translateY(7px); opacity: 0 } 46% { transform: translateY(-9px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
@keyframes cv-shine { from { transform: translateX(-120%) skewX(-20deg) } to { transform: translateX(320%) skewX(-20deg) } }
@keyframes cv-check { to { stroke-dashoffset: 0 } }
.cv-btn:hover .cv-arrow, .cv-btn:focus-visible .cv-arrow { animation: cv-drop 0.9s cubic-bezier(.5,0,.3,1) infinite; }
.cv-btn[data-seen] .cv-shine { animation: cv-shine 1.1s ease-in-out 0.6s 1 both; }
.cv-btn[data-done] .cv-check { animation: cv-check 0.45s ease-out forwards; }
@media (prefers-reduced-motion: reduce) { .cv-btn .cv-arrow, .cv-btn .cv-shine { animation: none !important } }
`;

/**
 * Download CV. A light sweeps across it once when it first comes into view; on hover the clay fill
 * rises from the bottom and the arrow keeps dropping into the tray; after a click the arrow turns
 * into a tick for a moment, so you know the download started.
 */
export function CvButton({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.setAttribute("data-seen", "");
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => setDone(false), 2400);
    return () => window.clearTimeout(id);
  }, [done]);

  return (
    <a
      ref={ref}
      href={href}
      download
      data-track="cv-download"
      onClick={() => setDone(true)}
      data-done={done ? "" : undefined}
      className="cv-btn group relative inline-flex h-12 items-center overflow-hidden rounded-md bg-ink px-6 text-[16px] font-medium text-bg shadow-[0_10px_30px_-14px_var(--ink)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_var(--clay)] active:translate-y-0"
    >
      <style href="cv-button" precedence="default">{CSS}</style>
      {/* clay fill rising from the bottom on hover */}
      <span aria-hidden className="absolute inset-0 translate-y-full bg-clay-strong transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-0" />
      {/* one sweep of light when it first appears */}
      <span aria-hidden className="cv-shine pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-[120%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]" />
      <span className="relative flex items-center gap-2.5 group-hover:text-on-clay">
        <span className="relative grid size-[18px] place-items-center overflow-hidden" aria-hidden>
          {done ? (
            <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path className="cv-check" d="M4 10.5 8 14.5 16 5.5" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <g className="cv-arrow">
                <path d="M10 3v10M6 9l4 4 4-4" />
              </g>
              <path d="M4 16h12" />
            </svg>
          )}
        </span>
        {label}
      </span>
    </a>
  );
}
