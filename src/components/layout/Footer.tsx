import { getLocale, getTranslations } from "next-intl/server";
import { LogoLockup } from "@/components/brand/Logo";
import { NAV_ITEMS } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";

const WHATSAPP = "https://wa.me/201007218535";
const EMAIL = "mailto:ibrahimfares511@gmail.com";
const GITHUB = "https://github.com/ibrahimfares511";
const LINKEDIN = "https://www.linkedin.com/in/ibrahimfares511";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const tf = await getTranslations("footer");
  const tc = await getTranslations("contact");
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

        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
          <li>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-ink">
              <span className="text-ink-muted">{tf("whatsapp")}</span>
              <span className="num font-latin text-petrol group-hover:underline">{tc("whatsapp")}</span>
            </a>
          </li>
          <li>
            <a href={EMAIL} className="group inline-flex items-center gap-2 text-ink">
              <span className="text-ink-muted">{tf("email")}</span>
              <span className="font-latin text-petrol group-hover:underline" dir="ltr">
                {tc("email")}
              </span>
            </a>
          </li>
          <li className="flex items-center gap-2">
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:text-ink">
              <svg viewBox="0 0 16 16" className="size-[18px]" fill="currentColor" aria-hidden>
                <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
              </svg>
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:text-ink">
              <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </a>
          </li>
        </ul>

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
