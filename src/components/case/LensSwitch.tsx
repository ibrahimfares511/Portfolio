"use client";

import { useEffect, useState, type ReactNode } from "react";

type Lens = "plain" | "technical";

/**
 * The two ways to read a case study: "plain" (the story for clients) and
 * "technical" (role, how it was built, stack, architecture). Both panels are
 * rendered on the server; this only shows one. The choice is kept in the URL
 * (?lens=technical) so a link can open the technical view directly.
 */
export function LensSwitch({
  label,
  names,
  plain,
  technical,
}: {
  label: string;
  names: Record<Lens, string>;
  plain: ReactNode;
  technical: ReactNode;
}) {
  const [lens, setLens] = useState<Lens>("plain");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lens");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the URL after hydration
    if (fromUrl === "technical") setLens("technical");
  }, []);

  const choose = (next: Lens) => {
    setLens(next);
    const url = new URL(window.location.href);
    if (next === "technical") url.searchParams.set("lens", "technical");
    else url.searchParams.delete("lens");
    window.history.replaceState(window.history.state, "", url);
  };

  const keys: Lens[] = ["plain", "technical"];
  return (
    <>
      <div className="sticky top-[72px] z-20 -mx-4 bg-bg/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-full sm:px-0 sm:py-0 sm:bg-transparent sm:backdrop-blur-none lg:top-[84px]">
        <div
          role="tablist"
          aria-label={label}
          className="relative mx-auto grid w-full max-w-[340px] grid-cols-2 rounded-full border border-line bg-surface/90 p-1 shadow-[0_12px_30px_-22px_rgba(22,48,58,0.6)] backdrop-blur-md"
        >
          <span
            aria-hidden
            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-petrol transition-transform duration-300 ease-out start-1 rtl:data-[on=technical]:-translate-x-full ltr:data-[on=technical]:translate-x-full motion-reduce:transition-none"
            data-on={lens}
          />
          {keys.map((k) => (
            <button
              key={k}
              id={`lens-${k}`}
              role="tab"
              type="button"
              aria-selected={lens === k}
              aria-controls={`panel-${k}`}
              onClick={() => choose(k)}
              className={`relative z-10 h-10 rounded-full text-[15px] font-medium transition-colors duration-300 ${
                lens === k ? "text-bg" : "text-ink-muted hover:text-ink"
              }`}
            >
              {names[k]}
            </button>
          ))}
        </div>
      </div>
      <div id="panel-plain" role="tabpanel" aria-labelledby="lens-plain" hidden={lens !== "plain"}>
        {plain}
      </div>
      <div id="panel-technical" role="tabpanel" aria-labelledby="lens-technical" hidden={lens !== "technical"}>
        {technical}
      </div>
    </>
  );
}
