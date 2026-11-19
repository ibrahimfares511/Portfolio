import { getLocale, getTranslations } from "next-intl/server";
import { LogoLockup } from "@/components/brand/Logo";
import { NAV_ITEMS } from "@/lib/nav";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";


export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const tf = await getTranslations("footer");
  const tm = await getTranslations("meta");
  const home = `/${locale}`;

  // Desktop: one compact band (136px) so the contact panel and the footer share the last screen.
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:flex lg:h-[136px] lg:flex-col lg:justify-center lg:gap-4 lg:py-0">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between lg:gap-6">
          <a href={home} className="text-ink" aria-label={tm("title")}>
            <LogoLockup height={30} />
          </a>

          {/* The header already has the primary <nav>; one landmark per name. */}
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-8 lg:gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <a href={`${home}#${item.hash}`} className="text-[15px] text-ink-muted transition-colors hover:text-ink">
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>

          <div className="lg:hidden">
            <SocialLinks />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-0 lg:border-t-0 lg:pt-0">
          <p className="text-sm text-ink-muted">{tf("rights")}</p>
          <div className="flex items-center gap-2 lg:hidden">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
          <div className="hidden lg:block">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
