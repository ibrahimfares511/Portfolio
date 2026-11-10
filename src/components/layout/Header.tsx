"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/Logo";
import { NAV_ITEMS } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";

export function Header() {
  const t = useTranslations("nav");
  const tm = useTranslations("meta");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const home = `/${locale}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 md:h-[72px]">
        <a href={home} className="flex items-center text-ink" aria-label={`${tm("title")} · ${t("home")}`}>
          <LogoMark size={36} />
        </a>

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <a
                  href={`${home}#${item.hash}`}
                  className="rounded-full px-4 py-2 text-[15px] text-ink-muted transition-colors hover:text-ink"
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:contents">
            <LocaleSwitch />
          </span>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface/60 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h10" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg px-6 pb-10 pt-6 md:hidden"
      >
        <nav aria-label={t("primary")}>
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.key} className="border-b border-line">
                <a
                  href={`${home}#${item.hash}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-5 text-h3 font-medium text-ink"
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex items-center gap-3">
          <LocaleSwitch />
        </div>
      </div>
    </header>
  );
}
