"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { onReveal } from "@/lib/motion";

/**
 * The headline, drawn: a clay dot (the idea) above the avatar, then pen lines
 * branch out to small screens, a database, a chart… (the system), and data
 * keeps moving along the lines. No words, so no copy to translate.
 * Reduced motion: the finished drawing, still.
 */

const C = { x: 300, y: 34 }; // the idea

type Node = { x: number; y: number; glyph: "screen" | "db" | "chart" | "users" | "bell" | "list" };
const NODES: Node[] = [
  { x: 76, y: 160, glyph: "screen" },
  { x: 524, y: 160, glyph: "db" },
  { x: 38, y: 340, glyph: "chart" },
  { x: 562, y: 340, glyph: "users" },
  { x: 58, y: 520, glyph: "list" },
  { x: 542, y: 520, glyph: "bell" },
];

/** A curve from the idea to a node, bowing outward so it goes around the avatar. */
function branch(n: Node) {
  const side = n.x < C.x ? -1 : 1;
  const c1x = C.x + side * 140;
  const c1y = C.y + 10;
  const c2x = n.x + side * 10;
  const c2y = n.y - 90;
  return `M${C.x} ${C.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${n.x} ${n.y - 26}`;
}
/** Links between nodes on the same side (the system's own wiring). */
const LINKS = [
  [0, 2],
  [2, 4],
  [1, 3],
  [3, 5],
].map(([a, b]) => `M${NODES[a].x} ${NODES[a].y + 26} L ${NODES[b].x} ${NODES[b].y - 26}`);

function Glyph({ g }: { g: Node["glyph"] }) {
  const s = { stroke: "currentColor", strokeWidth: 2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (g) {
    case "screen":
      return (
        <g {...s}>
          <rect x="-14" y="-10" width="28" height="18" rx="3" />
          <path d="M-6 13 H6" />
        </g>
      );
    case "db":
      return (
        <g {...s}>
          <ellipse cx="0" cy="-8" rx="11" ry="4" />
          <path d="M-11 -8 V8 C -11 13, 11 13, 11 8 V-8" />
          <path d="M-11 0 C -11 5, 11 5, 11 0" />
        </g>
      );
    case "chart":
      return (
        <g {...s}>
          <path d="M-12 10 H12" />
          <path d="M-7 10 V2 M0 10 V-8 M7 10 V-2" />
        </g>
      );
    case "users":
      return (
        <g {...s}>
          <circle cx="-5" cy="-5" r="4.5" />
          <path d="M-13 10 C -13 3, 3 3, 3 10" />
          <circle cx="7" cy="-3" r="3.5" />
          <path d="M5 4 C 9 4, 13 6, 13 10" />
        </g>
      );
    case "bell":
      return (
        <g {...s}>
          <path d="M-9 6 C -7 3, -8 -9, 0 -10 C 8 -9, 7 3, 9 6 Z" />
          <path d="M-3 10 H3" />
        </g>
      );
    case "list":
      return (
        <g {...s}>
          <path d="M-6 -7 H12 M-6 0 H12 M-6 7 H8" />
          <path d="M-12 -7 h0.01 M-12 0 h0.01 M-12 7 h0.01" strokeWidth={3} />
        </g>
      );
  }
}

export function HeroSystem() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = (s: string) => svg.querySelectorAll<SVGElement>(s);
    if (reduce) {
      gsap.set(q("[data-sys='idea'], [data-sys='node']"), { opacity: 1 });
      gsap.set(q("[data-sys-line]"), { strokeDashoffset: 0, opacity: 1 });
      return;
    }
    let tl: gsap.core.Timeline | undefined;
    let flow: gsap.core.Tween[] = [];
    const stop = onReveal(() => {
      tl = gsap.timeline({ delay: 0.9, defaults: { ease: "power2.out" } });
      tl.fromTo(q("[data-sys='idea']"), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(3)", transformOrigin: "50% 50%" })
        .fromTo(q("[data-sys='halo']"), { opacity: 0.7, scale: 0.4 }, { opacity: 0, scale: 2.4, duration: 1, transformOrigin: "50% 50%" }, "<0.2")
        .fromTo(q("[data-sys-line='branch']"), { opacity: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: "power2.inOut" }, "<0.1")
        .fromTo(q("[data-sys='node']"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: "back.out(2)", transformOrigin: "50% 50%" }, "-=0.5")
        .fromTo(q("[data-sys-line='link']"), { opacity: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.06 }, "-=0.3")
        .add(() => {
          // Data moving along the branches, forever, gently.
          const paths = Array.from(q("[data-sys-line='branch']")) as SVGPathElement[];
          const dots = Array.from(q("[data-sys='packet']")) as SVGCircleElement[];
          flow = dots.map((dot, i) => {
            const path = paths[i % paths.length];
            const len = path.getTotalLength();
            const o = { t: 0 };
            return gsap.to(o, {
              t: 1,
              duration: 2.4 + (i % 3) * 0.5,
              delay: i * 0.55,
              repeat: -1,
              repeatDelay: 1.4,
              ease: "power1.inOut",
              onStart: () => gsap.set(dot, { opacity: 1 }),
              onUpdate: () => {
                const p = path.getPointAtLength(o.t * len);
                dot.setAttribute("cx", String(p.x));
                dot.setAttribute("cy", String(p.y));
                dot.style.opacity = String(Math.sin(o.t * Math.PI));
              },
            });
          });
        });
    });
    // Pause the flow when the hero is off screen.
    const io = new IntersectionObserver(([e]) => flow.forEach((f) => (e.isIntersecting ? f.resume() : f.pause())));
    io.observe(svg);
    return () => {
      stop();
      io.disconnect();
      tl?.kill();
      flow.forEach((f) => f.kill());
    };
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 600 620"
      className="pointer-events-none absolute bottom-0 left-1/2 h-[106%] w-auto max-w-none -translate-x-1/2 text-petrol md:bottom-[4%] md:h-auto md:w-[128%] md:max-w-[640px]"
      fill="none"
    >
      {LINKS.map((d, i) => (
        <path key={`l${i}`} data-sys-line="link" d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0 }} />
      ))}
      {NODES.map((n, i) => (
        <path key={`b${i}`} data-sys-line="branch" d={branch(n)} pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" style={{ opacity: 0 }} />
      ))}
      {NODES.map((n, i) => (
        <g key={`n${i}`} data-sys="node" transform={`translate(${n.x} ${n.y})`} style={{ opacity: 0 }}>
          <rect x="-30" y="-26" width="60" height="52" rx="14" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
          <Glyph g={n.glyph} />
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={`p${i}`} data-sys="packet" r="3.5" fill="var(--clay)" cx={C.x} cy={C.y} style={{ opacity: 0 }} />
      ))}
      <circle data-sys="halo" cx={C.x} cy={C.y} r="13" stroke="var(--clay)" strokeWidth="2" style={{ opacity: 0 }} />
      <circle data-sys="idea" cx={C.x} cy={C.y} r="11" fill="var(--clay)" style={{ opacity: 0 }} />
    </svg>
  );
}
