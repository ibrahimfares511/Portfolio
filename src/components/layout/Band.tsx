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
  track,
  project,
  children,
}: {
  tone?: Tone;
  label: string;
  /** overrides the one-screen band height (the last band shares its screen with the footer) */
  minHeight?: string;
  /** visitor stats: the event sent once when this band reaches the middle of the screen */
  track?: string;
  /** visitor stats: the case study this band belongs to */
  project?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-band=""
      data-tone={tone}
      data-label={label}
      data-track-view={track}
      data-track-project={track ? project : undefined}
      style={minHeight ? { minHeight } : undefined}
    >
      {children}
    </div>
  );
}
