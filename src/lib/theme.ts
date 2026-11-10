"use client";

import { useSyncExternalStore } from "react";

/**
 * Light / dark theme without a provider. The inline motion engine applies the
 * saved choice to <html data-theme> before the first paint and follows the OS
 * setting while the choice is "system"; React only reads that attribute.
 * (Replaces next-themes, whose inline script would re-render on every
 * language switch.)
 */
export type Theme = "light" | "dark";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => mo.disconnect();
}
const read = () =>
  (document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light") as Theme;

/** The current theme; undefined during server render and hydration. */
export function useResolvedTheme(): Theme | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export function setTheme(theme: Theme | "system") {
  if (window.__ifMotion?.setTheme) window.__ifMotion.setTheme(theme);
  else {
    try {
      localStorage.setItem("theme", theme);
    } catch {}
    document.documentElement.setAttribute(
      "data-theme",
      theme === "system" ? "light" : theme,
    );
  }
}
