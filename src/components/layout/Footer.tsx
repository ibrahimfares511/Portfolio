import { getLocale, getTranslations } from "next-intl/server";
import { LogoLockup } from "@/components/brand/Logo";

/**
 * A quiet close: the full logo and the copyright line, nothing else.
 * (Navigation lives in the header; WhatsApp, email, GitHub and LinkedIn in Contact.)
 * Desktop: one compact band (96px) so the contact panel and the footer share the last screen.
 */
export async function Footer() {
  const locale = await getLocale();
  const tf = await getTranslations("footer");
  const tm = await getTranslations("meta");

  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:h-[96px] lg:py-0">
        <a href={`/${locale}`} className="text-ink" aria-label={tm("title")}>
          <LogoLockup height={30} />
        </a>
        <p className="text-sm text-ink-muted">{tf("rights")}</p>
      </div>
    </footer>
  );
}
