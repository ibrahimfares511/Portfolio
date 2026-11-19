"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

const CSS = `
@keyframes ps-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
.ps-float { animation: ps-float 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ps-float { animation: none } }
`;

export type Floating = { node: ReactNode; pos: string };

/**
 * A pose of the character standing in a framed patch of brand light, with a few things floating
 * beside him. The first time it comes into view: the frame opens upward from the floor, the character
 * rises in out of a blur, then the floating pieces pop in and keep drifting. Used by About and Contact.
 * Reduced motion: everything is simply there.
 */
export function PoseStage({
  pose,
  floating = [],
  mirror = false,
}: {
  /** file stem in /public/avatar, available at 320/480/640 */
  pose: string;
  floating?: Floating[];
  /** flip the character so he faces the other way */
  mirror?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = el.querySelector("[data-frame]"), body = el.querySelector("[data-pose]"), chips = el.querySelectorAll("[data-chip]");
    gsap.set(frame, { clipPath: "inset(100% 0% 0% 0% round 28px)" });
    gsap.set(body, { opacity: 0, y: 70, scale: 1.06, filter: "blur(14px)" });
    gsap.set(chips, { opacity: 0, scale: 0.6, y: 14 });
    let tl: gsap.core.Timeline | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        tl = gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(frame, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.1, clearProps: "clipPath" })
          .to(body, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out", clearProps: "filter,transform" }, 0.3)
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

  return (
    <div ref={root} className="relative">
      <style href="pose-stage" precedence="default">{CSS}</style>
      <div
        data-frame
        className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[28px] bg-[radial-gradient(110%_80%_at_20%_0%,var(--sky-soft),transparent_62%),radial-gradient(90%_70%_at_100%_100%,var(--clay-soft),transparent_66%)] ring-1 ring-line lg:max-h-[calc(100dvh-200px)] lg:w-auto lg:max-w-full"
      >
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,var(--bg),transparent)] opacity-40" />
        <picture data-pose className="absolute inset-x-0 bottom-0 flex h-[92%] justify-center">
          <source
            type="image/avif"
            srcSet={`/avatar/${pose}-320.avif 320w, /avatar/${pose}-480.avif 480w, /avatar/${pose}-640.avif 640w`}
            sizes="(min-width: 1024px) 400px, 300px"
          />
          <img
            src={`/avatar/${pose}-640.webp`}
            srcSet={`/avatar/${pose}-320.webp 320w, /avatar/${pose}-480.webp 480w, /avatar/${pose}-640.webp 640w`}
            sizes="(min-width: 1024px) 400px, 300px"
            width={848}
            height={1264}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`h-full w-auto select-none ${mirror ? "-scale-x-100" : ""}`}
          />
        </picture>
      </div>

      {floating.map((f, i) => (
        <div key={i} data-chip className={`absolute ${f.pos}`}>
          <div className="ps-float" style={{ animationDelay: `${i * -2.5}s` }}>
            {f.node}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The look of a small floating card beside the character. */
export const floatCard =
  "rounded-2xl border border-line bg-surface/90 shadow-[0_20px_40px_-24px_rgba(22,48,58,0.55)] backdrop-blur-sm dark:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]";
