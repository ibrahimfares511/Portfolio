"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Step = { lead: string; text: string; pose: string };

/**
 * The four steps. A thin line runs through the step dots and is drawn as the
 * reader scrolls (the brand's pen, writing the way forward); each dot turns
 * clay when the line reaches it. Horizontal on desktop, down the side on
 * phones. Reduced motion: the line is simply drawn.
 */
export function ProcessSteps({ steps, lang }: { steps: Step[]; lang: "ar" | "en" }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paint = (p: number) => {
      lines.forEach((l) => (l.style.transform = l.dataset.line === "x" ? `scaleX(${p})` : `scaleY(${p})`));
      dots.forEach((d, i) => d.toggleAttribute("data-on", p >= i / (dots.length - 1) - 0.02));
    };
    if (reduced) {
      paint(1);
      return;
    }
    paint(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 55%",
      scrub: 0.6,
      onUpdate: (self) => paint(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <ol ref={root} className="relative mt-12 grid gap-10 ps-8 md:mt-16 lg:grid-cols-4 lg:gap-6 lg:ps-0">
      {/* The pen line: down the start side on phones, across on desktop. */}
      <span aria-hidden className="absolute inset-y-2 start-[7px] w-px bg-line lg:hidden" />
      <span
        aria-hidden
        data-line="y"
        className="absolute inset-y-2 start-[7px] w-px origin-top bg-petrol lg:hidden"
      />
      <span aria-hidden className="absolute inset-x-[12.5%] top-[275px] hidden h-px bg-line lg:block" />
      <span
        aria-hidden
        data-line="x"
        className="absolute inset-x-[12.5%] top-[275px] hidden h-px origin-left bg-petrol lg:block rtl:origin-right"
      />

      {steps.map((s, i) => (
        <li key={i} className="relative">
          <div className="relative mx-auto hidden h-[250px] w-full items-end justify-center overflow-hidden rounded-xl bg-[radial-gradient(closest-side_at_50%_75%,var(--sky-soft),transparent)] lg:flex">
            <Pose name={s.pose} className="h-[250px] w-auto" />
          </div>

          {/* step dot, on the line */}
          <span
            data-dot
            aria-hidden
            className="absolute -start-8 top-[10px] size-[15px] rounded-full border-2 border-petrol bg-bg transition-colors duration-300 data-[on]:border-clay data-[on]:bg-clay lg:static lg:mx-auto lg:mt-[17px] lg:block"
          />

          <div className="lg:mt-5 lg:text-center">
            <div className="flex items-end gap-4 lg:block">
              <span className="num font-display text-[32px] leading-none text-petrol">{String(i + 1).padStart(2, "0")}</span>
              <Pose name={s.pose} className="ms-auto h-[120px] w-auto lg:hidden" />
            </div>
            <p className="mt-3 text-[16px] leading-[28px] text-ink-muted md:text-[17px] md:leading-[30px]">
              <strong className={`text-ink ${lang === "en" ? "font-bold" : "font-medium"}`}>{s.lead}</strong>: {s.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Pose({ name, className }: { name: string; className: string }) {
  return (
    <picture>
      <source type="image/avif" srcSet={`/avatar/${name}-320.avif 320w, /avatar/${name}-480.avif 480w`} sizes="170px" />
      <img
        src={`/avatar/${name}-320.webp`}
        srcSet={`/avatar/${name}-320.webp 320w, /avatar/${name}-480.webp 480w`}
        sizes="170px"
        width={842}
        height={1264}
        alt=""
        loading="lazy"
        decoding="async"
        className={`select-none ${className}`}
      />
    </picture>
  );
}
