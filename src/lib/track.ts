/**
 * Visitor events for Umami (analytics.ibrahimfares.dev). Safe to call any time:
 * events sent before the tracker script has loaded wait in a small queue.
 */
type Props = Record<string, string>;
type Umami = { track: (name: string, data?: Props) => unknown };

declare global {
  interface Window {
    umami?: Umami;
  }
}

const queue: [string, Props | undefined][] = [];
let waiting = 0;

function flush() {
  const u = typeof window !== "undefined" ? window.umami : undefined;
  if (!u) return false;
  while (queue.length) {
    const [n, d] = queue.shift()!;
    try { u.track(n, d); } catch {}
  }
  return true;
}

export function track(name: string, data?: Props) {
  if (typeof window === "undefined") return;
  queue.push([name, data]);
  if (flush() || waiting) return;
  // the tracker loads after the page is interactive: try again for up to 15 seconds
  let tries = 0;
  waiting = window.setInterval(() => {
    if (flush() || ++tries > 30) { clearInterval(waiting); waiting = 0; }
  }, 500);
}
