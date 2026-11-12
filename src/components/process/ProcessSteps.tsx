"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Step = { lead: string; text: string; pose: string };

/**
 * The four steps as a story, read top to bottom. A pen line runs down the
 * middle (down the start side on phones) and fills as you scroll; each dot
 * turns clay when the line reaches it. Each step slides in from its side as
 * it comes up, and its picture drifts a little with the scroll.
 * Reduced motion: everything is simply there, line full.
 */
export function ProcessSteps({
  steps,
  lang,
}: {
  steps: Step[];
  lang: "ar" | "en";
}) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = root.current;
    if (!list) return;
    const fill = list.querySelector<HTMLElement>("[data-fill]");
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
    const dots = items.map((it) => it.querySelector<HTMLElement>("[data-dot]"));
    const poses = items.map((it) =>
      it.querySelector<HTMLElement>("[data-pose]"),
    );
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      if (fill) fill.style.transform = "scaleY(1)";
      dots.forEach((d) => d?.setAttribute("data-on", ""));
      return;
    }

    // Entrances: once, as each step comes up into view.
    const parts = items.map((it) => ({
      a: it.querySelector<HTMLElement>("[data-in='a']"),
      b: it.querySelector<HTMLElement>("[data-in='b']"),
    }));
    parts.forEach(({ a, b }, i) => {
      const flip = i % 2 === 1;
      if (a) gsap.set(a, { opacity: 0, xPercent: flip ? 8 : -8, scale: 0.96 });
      if (b)
        gsap.set(b, {
          opacity: 0,
          xPercent: flip ? -6 : 6,
          filter: "blur(8px)",
        });
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const { a, b } = parts[items.indexOf(e.target as HTMLElement)];
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (a) tl.to(a, { opacity: 1, xPercent: 0, scale: 1, duration: 0.9 });
          if (b)
            tl.to(
              b,
              {
                opacity: 1,
                xPercent: 0,
                filter: "blur(0px)",
                duration: 0.8,
                clearProps: "filter",
              },
              0.15,
            );
        }),
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((it) => io.observe(it));

    // Scroll-linked: the line fills, dots light up, pictures drift.
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = list.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
      if (fill) fill.style.transform = `scaleY(${p})`;
      items.forEach((it, i) => {
        const ir = it.getBoundingClientRect();
        const reached = (ir.top + 40 - r.top) / r.height <= p;
        dots[i]?.toggleAttribute("data-on", reached);
        const pose = poses[i];
        if (pose) {
          const off = (ir.top + ir.height / 2 - vh / 2) / vh; // -1 … 1 around the middle
          pose.style.transform = `translate3d(0, ${(off * -28).toFixed(1)}px, 0)`;
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol
      ref={root}
      className="relative mt-14 grid gap-14 ps-10 md:mt-20 lg:gap-6 lg:ps-0"
    >
      {/* the pen line: track + fill */}
      <span
        aria-hidden
        className="absolute inset-y-0 start-[11px] w-[2px] rounded-full bg-line lg:start-1/2 lg:-translate-x-1/2 rtl:lg:translate-x-1/2"
      />
      <span
        aria-hidden
        data-fill
        className="absolute inset-y-0 start-[11px] w-[2px] origin-top scale-y-0 rounded-full bg-clay lg:start-1/2 lg:-translate-x-1/2 rtl:lg:translate-x-1/2"
      />

      {steps.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <li
            key={i}
            data-step
            className="relative grid items-center gap-6 lg:min-h-[340px] lg:grid-cols-2 lg:gap-24"
          >
            {/* dot on the line */}
            <span
              data-dot
              aria-hidden
              className="absolute -start-10 top-2 grid size-[24px] place-items-center rounded-full border-2 border-line bg-bg transition-[border-color,background-color] duration-500 data-[on]:border-clay lg:start-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 rtl:lg:translate-x-1/2 [&[data-on]>span]:scale-100"
            >
              <span className="block size-[10px] scale-0 rounded-full bg-clay transition-transform duration-500" />
            </span>

            {/* picture */}
            <div
              data-in="a"
              className={`relative hidden justify-center lg:flex ${flip ? "lg:order-2" : ""}`}
            >
              <div className="relative flex h-[320px] w-[300px] items-end justify-center overflow-hidden rounded-[28px] bg-[radial-gradient(closest-side_at_50%_70%,var(--sky-soft),transparent)]">
                <span
                  aria-hidden
                  className="absolute inset-x-6 bottom-0 h-px bg-line"
                />
                <div data-pose className="will-change-transform">
                  <Pose name={s.pose} className="h-[320px] w-auto" />
                </div>
              </div>
            </div>

            {/* words */}
            <div
              data-in="b"
              className={`relative ${flip ? "lg:order-1 lg:text-end" : ""}`}
            >
              <div
                className={`flex items-end gap-4 ${flip ? "lg:flex-row-reverse" : ""}`}
              >
                <span className="num font-display text-[56px] leading-none text-clay md:text-[72px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Pose
                  name={s.pose}
                  className="ms-auto h-[130px] w-auto lg:hidden"
                />
              </div>
              <h3
                className={`mt-4 text-[22px] leading-[32px] text-ink md:text-[26px] md:leading-[38px] ${lang === "en" ? "font-latin font-bold" : "font-medium"}`}
              >
                {s.lead}
              </h3>
              <p
                className={`mt-2 max-w-md text-[16px] leading-[28px] text-ink-muted md:text-[17px] md:leading-[30px] ${flip ? "lg:ms-auto" : ""}`}
              >
                {s.text}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Pose({ name, className }: { name: string; className: string }) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`/avatar/${name}-320.avif 320w, /avatar/${name}-480.avif 480w`}
        sizes="220px"
      />
      <img
        src={`/avatar/${name}-320.webp`}
        srcSet={`/avatar/${name}-320.webp 320w, /avatar/${name}-480.webp 480w`}
        sizes="220px"
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
