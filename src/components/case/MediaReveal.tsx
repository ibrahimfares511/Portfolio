"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { onReveal } from "@/lib/motion";

/**
 * A picture or a video frame entering as it scrolls into view: it opens up
 * from a narrower window (clip-path) while the picture inside settles from a
 * slight zoom. Once only. Reduced motion: simply there.
 */
export function MediaReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(el, { clipPath: "inset(14% 10% 14% 10% round 28px)", opacity: 0 });
    let io: IntersectionObserver | undefined;
    let tl: gsap.core.Timeline | undefined;
    const stop = onReveal(() => {
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io?.disconnect();
          tl = gsap
            .timeline({ delay })
            .to(el, { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, duration: 1.15, ease: "power3.out", clearProps: "clipPath,opacity" })
            .fromTo(el.firstElementChild, { scale: 1.06 }, { scale: 1, duration: 1.4, ease: "power3.out", clearProps: "transform" }, 0);
        },
        { threshold: 0.2 },
      );
      io.observe(el);
    });
    return () => {
      stop();
      io?.disconnect();
      tl?.kill();
      gsap.set(el, { clearProps: "clipPath,opacity" });
    };
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      <div>{children}</div>
    </div>
  );
}
