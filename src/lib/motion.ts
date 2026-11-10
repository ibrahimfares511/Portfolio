/**
 * React-side helpers around the inline motion engine (motion-engine.ts).
 */
type Colors = { bg: string; ink: string; clay: string; sky: string };

declare global {
  interface Window {
    __ifBusy?: boolean;
    __ifMotion?: {
      preload: () => void;
      transition: (o: { x: number; y: number; colors?: Partial<Colors>; run: () => unknown }) => Promise<boolean>;
      reduce: boolean;
      setTheme: (t: "light" | "dark" | "system") => void;
    };
  }
}

/** Brand colours per theme (same values as globals.css / brand tokens). */
export const THEME_COLORS: Record<"light" | "dark", Colors> = {
  light: { bg: "#F3EFE9", ink: "#16303A", clay: "#C2603F", sky: "#B9D2DA" },
  dark: { bg: "#0D1B21", ink: "#EAF0F0", clay: "#E58A66", sky: "#B9D2DA" },
};

/**
 * Runs cb when the page is uncovered: at once if nothing covers it, otherwise
 * when the preloader or a switch transition starts opening ("if:reveal").
 */
export function onReveal(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (!window.__ifBusy) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("if:reveal", handler, { once: true });
  return () => window.removeEventListener("if:reveal", handler);
}

/** Where the pointer was, or the centre of the element (keyboard). */
export function originOf(e: { clientX: number; clientY: number; currentTarget: Element }) {
  if (e.clientX || e.clientY) return { x: e.clientX, y: e.clientY };
  const r = e.currentTarget.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Covers the page from (x, y), runs the switch underneath, uncovers back to (x, y). */
export function coverSwitch(x: number, y: number, run: () => unknown, colors?: Partial<Colors>) {
  const engine = typeof window !== "undefined" ? window.__ifMotion : undefined;
  if (!engine) return Promise.resolve(run()).then(() => true);
  return engine.transition({ x, y, colors, run });
}

/** Keeps the reader on the same section when the page re-renders in another language. */
export function captureScrollAnchor() {
  const header = 72;
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
  const el = sections.find((s) => s.getBoundingClientRect().bottom > header);
  if (!el) return null;
  return { id: el.id, top: el.getBoundingClientRect().top };
}

export function restoreScrollAnchor(anchor: { id: string; top: number } | null) {
  if (!anchor) return;
  const el = document.getElementById(anchor.id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - anchor.top;
  window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
}

export const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export function waitFor(test: () => boolean, timeout = 6000) {
  return new Promise<void>((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (test() || performance.now() - start > timeout) resolve();
      else requestAnimationFrame(tick);
    };
    tick();
  });
}
