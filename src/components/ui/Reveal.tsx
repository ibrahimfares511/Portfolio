"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { onReveal } from "@/lib/motion";

/**
 * Plays the brand entrance on its [data-reveal] children the first time it
 * scrolls into view (each section on its own, as the reader reaches it): words come out of a blur one after another ("word"),
 * then blocks ("text"), then larger pieces ("block").
 * Without motion (prefers-reduced-motion) everything is simply visible.
 */
export function Reveal({
  children,
  className,
  threshold = 0.15,
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

    // Hidden from the start (below the fold, so nobody sees the switch).
    const hidden = {
      word: { opacity: 0, filter: "blur(12px)", y: "0.25em" },
      text: { opacity: 0, filter: "blur(8px)", y: 12 },
      block: { opacity: 0, filter: "blur(14px)", y: 32 },
    };
    const pick = (k: keyof typeof hidden) => el.querySelectorAll(`[data-reveal='${k}']`);
    (Object.keys(hidden) as (keyof typeof hidden)[]).forEach((k) => {
      const nodes = pick(k);
      if (nodes.length) gsap.set(nodes, hidden[k]);
    });

    const stop = onReveal(() => {
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          ctx = gsap.context(() => {
            const done = { opacity: 1, filter: "blur(0px)", y: 0, clearProps: "filter,transform" };
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
            const words = pick("word");
            const texts = pick("text");
            const blocks = pick("block");
            if (words.length) tl.to(words, { ...done, duration: 0.5, stagger: 0.04 });
            if (blocks.length) tl.to(blocks, { ...done, duration: 0.8, stagger: 0.1 }, 0);
            if (texts.length) tl.to(texts, { ...done, duration: 0.55, stagger: 0.07 }, words.length ? "-=0.3" : 0.1);
          }, el);
        },
        // Starts as the element comes up into the lower part of the screen.
        { threshold, rootMargin: "0px 0px -10% 0px" },
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
