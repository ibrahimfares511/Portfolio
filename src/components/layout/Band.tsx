import type { ReactNode } from "react";

export type Tone = "sky" | "petrol" | "clay";

/**
 * A full-width band around one home-page section. The tone re-maps the brand
 * colours inside it (globals.css), and `label` names the band in the side
 * indicator.
 */
export function Band({
  tone,
  label,
  minHeight,
  children,
}: {
  tone?: Tone;
  label: string;
  /** overrides the one-screen band height (the last band shares its screen with the footer) */
  minHeight?: string;
  children: ReactNode;
}) {
  return (
    <div data-band="" data-tone={tone} data-label={label} style={minHeight ? { minHeight } : undefined}>
      {children}
    </div>
  );
}
