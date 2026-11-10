"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { onReveal } from "@/lib/motion";

type Step = { lead: string; text: string; pose: string };

/**
 * The four steps. When the list comes into view they appear one after
 * another (out of a blur), while a thin line, the brand's pen, runs from dot
 * to dot and each dot turns clay. Horizontal on desktop; on phones the steps
 * are stacked, so each one appears as the reader scrolls down to it. Reduced motion: everything is simply there.
 */
export function ProcessSteps({ steps, lang }: { steps: Step[]; lang: "ar" | "en" }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"));
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (p: number) =>
      lines.forEach((l) => (l.style.transform = l.dataset.line === "x" ? `scaleX(${p})` : `scaleY(${p})`));

    if (reduced) {
      draw(1);
      dots.forEach((d) => d.setAttribute("data-on", ""));
      return;
    }

    // Hidden until the list comes into view, then the steps appear one after
    // another while the pen line runs from dot to dot.
    draw(0);
    gsap.set(items, { opacity: 0, filter: "blur(12px)", y: 24 });
    const STEP = 0.45; // seconds between two steps
    let tl: gsap.core.Timeline | undefined;
    let io: IntersectionObserver | undefined;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const show = (i: number) =>
      gsap.to(items[i], { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6, ease: "power2.out", clearProps: "filter,transform" });

    const stop = onReveal(() => {
      if (!desktop) {
        // Phones: the steps are stacked, so each one appears as the reader
        // reaches it, and the line grows down to it.
        let reached = -1;
        const line = { p: 0 };
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              const i = items.indexOf(e.target as HTMLElement);
              io?.unobserve(e.target);
              show(i);
              dots[i]?.setAttribute("data-on", "");
              if (i > reached) {
                reached = i;
                gsap.to(line, { p: (i + 0.5) / items.length, duration: 0.6, ease: "power2.out", onUpdate: () => draw(line.p) });
              }
            });
          },
          { threshold: 0.35, rootMargin: "0px 0px -12% 0px" },
        );
        items.forEach((item) => io!.observe(item));
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          const line = { p: 0 };
          tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          items.forEach((item, i) => {
            tl!.to(item, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6, clearProps: "filter,transform" }, i * STEP);
            tl!.call(() => dots[i]?.setAttribute("data-on", ""), [], i * STEP + 0.1);
          });
          tl.to(line, { p: 1, duration: STEP * (items.length - 1), ease: "none", onUpdate: () => draw(line.p) }, 0.1);
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(el);
    });
    return () => {
      stop();
      io?.disconnect();
      tl?.kill();
    };
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
        <li key={i} data-step className="relative">
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
