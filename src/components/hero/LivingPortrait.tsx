"use client";

import { useEffect, useRef } from "react";
import { startLivingPortrait } from "./living-portrait";

// Kept next to the component (React hoists and dedupes it via href/precedence).
const CSS = `
/* Hero: the living portrait. The canvas reaches 35% past the picture on every side so the
   skin can stretch, and fades out at the same line as the picture's bottom edge. */
.living-portrait { position: relative; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
.living-portrait img { display: block; width: 100%; height: auto; -webkit-user-drag: none; mask-image: linear-gradient(to bottom, #000 80%, transparent 97%); }
.living-portrait canvas {
  position: absolute; left: -35%; top: -35%; width: 170%; height: 170%; pointer-events: none;
  /* 80% / 97% of the picture, in canvas space: (p + 35) / 170 */
  mask-image: linear-gradient(to bottom, #000 67.6%, transparent 77.6%);
}
.living-portrait .lp-props { position: absolute; inset: 0; pointer-events: none; }
.lp-fly, .lp-hand { position: absolute; opacity: 0; transition: opacity .2s; transform: translate(-50%, -50%); }
.lp-fly { width: 6%; fill: #111; }
.lp-fly .wing { fill: rgba(220, 235, 255, .7); transform-origin: 16px 15px; animation: lp-flap .05s linear infinite alternate; }
.lp-fly .wing.r { animation-direction: alternate-reverse; }
@keyframes lp-flap { from { transform: rotate(-16deg); } to { transform: rotate(16deg); } }
.lp-hand { width: 11%; fill: #fff; stroke: #0c0c0c; stroke-width: 1.4; stroke-linejoin: round; }
.lp-hand .grab { display: none; }
.lp-hand.shut .open { display: none; }
.lp-hand.shut .grab { display: block; }
`;

/**
 * The hero character: his face on a soft WebGL sheet. Eyes follow the cursor, he blinks,
 * reacts to hover / taps / pulls, falls in love with the contact links and plays on his own
 * when the page goes quiet. Until WebGL has drawn, the plain resting picture shows.
 */
export function LivingPortrait({ alt, className = "" }: { alt: string; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLImageElement>(null);
  const fly = useRef<SVGSVGElement>(null);
  const hand = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!wrap.current || !canvas.current || !fallback.current || !fly.current || !hand.current) return;
    return startLivingPortrait({
      wrap: wrap.current,
      canvas: canvas.current,
      fallback: fallback.current,
      fly: fly.current,
      hand: hand.current,
    });
  }, []);

  return (
    <div ref={wrap} className={`living-portrait ${className}`}>
      <style href="living-portrait" precedence="default">{CSS}</style>
      {/* eslint-disable-next-line @next/next/no-img-element -- plain fallback frame, swapped for the canvas */}
      <img ref={fallback} src="/avatar/face/rest.webp" width={1024} height={1024} alt={alt} draggable={false} fetchPriority="high" decoding="async" />
      <canvas ref={canvas} aria-hidden />
      <div className="lp-props" aria-hidden>
        <svg ref={fly} className="lp-fly" viewBox="0 0 32 32">
          <path className="wing" d="M15 15C12 9.500 4.500 8.500 2 13c2.500 4.500 10 4.500 13 2z" />
          <path className="wing r" d="M17 15c3-5.500 10.500-6.500 13-2-2.500 4.500-10 4.500-13 2z" />
          <ellipse cx="16" cy="19.500" rx="4" ry="6.500" />
          <circle cx="16" cy="11.500" r="3.300" />
        </svg>
        <svg ref={hand} className="lp-hand" viewBox="0 0 32 32">
          <path className="open" d="M10.500 16.500V8.200a1.800 1.800 0 0 1 3.600 0V14v-8a1.800 1.800 0 0 1 3.600 0V14 7a1.800 1.800 0 0 1 3.600 0v8-5a1.800 1.800 0 0 1 3.600 0v10.500c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-3.500-5.600c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.600 1z" />
          <path className="grab" d="M10.500 17v-3.300a1.800 1.800 0 0 1 3.600 0V14v-1.800a1.800 1.800 0 0 1 3.600 0V14v-1.300a1.800 1.800 0 0 1 3.600 0V14v-.3a1.800 1.800 0 0 1 3.600 0v6.800c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-2.300-3.700c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.700 1z" />
        </svg>
      </div>
    </div>
  );
}
