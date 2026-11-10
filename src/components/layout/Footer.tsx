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

  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <a href={home} className="text-ink" aria-label={tm("title")}>
            <LogoLockup height={34} />
          </a>

          <nav aria-label={t("primary")}>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a href={`${home}#${item.hash}`} className="text-ink-muted transition-colors hover:text-ink">
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <SocialLinks className="mt-10" />

        <div className="mt-10 flex flex-col-reverse gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">{tf("rights")}</p>
          <div className="flex items-center gap-2">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
