"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Words } from "@/components/ui/Words";
import { Reveal } from "@/components/ui/Reveal";

type Step = { lead: string; text: string; pose: string };
const pad = (n: number) => String(n).padStart(2, "0");

const CSS = `
@keyframes pj-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes pj-dot { 0%,80%,100% { transform: translateY(0); opacity: .45 } 40% { transform: translateY(-3px); opacity: 1 } }
.pj-float { animation: pj-float 6s ease-in-out infinite; }
.pj-typing span { animation: pj-dot 1.1s ease-in-out infinite; }
.pj-typing span:nth-child(2) { animation-delay: .15s } .pj-typing span:nth-child(3) { animation-delay: .3s }
@media (prefers-reduced-motion: reduce) { .pj-float, .pj-typing span { animation: none } }
`;

/**
 * "How we work together" as a journey read top to bottom. A wavy pen line draws itself down the
 * section as you scroll, the pen tip leading; each time it reaches a chapter, that chapter comes to
 * life: its little scene plays (a conversation, a plan being ticked off and signed, a screen being
 * built week by week, a delivery with two free months). Normal scrolling, no pinning.
 * Reduced motion: the line is drawn and every scene is shown finished.
 */
export function ProcessJourney({ steps, lang, closing }: { steps: Step[]; lang: "ar" | "en"; closing: string }) {
  const root = useRef<HTMLOListElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const isAr = lang === "ar";

  useEffect(() => {
    const ol = root.current, s = svg.current;
    if (!ol || !s) return;
    const track = s.querySelector<SVGPathElement>("[data-track]")!;
    const ink = s.querySelector<SVGPathElement>("[data-ink]")!;
    const tip = s.querySelector<SVGGElement>("[data-tip]")!;
    const marks = Array.from(s.querySelectorAll<SVGCircleElement>("[data-mark]"));
    const items = Array.from(ol.querySelectorAll<HTMLElement>(":scope > li[data-step]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const played = new Set<number>();
    const scenes = items.map((li) => buildScene(li));
    let length = 1, anchorsY: number[] = [], raf = 0;

    // Lay the wave through every chapter's anchor, swinging out between them.
    const layout = () => {
      const box = ol.getBoundingClientRect();
      const w = box.width, h = box.height;
      s.setAttribute("viewBox", `0 0 ${w} ${h}`);
      s.setAttribute("width", String(w));
      s.setAttribute("height", String(h));
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const pts = items.map((li) => {
        const a = li.querySelector<HTMLElement>("[data-anchor]")!.getBoundingClientRect();
        return [a.left + a.width / 2 - box.left, a.top + a.height / 2 - box.top] as [number, number];
      });
      anchorsY = pts.map((p) => p[1]);
      const start: [number, number] = [pts[0][0], 0];
      const end: [number, number] = [pts[pts.length - 1][0], h];
      const all = [start, ...pts, end];
      const swing = wide ? Math.min(220, w * 0.17) : 14;
      let d = `M ${start[0]} ${start[1]}`;
      for (let i = 1; i < all.length; i++) {
        const [x0, y0] = all[i - 1], [x1, y1] = all[i];
        const dy = y1 - y0, side = i % 2 ? 1 : -1;
        // two loose bends between stops, like a hand drawing on its way
        const mx = (x0 + x1) / 2 + side * swing, my = y0 + dy / 2;
        d += ` C ${x0} ${y0 + dy * 0.28}, ${mx} ${my - dy * 0.22}, ${mx} ${my}`;
        d += ` S ${x1} ${y1 - dy * 0.28}, ${x1} ${y1}`;
      }
      track.setAttribute("d", d);
      ink.setAttribute("d", d);
      length = ink.getTotalLength();
      ink.style.strokeDasharray = `${length}`;
      marks.forEach((m, i) => {
        m.setAttribute("cx", String(pts[i][0]));
        m.setAttribute("cy", String(pts[i][1]));
      });
      draw();
    };

    // How far the pen has got: its tip sits a little above the middle of the screen.
    const draw = () => {
      raf = 0;
      const vh = window.innerHeight;
      const box = ol.getBoundingClientRect();
      const p = reduced ? 1 : Math.min(1, Math.max(0, (vh * 0.58 - box.top) / box.height));
      ink.style.strokeDashoffset = `${length * (1 - p)}`;
      const pt = ink.getPointAtLength(length * p);
      tip.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      tip.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
      anchorsY.forEach((y, i) => {
        const on = pt.y >= y - 4;
        marks[i].toggleAttribute("data-on", on);
        if (on && !played.has(i)) {
          played.add(i);
          if (reduced) scenes[i].progress(1);
          else scenes[i].play();
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    layout();
    const ro = new ResizeObserver(() => layout());
    ro.observe(ol);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      scenes.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative">
      <style href="process-journey" precedence="default">{CSS}</style>
      <ol ref={root} className="relative mt-14 grid gap-24 ps-12 md:mt-20 lg:gap-36 lg:ps-0">
        {/* the pen line */}
        <svg ref={svg} aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
          <path data-track fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
          <path data-ink fill="none" stroke="var(--clay)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {steps.map((_, i) => (
            <circle
              key={i}
              data-mark
              r="9"
              className="fill-[var(--bg)] stroke-[var(--line)] [stroke-width:2] transition-[stroke] duration-500 data-[on]:stroke-[var(--clay)]"
            />
          ))}
          <g data-tip style={{ opacity: 0 }}>
            <circle r="16" fill="var(--clay)" opacity="0.18" />
            <circle r="6" fill="var(--clay)" />
          </g>
        </svg>

        {steps.map((s, i) => {
          const flip = i % 2 === 1;
          const last = i === steps.length - 1;
          return (
            <li key={i} data-step className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-28">
              {/* where the line passes: the start edge on phones, between the columns on desktop */}
              <span
                data-anchor
                aria-hidden
                className={`absolute -start-12 top-6 size-6 lg:top-1/2 lg:-translate-y-1/2 ${flip ? "lg:start-[calc(50%+10px)]" : "lg:start-[calc(50%-34px)]"}`}
              />

              {/* the character and the little scene of this chapter */}
              <div className={`relative flex justify-center ${flip ? "lg:order-2" : ""}`}>
                <div className="relative h-[250px] w-full max-w-[340px] sm:h-[300px] lg:h-[340px]">
                  <span aria-hidden className="absolute inset-x-6 bottom-0 aspect-square translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent)]" />
                  <div className="pj-float absolute inset-y-0 start-0 flex items-end" style={{ animationDelay: `${i * -1.4}s` }}>
                    <picture className="block h-full">
                      <source type="image/avif" srcSet={`/avatar/${s.pose}-320.avif 320w, /avatar/${s.pose}-480.avif 480w`} sizes="230px" />
                      <img
                        src={`/avatar/${s.pose}-480.webp`}
                        srcSet={`/avatar/${s.pose}-320.webp 320w, /avatar/${s.pose}-480.webp 480w`}
                        sizes="230px"
                        width={842}
                        height={1264}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-full w-auto select-none"
                      />
                    </picture>
                  </div>
                  <div className="absolute end-0 bottom-4 w-[210px] sm:w-[230px]">
                    <Scene kind={i} />
                  </div>
                </div>
              </div>

              {/* the chapter */}
              <Reveal className={flip ? "lg:order-1" : ""}>
                <div className={`flex flex-col ${flip ? "lg:items-end lg:text-end" : ""}`}>
                  <p data-reveal="text" className="flex items-center gap-3 text-[14px] leading-[22px] text-ink-muted">
                    <span className="num text-clay">{pad(i + 1)}</span>
                    <span aria-hidden className="h-px w-10 bg-clay/60" />
                    <span className="num">{pad(steps.length)}</span>
                  </p>
                  <h3
                    className={
                      isAr
                        ? "mt-2 text-[40px] leading-[60px] font-semibold text-ink lg:text-[56px] lg:leading-[80px]"
                        : "mt-2 font-latin text-[40px] leading-[46px] font-bold tracking-[-0.03em] text-ink lg:text-[60px] lg:leading-[66px]"
                    }
                  >
                    <Words text={s.lead} />
                    <span className="ms-2 inline-block size-[0.16em] rounded-full bg-clay" aria-hidden />
                  </h3>
                  <p className="mt-3 max-w-md text-[17px] leading-[30px] text-ink-muted lg:text-[19px] lg:leading-[34px]">
                    <Words text={s.text} />
                  </p>
                  {last ? (
                    <p
                      data-reveal="text"
                      className={`mt-7 max-w-md border-s-2 border-clay ps-5 ${
                        isAr ? "text-[22px] leading-[36px] font-medium text-ink" : "font-display text-[28px] leading-[34px] text-ink lowercase"
                      }`}
                    >
                      {closing}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- the little scenes (shapes only, no words) ---------- */

// The scenes are little paper cards: always light, so they stand out on the dark petrol band.
const card = "rounded-2xl bg-[#f6f1ea] p-3.5 text-[#16303a] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)]";
const bar = "block h-1.5 rounded-full bg-[#16303a]/15";

function Scene({ kind }: { kind: number }) {
  if (kind === 0)
    // a first conversation: they talk, I answer, they're typing again
    return (
      <div data-scene className="flex flex-col gap-2">
        <div data-sp className={`${card} w-[78%] rounded-es-md`}>
          <span className={`${bar} w-full`} />
          <span className={`${bar} mt-1.5 w-2/3`} />
        </div>
        <div data-sp className="ms-auto w-[82%] rounded-2xl rounded-ee-md bg-[#c2603f] p-3.5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.55)]">
          <span className="block h-1.5 w-full rounded-full bg-white/45" />
          <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-white/45" />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-white/45" />
        </div>
        <div data-sp className={`${card} pj-typing flex w-fit gap-1 rounded-es-md px-4 py-3`}>
          <span className="size-1.5 rounded-full bg-[#16303a]/55" />
          <span className="size-1.5 rounded-full bg-[#16303a]/55" />
          <span className="size-1.5 rounded-full bg-[#16303a]/55" />
        </div>
      </div>
    );
  if (kind === 1)
    // the plan in writing: what, price, date, each ticked; then signed
    return (
      <div data-scene className={card}>
        {[
          <path key="d" d="M4 2h6l4 4v8H4zM10 2v4h4" />,
          <g key="c"><circle cx="9" cy="9" r="6" /><path d="M9 6v6M7 8h3a1 1 0 0 1 0 2H8" /></g>,
          <g key="t"><rect x="3" y="4" width="12" height="10" rx="2" /><path d="M3 8h12M6 2v3M12 2v3" /></g>,
        ].map((icon, k) => (
          <div key={k} data-sp className="flex items-center gap-2.5 border-b border-[#16303a]/10 py-2 last:border-b-0">
            <svg viewBox="0 0 18 18" className="size-4 shrink-0 text-[#1f4e5f]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {icon}
            </svg>
            <span className={`${bar} flex-1`} style={{ maxWidth: `${70 - k * 12}%` }} />
            <span className="ms-auto grid size-5 place-items-center rounded-md border border-[#16303a]/25">
              <svg viewBox="0 0 12 12" className="size-3 text-[#c2603f]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path data-tick d="M2.5 6.2 5 8.5 9.5 3.5" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
              </svg>
            </span>
          </div>
        ))}
        <svg viewBox="0 0 120 22" className="mt-2 h-5 w-24 text-[#16303a]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path data-sign d="M3 15c8-12 12 6 18-2s6-9 9 0 4 8 10-3 7 4 12 3 9-6 14-2 10 4 22-4" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
        </svg>
      </div>
    );
  if (kind === 2)
    // the system being built, a little more each week
    return (
      <div data-scene className={`${card} p-2.5`}>
        <div className="flex items-center gap-1 pb-2" aria-hidden>
          <span className="size-1.5 rounded-full bg-[#16303a]/20" />
          <span className="size-1.5 rounded-full bg-[#16303a]/20" />
          <span className="size-1.5 rounded-full bg-[#16303a]/20" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <span data-blk className="col-span-3 h-4 origin-bottom rounded-md bg-[#1f4e5f]" />
          <span data-blk className="row-span-2 h-[46px] origin-bottom rounded-md bg-[#cfe0e6]" />
          <span data-blk className="col-span-2 h-5 origin-bottom rounded-md bg-[#16303a]/12" />
          <span data-blk className="h-[22px] origin-bottom rounded-md bg-[#16303a]/12" />
          <span data-blk className="h-[22px] origin-bottom rounded-md bg-[#c2603f]/80" />
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((w) => (
            <span key={w} className="h-1.5 overflow-hidden rounded-full bg-[#16303a]/12">
              <span data-week className="block h-full w-full origin-[left] scale-x-0 rounded-full bg-[#c2603f] rtl:origin-[right]" />
            </span>
          ))}
        </div>
      </div>
    );
  // delivered, working, with two free months on the calendar
  return (
    <div data-scene className={`${card} flex items-center gap-3`}>
      <svg viewBox="0 0 48 48" className="size-14 shrink-0 text-[#c2603f]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle data-ring cx="24" cy="24" r="20" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
        <path data-check d="M15 24.5 21.5 31 33 18" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
      </svg>
      <div className="grid flex-1 grid-cols-4 gap-1">
        {Array.from({ length: 8 }, (_, m) => (
          <span key={m} data-month className={`h-4 rounded-sm ${m < 2 ? "bg-[#c2603f]" : "bg-[#16303a]/12"}`} />
        ))}
      </div>
    </div>
  );
}

/** One paused timeline per chapter; it plays once, when the pen reaches the chapter. */
function buildScene(li: HTMLElement) {
  const t = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  const scene = li.querySelector<HTMLElement>("[data-scene]");
  if (!scene) return t;
  t.fromTo(scene, { opacity: 0, y: 16, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
  const sp = scene.querySelectorAll("[data-sp]");
  if (sp.length) t.fromTo(sp, { opacity: 0, y: 10, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.32, ease: "back.out(1.6)" }, 0.15);
  const ticks = scene.querySelectorAll("[data-tick]");
  if (ticks.length) t.to(ticks, { strokeDashoffset: 0, duration: 0.3, stagger: 0.32, ease: "power2.out" }, 0.45);
  const sign = scene.querySelector("[data-sign]");
  if (sign) t.to(sign, { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, ">-0.05");
  const blk = scene.querySelectorAll("[data-blk]");
  if (blk.length) t.fromTo(blk, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.4, stagger: 0.18 }, 0.2);
  const weeks = scene.querySelectorAll("[data-week]");
  if (weeks.length) t.to(weeks, { scaleX: 1, duration: 0.35, stagger: 0.28, ease: "power1.inOut" }, 0.3);
  const ring = scene.querySelector("[data-ring]");
  if (ring) t.to(ring, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.15);
  const check = scene.querySelector("[data-check]");
  if (check) t.to(check, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, ">-0.1");
  const months = scene.querySelectorAll("[data-month]");
  if (months.length) t.fromTo(months, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05 }, 0.5);
  // until the pen arrives, the scene waits hidden
  gsap.set(scene, { opacity: 0 });
  return t;
}
