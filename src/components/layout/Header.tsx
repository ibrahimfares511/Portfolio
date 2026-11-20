"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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

  // Mobile menu: it opens as a circle growing from the menu button (the brand's cover move),
  // then the links write themselves in out of a blur, one after another; closing runs it back.
  const panel = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const first = useRef(true);
  useEffect(() => {
    const el = panel.current, b = btn.current;
    if (!el || !b) return;
    if (first.current) { first.current = false; return; } // closed on load: nothing to play
    const items = el.querySelectorAll("[data-mi]");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const br = b.getBoundingClientRect(), pr = el.getBoundingClientRect();
    const cx = br.left + br.width / 2 - pr.left, cy = br.top + br.height / 2 - pr.top;
    const R = Math.ceil(Math.max(Math.hypot(cx, cy - pr.height), Math.hypot(cx - pr.width, cy - pr.height), Math.hypot(cx, cy), Math.hypot(cx - pr.width, cy))) + 8;
    const at = (r: number) => `circle(${r}px at ${cx}px ${cy}px)`;
    tl.current?.kill();
    if (still) {
      gsap.set(el, { visibility: open ? "visible" : "hidden", clipPath: "none" });
      gsap.set(items, { opacity: 1, y: 0, filter: "none" });
      return;
    }
    const t = gsap.timeline();
    if (open) {
      t.set(el, { visibility: "visible" })
        .fromTo(el, { clipPath: at(0) }, { clipPath: at(R), duration: 0.7, ease: "power3.inOut" })
        .fromTo(
          items,
          { opacity: 0, y: 18, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.07, ease: "power2.out", clearProps: "filter" },
          0.28,
        );
    } else {
      t.to(items, { opacity: 0, y: -8, filter: "blur(6px)", duration: 0.22, stagger: { each: 0.035, from: "end" }, ease: "power2.in" })
        .to(el, { clipPath: at(0), duration: 0.5, ease: "power3.inOut" }, 0.12)
        .set(el, { visibility: "hidden" });
    }
    tl.current = t;
  }, [open]);

  const home = `/${locale}`;

  return (
    <header
      className={`tone-follow fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-6 px-4 sm:px-6 md:h-[72px] md:grid-cols-[1fr_auto_1fr]">
        <a href={home} className="flex items-center justify-self-start text-ink" aria-label={`${tm("title")} · ${t("home")}`}>
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

        <div className="flex items-center gap-2 justify-self-end">
          <span className="hidden sm:contents">
            <LocaleSwitch />
          </span>
          <ThemeToggle />
          <button
            ref={btn}
            type="button"
            className="relative inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface/60 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {/* two lines that turn into a cross */}
            <span aria-hidden className="relative block h-5 w-5">
              <span
                className={`absolute start-0.5 top-1/2 block h-[1.8px] w-4 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] ${
                  open ? "translate-y-0 rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute start-0.5 top-1/2 block h-[1.8px] rounded-full bg-current transition-[transform,width] duration-500 ease-[cubic-bezier(.65,0,.35,1)] ${
                  open ? "w-4 translate-y-0 -rotate-45" : "w-2.5 translate-y-[4px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu: a full panel under the bar, revealed by a circle from the menu button */}
      <div
        ref={panel}
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        style={{ visibility: "hidden" }}
        className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg px-6 pb-10 pt-6 md:hidden"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_40%_at_100%_0%,var(--sky-soft),transparent_70%),radial-gradient(70%_40%_at_0%_100%,var(--clay-soft),transparent_70%)] opacity-70"
        />
        <nav aria-label={t("primary")} className="relative">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.key} data-mi className="border-b border-line">
                <a
                  href={`${home}#${item.hash}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between py-5 text-h3 font-medium text-ink"
                >
                  <span className="transition-transform duration-300 group-active:translate-x-1 rtl:group-active:-translate-x-1">{t(item.key)}</span>
                  <span className="num font-display text-[15px] text-clay">{String(i + 1).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-mi className="relative mt-8 flex items-center gap-3">
          <LocaleSwitch />
        </div>
      </div>
    </header>
  );
}
