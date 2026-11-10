"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { markPreloaderDone, PRELOADER_SESSION_KEY } from "@/lib/preloader";

/**
 * The "if" mark written by a pen, letter by letter (i, f with its tail,
 * crossbar), a sky nib riding the pen tip, then the clay dot lands and
 * pulses once. Brand rules (design system → Motion):
 * - writing takes 1.2s; if the page is still loading, erase and write again;
 * - if the page is already loaded, it plays faster: nobody waits;
 * - prefers-reduced-motion shows the finished mark at once, no writing.
 * Shown once per tab session; later loads skip it (see PRELOADER_BOOT_SCRIPT).
 */
const STROKES = [
  { d: "M28 78 V46", dur: 0.3 },
  { d: "M80 18 Q62 18 62 36 V82 Q62 96 48 96 H36", dur: 0.6 },
  { d: "M46 48 H78", dur: 0.3 },
];

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;

    const finish = () => {
      html.classList.remove("pl-active");
      html.classList.add("pl-skip");
      try {
        sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
      } catch {}
      markPreloaderDone();
    };

    // Skipped by the boot script: nothing to play.
    if (html.classList.contains("pl-skip")) {
      markPreloaderDone();
      return;
    }

    const paths = Array.from(el.querySelectorAll<SVGPathElement>("[data-stroke]"));
    const dot = el.querySelector<SVGCircleElement>("[data-dot]")!;
    const nib = el.querySelector<SVGCircleElement>("[data-nib]")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad, { once: true });

    const exit = () =>
      gsap.to(el, {
        autoAlpha: 0,
        duration: reduced ? 0.25 : 0.5,
        ease: "power2.inOut",
        onStart: finish,
      });

    if (reduced) {
      gsap.set(paths, { strokeDashoffset: 0 });
      gsap.set(dot, { scale: 1, y: 0 });
      gsap.set(nib, { autoAlpha: 0 });
      const wait = () => (loaded ? exit() : window.addEventListener("load", () => exit(), { once: true }));
      const id = window.setTimeout(wait, 300);
      return () => {
        window.clearTimeout(id);
        window.removeEventListener("load", onLoad);
      };
    }

    const lengths = paths.map((p) => p.getTotalLength());
    const ctx = gsap.context(() => {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(dot, { scale: 0, y: -18, transformOrigin: "50% 50%" });
      gsap.set(nib, { autoAlpha: 0 });

      const write = () => {
        const tl = gsap.timeline();
        paths.forEach((path, i) => {
          const state = { p: 0 };
          tl.to(
            state,
            {
              p: 1,
              duration: STROKES[i].dur,
              ease: "power1.inOut",
              onStart: () => gsap.set(nib, { autoAlpha: 1 }),
              onUpdate: () => {
                path.style.strokeDashoffset = String(1 - state.p);
                const pt = path.getPointAtLength(lengths[i] * state.p);
                nib.setAttribute("cx", String(pt.x));
                nib.setAttribute("cy", String(pt.y));
              },
            },
            i === 0 ? 0 : ">-0.02",
          );
        });
        tl.to(nib, { autoAlpha: 0, duration: 0.15 }, ">-0.05");
        // The dot drops, lands a little big, settles, pulses once.
        tl.to(dot, { y: 0, scale: 1.2, duration: 0.18, ease: "power2.in" }, ">-0.1")
          .to(dot, { scale: 1, duration: 0.12, ease: "power1.out" })
          .to(dot, { scale: 1.28, duration: 0.14, ease: "power1.inOut" }, "+=0.08")
          .to(dot, { scale: 1, duration: 0.16, ease: "power1.inOut" });
        return tl;
      };

      const erase = () =>
        gsap
          .timeline()
          .to(dot, { scale: 0, duration: 0.2, ease: "power1.in" })
          .to([...paths].reverse(), { strokeDashoffset: 1, duration: 0.25, stagger: 0.12, ease: "power1.in" }, "<");

      const cycle = () => {
        const tl = write();
        if (loaded) tl.timeScale(1.6); // page is ready: don't make anyone wait
        tl.eventCallback("onComplete", () => {
          if (loaded) exit();
          else
            erase().eventCallback("onComplete", () => {
              gsap.set(dot, { y: -18 });
              cycle();
            });
        });
      };
      cycle();
    }, el);

    return () => {
      ctx.revert();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div
      ref={root}
      id="preloader"
      aria-hidden
      className="fixed inset-0 z-[90] flex items-center justify-center bg-bg"
    >
      <svg viewBox="0 0 100 106" className="h-[110px] w-auto overflow-visible md:h-[130px]">
        <g fill="none" stroke="var(--ink)" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round">
          {STROKES.map((s) => (
            <path key={s.d} d={s.d} pathLength={1} data-stroke strokeDasharray="1" />
          ))}
        </g>
        <circle data-nib r={3.2} cx={28} cy={78} fill="var(--sky)" opacity={0} />
        <circle data-dot cx={28} cy={27} r={7.5} fill="var(--clay)" />
      </svg>
    </div>
  );
}
