/**
 * Server-rendered preloader: the first thing in <body>, so it covers the page
 * from the very first paint, even on a slow connection. The inline motion
 * engine in <head> (lib/motion-engine.ts) starts it as soon as this markup is
 * parsed, before any JS bundle arrives. Plays on every page load.
 */
const STROKES = [
  "M28 78 V46",
  "M80 18 Q62 18 62 36 V82 Q62 96 48 96 H36",
  "M46 48 H78",
];

export function Preloader() {
  return (
    <div id="preloader" aria-hidden suppressHydrationWarning>
      <svg viewBox="0 0 100 106" className="if-mark" suppressHydrationWarning>
        <g
          fill="none"
          strokeWidth={11}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {STROKES.map((d) => (
            <path
              key={d}
              data-stroke=""
              pathLength={1}
              strokeDasharray="1"
              d={d}
              suppressHydrationWarning
            />
          ))}
        </g>
        <circle data-nib="" r={3.2} cx={28} cy={78} suppressHydrationWarning />
        <circle data-dot="" cx={28} cy={27} r={7.5} suppressHydrationWarning />
      </svg>
    </div>
  );
}
