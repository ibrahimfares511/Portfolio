import { SITE_URL, OG_LOCALE } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Alexandria, Nunito } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, directionOf } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/brand/Preloader";
import { InlineScript } from "@/components/brand/InlineScript";
import { MOTION_ENGINE_SCRIPT } from "@/lib/motion-engine";
import "../globals.css";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["400", "500"],
  variable: "--font-alexandria",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const lang = locale === "en" ? "en" : "ar";
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: t("title"),
    authors: [
      { name: lang === "ar" ? "إبراهيم فارس" : "Ibrahim Fares", url: SITE_URL },
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === "ar" ? "en" : "ar"],
      images: [
        {
          url: `/og/home-${lang}.jpg`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`/og/home-${lang}.jpg`],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EFE9" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1B21" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html
      lang={locale}
      dir={directionOf(locale)}
      className={`${alexandria.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript
          id="if-motion"
          code={MOTION_ENGINE_SCRIPT}
          ready="__ifMotion"
        />
        <noscript>
          <style>{`#preloader{display:none!important}[data-reveal]{opacity:1!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <Preloader />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
          >
            {t("skip")}
          </a>
          <div className="brand-backdrop" aria-hidden />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
