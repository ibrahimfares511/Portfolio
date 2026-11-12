import type { ReactNode } from "react";

export type Tone = "sky" | "petrol" | "clay";

/**
 * A full-width band around one home-page section. The tone re-maps the brand
 * colours inside it (globals.css), `grid` adds squared paper, and `label`
 * names the band in the side navigation.
 */
export function Band({
  tone,
  grid,
  label,
  children,
}: {
  tone?: Tone;
  grid?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <div data-band="" data-tone={tone} data-grid={grid ? "" : undefined} data-label={label}>
      {children}
    </div>
  );
}
