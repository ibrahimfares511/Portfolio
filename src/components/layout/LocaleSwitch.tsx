"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("switch");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      lang={other}
      aria-label={t("languageLabel")}
      className={`inline-flex h-10 items-center rounded-full border border-line bg-surface/60 px-4 text-sm font-medium text-ink transition-colors hover:border-petrol/40 hover:text-petrol ${
        other === "ar" ? "font-arabic" : "font-latin"
      } ${className}`}
    >
      {t("language")}
    </Link>
  );
}
