"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

/**
 * What visitors do, sent to Umami as events (no cookies, nothing personal).
 *
 * Clicks: any element with data-track="name" sends that event when clicked; its
 * data-track-* attributes become the event's properties
 * (data-track="open-project" data-track-project="wms" → open-project {project: wms}).
 * Our own listener, not Umami's data-umami-event: Umami reloads the page on
 * tracked links, which would undo the brand cover transitions.
 *
 * Sections: an element with data-track-view="name" sends that event once per
 * page view, when it reaches the middle of the screen (how far people read).
 */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-track]");
      if (!el) return;
      const props: Record<string, string> = {};
      for (const [k, v] of Object.entries(el.dataset)) {
        if (k.startsWith("track") && k !== "track" && k !== "trackView" && v) props[k.slice(5).toLowerCase()] = v;
      }
      track(el.dataset.track!, Object.keys(props).length ? props : undefined);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const el = en.target as HTMLElement;
          const name = el.dataset.trackView!;
          io.unobserve(el);
          if (seen.has(name)) continue;
          seen.add(name);
          const project = el.dataset.trackProject;
          track(name, project ? { project } : undefined);
        }
      },
      // a thin line across the middle of the screen: tall bands count too
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    // the new page renders under the cover: look a moment later, then once more
    const scan = () => document.querySelectorAll<HTMLElement>("[data-track-view]").forEach((el) => io.observe(el));
    const t1 = window.setTimeout(scan, 300);
    const t2 = window.setTimeout(scan, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
