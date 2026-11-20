"use client";

import type { MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { captureScrollAnchor, coverSwitch, nextFrame, originOf, restoreScrollAnchor, waitFor } from "@/lib/motion";

/**
 * Switches language without reloading the page: the cover grows from the
 * pointer, the mark is written while the page re-renders in the other
 * language underneath, and the cover closes back into the pointer. The reader
 * stays on the same section.
 */
export function LocaleSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("switch");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "ar" ? "en" : "ar";

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // new tab etc.
    e.preventDefault();
    const { x, y } = originOf(e);
    void coverSwitch(x, y, async () => {
      const anchor = captureScrollAnchor();
      router.replace(pathname, { locale: other, scroll: false });
      await waitFor(() => document.documentElement.lang === other);
      await nextFrame();
      await nextFrame();
      await document.fonts.ready;
      restoreScrollAnchor(anchor);
    });
  };

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      lang={other}
      scroll={false}
      onClick={onClick}
      data-track="switch-language"
      data-track-to={other}
      aria-label={t("languageLabel")}
      className={`inline-flex h-10 items-center rounded-full border border-line bg-surface/60 px-4 text-sm font-medium text-ink transition-colors hover:border-petrol/40 hover:text-petrol ${
        other === "ar" ? "font-arabic" : "font-latin"
      } ${className}`}
    >
      {t("language")}
    </Link>
  );
}
