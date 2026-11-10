"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { coverSwitch, originOf, THEME_COLORS } from "@/lib/motion";
import { setTheme, useResolvedTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("switch");
  const theme = useResolvedTheme();
  const isDark = theme === "dark";

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    // The cover is painted in the new theme's colours, so the two themes
    // blend through the brand moment instead of flashing.
    const next = isDark ? "light" : "dark";
    const { x, y } = originOf(e);
    void coverSwitch(x, y, () => setTheme(next), THEME_COLORS[next]);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("theme")}
      title={isDark ? t("light") : t("dark")}
      className={`inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface/60 text-ink transition-colors hover:border-petrol/40 hover:text-petrol ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        {isDark ? (
          // sun: shown in dark mode, switches to light
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
          </>
        ) : (
          // moon
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        )}
      </svg>
    </button>
  );
}
