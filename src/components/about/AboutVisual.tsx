"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

type Fact = { label: string; value: string; icon: ReactNode };

/**
 * The About picture. The first time it comes into view: the framed light opens upward from the
 * floor, the character rises into it out of a blur, then the two facts pop in beside him and keep
 * floating gently. Reduced motion: everything is simply there.
 */
export function AboutVisual({ facts }: { facts: [Fact, Fact] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = el.querySelector("[data-frame]"), pose = el.querySelector("[data-pose]"), chips = el.querySelectorAll("[data-chip]");
    gsap.set(frame, { clipPath: "inset(100% 0% 0% 0% round 28px)" });
    gsap.set(pose, { opacity: 0, y: 70, scale: 1.06, filter: "blur(14px)" });
    gsap.set(chips, { opacity: 0, scale: 0.6, y: 14 });
    let tl: gsap.core.Timeline | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        tl = gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(frame, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.1, clearProps: "clipPath" })
          .to(pose, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out", clearProps: "filter,transform" }, 0.3)
          .to(chips, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.18, ease: "back.out(1.8)", clearProps: "transform" }, 0.95);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tl?.kill();
    };
  }, []);

  const pos = ["start-0 top-[14%] sm:-start-6", "end-0 top-[46%] sm:-end-6"];
  return (
    <div ref={root} className="relative">
      <div
        data-frame
        className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[28px] bg-[radial-gradient(110%_80%_at_20%_0%,var(--sky-soft),transparent_62%),radial-gradient(90%_70%_at_100%_100%,var(--clay-soft),transparent_66%)] ring-1 ring-line lg:max-h-[calc(100dvh-200px)] lg:w-auto lg:max-w-full"
      >
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,var(--bg),transparent)] opacity-40" />
        <picture data-pose className="absolute inset-x-0 bottom-0 flex h-[92%] justify-center">
          <source
            type="image/avif"
            srcSet="/avatar/07-wave-320.avif 320w, /avatar/07-wave-480.avif 480w, /avatar/07-wave-640.avif 640w"
            sizes="(min-width: 1024px) 400px, 300px"
          />
          <img
            src="/avatar/07-wave-640.webp"
            srcSet="/avatar/07-wave-320.webp 320w, /avatar/07-wave-480.webp 480w, /avatar/07-wave-640.webp 640w"
            sizes="(min-width: 1024px) 400px, 300px"
            width={848}
            height={1264}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-auto select-none"
          />
        </picture>
      </div>

      {facts.map((f, i) => (
        <div key={f.label} data-chip className={`absolute ${pos[i]}`}>
          <div
            className="ab-float flex items-center gap-2.5 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-[0_20px_40px_-24px_rgba(22,48,58,0.55)] backdrop-blur-sm dark:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
            style={{ animationDelay: `${i * -2.5}s` }}
          >
            <span className="grid size-8 place-items-center rounded-full bg-sky-soft text-petrol">
              <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {f.icon}
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="text-[12px] leading-[16px] text-ink-muted">{f.label}</span>
              <span className="text-[14px] leading-[20px] font-medium text-ink">{f.value}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
