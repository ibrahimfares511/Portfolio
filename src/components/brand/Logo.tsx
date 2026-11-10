import { NAME_PATH } from "./lockup-path";

/**
 * The "if" mark. Strokes follow currentColor (ink), the dot is always clay.
 * Paths come from the brand pack (viewBox crop of 0 0 100 106, stroke 11).
 * Below 32px the brand book asks for the "small" variant (thicker strokes).
 */
const MARK = {
  regular: {
    viewBox: "16.5 8.5 73 97",
    stroke: 11,
    i: "M28 78 V46",
    f: "M80 18 Q62 18 62 36 V82 Q62 96 48 96 H36",
    bar: "M46 48 H78",
    dot: { cx: 28, cy: 27, r: 7.5 },
  },
  small: {
    viewBox: "10 4 85 105",
    stroke: 14,
    i: "M24 76 V50",
    f: "M84 15 Q66 15 66 33 V80 Q66 98 50 98 H38",
    bar: "M50 50 H82",
    dot: { cx: 24, cy: 25, r: 10 },
  },
} as const;

export function LogoMark({
  size = 40,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  const m = size < 32 ? MARK.small : MARK.regular;
  const [, , w, h] = m.viewBox.split(" ").map(Number);
  return (
    <svg
      viewBox={m.viewBox}
      height={size}
      width={(size * w) / h}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g fill="none" stroke="currentColor" strokeWidth={m.stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d={m.i} />
        <path d={m.f} />
        <path d={m.bar} />
      </g>
      <circle {...m.dot} fill="var(--clay)" />
    </svg>
  );
}

/** Mark + "ibrahim fares" in IF Pen. Always LTR, it is a drawing. */
export function LogoLockup({ height = 36, className, title }: { height?: number; className?: string; title?: string }) {
  const m = MARK.regular;
  return (
    <svg
      viewBox="16.5 8.5 637.5 97"
      height={height}
      width={(height * 637.5) / 97}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      direction="ltr"
    >
      {title ? <title>{title}</title> : null}
      <g fill="none" stroke="currentColor" strokeWidth={m.stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d={m.i} />
        <path d={m.f} />
        <path d={m.bar} />
      </g>
      <circle {...m.dot} fill="var(--clay)" />
      <path d={NAME_PATH} fill="currentColor" />
    </svg>
  );
}
