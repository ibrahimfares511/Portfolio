"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** "+13,000" → { prefix: "+", n: 13000 }; "~100" → { prefix: "~", n: 100 }. */
function parseStat(value: string) {
  const m = value.match(/^([+~]?)([\d,]+)(\+?)$/);
  if (!m) return null;
  return { prefix: m[1], n: Number(m[2].replace(/,/g, "")), suffix: m[3] };
}
const fmt = (n: number) => Math.round(n).toLocaleString("en-US"); // Western digits, always

/** A number that counts up from zero the first time it scrolls into view. Screen readers get the value. */
export function CountUp({ value, delay = 0.3 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const stat = parseStat(value);
    if (!el || !stat || stat.n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = `${stat.prefix}0${stat.suffix}`;
    let tw: gsap.core.Tween | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const st = { n: 0 };
        tw = gsap.to(st, {
          n: stat.n,
          delay,
          duration: stat.n > 50 ? 1.4 : 0.9,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${stat.prefix}${fmt(st.n)}${stat.suffix}`;
          },
          onComplete: () => {
            el.textContent = value;
          },
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tw?.kill();
      el.textContent = value;
    };
  }, [value, delay]);
  return (
    <>
      <span ref={ref} aria-hidden dir="ltr">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
