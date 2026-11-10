"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { onReveal } from "@/lib/motion";

/**
 * Plays the brand entrance on its [data-reveal] children the first time it
 * scrolls into view: words come out of a blur one after another ("word"),
 * then blocks ("text"), then larger pieces ("block").
 * Without motion (prefers-reduced-motion) everything is simply visible.
 */
export function Reveal({
  children,
  className,
  threshold = 0.2,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: gsap.Context | undefined;
    let io: IntersectionObserver | undefined;

    const stop = onReveal(() => {
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          ctx = gsap.context(() => {
            const done = { opacity: 1, filter: "blur(0px)", y: 0, clearProps: "filter,transform" };
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
            const words = el.querySelectorAll("[data-reveal='word']");
            const texts = el.querySelectorAll("[data-reveal='text']");
            const blocks = el.querySelectorAll("[data-reveal='block']");
            if (words.length)
              tl.fromTo(words, { opacity: 0, filter: "blur(12px)", y: "0.25em" }, { ...done, duration: 0.5, stagger: 0.04 });
            if (texts.length)
              tl.fromTo(texts, { opacity: 0, filter: "blur(8px)", y: 12 }, { ...done, duration: 0.55, stagger: 0.07 }, words.length ? "-=0.3" : 0);
            if (blocks.length)
              tl.fromTo(blocks, { opacity: 0, filter: "blur(14px)", y: 32 }, { ...done, duration: 0.8, stagger: 0.1 }, 0.1);
          }, el);
        },
        { threshold, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    });

    return () => {
      stop();
      io?.disconnect();
      ctx?.revert();
    };
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
