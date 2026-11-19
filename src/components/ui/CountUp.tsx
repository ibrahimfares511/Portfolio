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
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      cleanup();
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
    };
    // On screen? Checked by the observer, and also on scroll and when a cover
    // (preloader, page transition) opens (a client-side move to another case study can scroll
    // the page under the cover, which the observer alone may miss).
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight * 0.92 && r.width > 0;
    };
    const check = () => {
      // under a cover (preloader, page transition) wait for it to open
      if (!started && !window.__ifBusy && inView()) start();
    };
    // the cover is opening ("if:reveal" comes while __ifBusy is still true)
    const opening = () => {
      if (!started && inView()) start();
    };
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && !window.__ifBusy && start(), { threshold: 0.6 });
    io.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("if:reveal", opening);
    const raf = requestAnimationFrame(() => requestAnimationFrame(check));
    function cleanup() {
      io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("if:reveal", opening);
      cancelAnimationFrame(raf);
    }
    return () => {
      cleanup();
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
