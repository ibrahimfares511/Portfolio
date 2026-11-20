import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL, OG_LOCALE } from "@/lib/site";
import { projects, projectBySlug, srcSets, type Project } from "@/lib/projects";
import { loadProjectPage } from "@/lib/project-page";
import { splitSections, statusParts, techBody, featureItems, isYear, plainText } from "@/lib/case-page";
import { floatCard } from "@/lib/ui-classes";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/ui/Words";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountUp } from "@/components/ui/CountUp";
import { Band } from "@/components/layout/Band";
import { SectionPager } from "@/components/layout/SectionPager";
import { Contact } from "@/components/sections/Contact";
import { InViewVideo } from "@/components/projects/InViewVideo";
import { DesktopShots } from "@/components/case/DesktopShots";
import { MobileShots } from "@/components/case/MobileShots";
import { VideoTheater } from "@/components/case/VideoTheater";
import { MediaReveal } from "@/components/case/MediaReveal";
import { ProjectLink } from "@/components/case/NextProject";
import { JsonLd, PERSON_ID } from "@/components/seo/JsonLd";
import { TOOL_LOGOS } from "@/components/tools/logos";

type Lang = "ar" | "en";
type Params = { locale: string; slug: string };

export const dynamicParams = false;

/** Stack names in project.json ("React 18", "MUI", "Express 5") → a logo from the Tools section, when there is one. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+\d+(\.\d+)*$/, "")
    .replace(/[^a-z0-9]/g, "");
const ALIAS: Record<string, string> = {
  mui: "materialui",
  firebasecloudmessaging: "firebase",
  reactbootstrap: "bootstrap",
};
const LOGO_BY_NAME = new Map(
  Object.entries(TOOL_LOGOS).map(([k, v]) => [norm(k), v.logo]),
);
const logoFor = (name: string) =>
  LOGO_BY_NAME.get(ALIAS[norm(name)] ?? norm(name));

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  const lang: Lang = locale === "en" ? "en" : "ar";
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = `${p.name[lang]} · ${t("siteName")}`;
  // Branded social card (logo, project name, line, address) from scripts/og/render-projects.py
  const images = [{ url: `${SITE_URL}/og/projects/${slug}-${lang}.jpg`, width: 1200, height: 630, alt: p.title[lang] }];
  return {
    title,
    description: p.summary[lang],
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        ar: `/ar/projects/${slug}`,
        en: `/en/projects/${slug}`,
        "x-default": `/ar/projects/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      url: `/${locale}/projects/${slug}`,
      siteName: t("siteName"),
      title,
      description: p.summary[lang],
      locale: OG_LOCALE[lang],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.summary[lang],
      images: images.map((i) => i.url),
    },
  };
}

const CSS = `
@keyframes dv-cap { from { opacity: 0; filter: blur(8px); transform: translateY(10px) } to { opacity: 1; filter: blur(0); transform: none } }
.dv-cap { animation: dv-cap .6s cubic-bezier(.2,.8,.2,1) both }
.cs-paper {
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
}
@media (prefers-reduced-motion: reduce) { .dv-cap { animation: none } }
`;

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const pad = "py-20 md:py-28";
const two = (n: number) => String(n).padStart(2, "0");

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-4 rtl:-scale-x-100 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/** A big number from results: counts up, except years. */
function Stat({ value }: { value: string }) {
  return isYear(value) ? <span dir="ltr">{value}</span> : <CountUp value={value} />;
}

/** The same browser-window frame on the brand gradient as "Selected work". */
function ScreenFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[26px] bg-[radial-gradient(110%_90%_at_10%_0%,var(--sky-soft),transparent_62%),radial-gradient(90%_80%_at_100%_100%,var(--clay-soft),transparent_66%)] p-2.5 ring-1 ring-line sm:p-4 lg:p-5">
      <div className="overflow-hidden rounded-xl border border-line/70 bg-surface shadow-[0_40px_80px_-40px_rgba(22,48,58,0.6)] dark:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]" dir="ltr">
        <div className="flex h-8 items-center gap-1.5 border-b border-line bg-bg/70 px-3" aria-hidden>
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </div>
        {children}
      </div>
    </div>
  );
}

/** A small uppercase label above a block. */
function Kicker({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <p data-reveal="text" className={`flex items-center gap-2 text-[13px] font-medium tracking-[0.06em] uppercase ${accent ? "text-clay" : "text-ink-muted"}`}>
      {accent ? <span className="size-1.5 rounded-full bg-clay" aria-hidden /> : null}
      {children}
    </p>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang: Lang = locale === "en" ? "en" : "ar";
  const isAr = lang === "ar";
  const p = projectBySlug(slug);
  const page = loadProjectPage(slug);
  if (!p || !page) notFound();

  const t = await getTranslations("caseStudy");
  const tp = await getTranslations("projects");
  const ts = await getTranslations("sections");
  const to = await getTranslations("otherWork");

  const cs = page.caseStudy[lang];
  const parts = splitSections(cs.sections);
  const status = parts.status ? statusParts(parts.status.html) : { body: "", note: null };
  const featureSec = cs.sections.filter((s) => s.kind === "plain")[2];
  const features = featureSec ? featureItems(featureSec.html) : [];
  const shots = page.shots.filter((s) => !s.lang || s.lang === lang);
  const desktopShots = shots.filter((s) => s.device === "desktop");
  const mobileShots = shots.filter((s) => s.device === "mobile");
  const videos = page.videos.filter((v) => !v.lang || v.lang === lang);
  const results = page.results.filter((r) => r.verified !== false);
  const home = `/${lang}`;
  const live = p.status === "live";
  const statusText = p.tier === "other" ? to("delivered") : tp(`status.${p.status}`);
  const i = projects.findIndex((x) => x.slug === slug);
  const next: Project = projects[(i + 1) % projects.length];
  const related = [
    ...(p.partOf ? [{ slug: p.partOf.slug, text: p.partOf.relation[lang] }] : []),
    ...p.related.map((r) => ({ slug: r.slug, text: r.relation[lang] })),
    ...projects.filter((x) => x.partOf?.slug === slug).map((x) => ({ slug: x.slug, text: x.partOf!.tag[lang] })),
  ].filter((r, k, all) => r.slug !== next.slug && all.findIndex((x) => x.slug === r.slug) === k);
  const shotStrings = { close: t("close"), prev: t("prev"), next: t("nextShot"), open: t("open") };

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: p.name[lang],
        headline: cs.title,
        description: p.summary[lang],
        url: `${SITE_URL}/${lang}/projects/${slug}`,
        inLanguage: lang,
        image: `${SITE_URL}/og/projects/${slug}-${lang}.jpg`,
        keywords: page.stack.join(", "),
        creator: { "@type": "Person", "@id": PERSON_ID, name: isAr ? "إبراهيم فارس" : "Ibrahim Fares" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("back"), item: `${SITE_URL}/${lang}` },
          { "@type": "ListItem", position: 2, name: p.name[lang], item: `${SITE_URL}/${lang}/projects/${slug}` },
        ],
      },
    ],
  };

  const titleCls = isAr
    ? "text-[36px] leading-[56px] font-medium text-balance md:text-[50px] md:leading-[76px]"
    : "font-latin text-[38px] leading-[44px] font-bold tracking-[-0.025em] text-balance md:text-[56px] md:leading-[62px]";
  const bigText = isAr
    ? "text-[20px] leading-[36px] font-medium md:text-[24px] md:leading-[42px]"
    : "font-latin text-[20px] leading-[31px] font-semibold tracking-[-0.01em] md:text-[24px] md:leading-[35px]";
  const bodyText = isAr ? "text-[17px] leading-[32px] md:text-[18px] md:leading-[34px]" : "font-latin text-[17px] leading-[29px] md:text-[18px] md:leading-[31px]";
  const nextCover = srcSets(next.media.cover);
  const statCols = results.length >= 5 || results.length === 3 ? "md:grid-cols-3" : results.length === 2 ? "md:grid-cols-2" : "md:grid-cols-4";

  return (
    <>
      <style href="case-study" precedence="default">{CSS}</style>
      <JsonLd data={ld} />

      {/* 1. Hero: the story in two lines and the project's own video; the numbers under it */}
      <Band label={p.name[lang]} track="case-top" project={p.slug}>
        <section className={`${wrap} pt-28 pb-16 md:pt-36 md:pb-24`}>
          <div className="grid grid-cols-1 items-center gap-12 lg:min-h-[calc(100dvh-330px)] lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5" wordStagger={0.025}>
              <a data-reveal="text" href={`${home}#projects`} className="inline-flex items-center gap-2 text-[14px] text-ink-muted transition-colors hover:text-petrol">
                <Arrow className="rotate-180" />
                {t("back")}
              </a>
              {p.partOf ? (
                <div data-reveal="text" className="mt-6">
                  <ProjectLink slug={p.partOf.slug} className="inline-flex items-center rounded-full bg-sky-soft/70 px-3 py-1 text-[13px] text-petrol hover:bg-sky-soft">
                    {p.partOf.tag[lang]}
                  </ProjectLink>
                </div>
              ) : null}
              <h1 className={`mt-5 ${titleCls}`}>
                <Words text={cs.title} />
              </h1>
              <p className={`mt-5 text-ink-muted ${bodyText}`}>
                <Words text={cs.lead} />
              </p>
              <div data-reveal="text" className="mt-7 border-s-2 border-clay ps-4">
                <p className="text-[12px] leading-[18px] font-medium tracking-[0.06em] text-ink-muted uppercase">{t("role")}</p>
                <p className="mt-0.5 text-[16px] leading-[26px] font-medium text-ink">{p.card.role[lang]}</p>
              </div>
              <div data-reveal="text" className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                {p.links.live ? (
                  <a href={p.links.live} target="_blank" rel="noopener" data-track="visit-live-site" data-track-project={p.slug} className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-[15px] font-medium text-bg transition-[filter] hover:brightness-110">
                    {t("visit")}
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </a>
                ) : null}
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-[13px] text-ink-muted">
                  <span className={`relative size-2 rounded-full ${live ? "bg-petrol" : "bg-ink-muted/50"}`} aria-hidden>
                    {live ? <span className="absolute inset-0 animate-ping rounded-full bg-petrol/60" /> : null}
                  </span>
                  {statusText}
                  <span className="text-line" aria-hidden>·</span>
                  <span className="num">{p.year}</span>
                </span>
                <a href="#inside" className="group inline-flex items-center gap-1.5 text-[14px] text-ink-muted transition-colors hover:text-petrol">
                  {t("forDevs")}
                  <svg viewBox="0 0 16 16" className="size-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                    <path d="M8 3v10M4 9l4 4 4-4" />
                  </svg>
                </a>
              </div>
            </Reveal>

            <MediaReveal className="lg:col-span-7" delay={0.25}>
              <ScreenFrame>
                <InViewVideo mp4={p.media.loop.mp4} webm={p.media.loop.webm} poster={p.media.loop.poster} label={p.title[lang]} />
              </ScreenFrame>
            </MediaReveal>
          </div>

          {/* The numbers: one clear strip */}
          {results.length ? (
            <Reveal className={`mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[26px] bg-[#B9D2DA]/25 md:mt-20 ${statCols} text-bg dark:bg-line dark:text-ink`}>
              {results.map((r, k) => (
                <div key={k} data-reveal="text" className="bg-petrol px-5 py-7 md:px-8 md:py-9 dark:bg-surface">
                  <p className="num w-fit font-display text-[36px] leading-[42px] text-[#B9D2DA] sm:text-[44px] sm:leading-[48px] md:text-[60px] md:leading-[64px] dark:text-petrol">
                    <Stat value={r.value} />
                  </p>
                  <p className="mt-2 text-[14px] leading-[22px] opacity-80 md:text-[15px]">{r.label[lang]}</p>
                </div>
              ))}
            </Reveal>
          ) : null}
        </section>
      </Band>

      {/* 2. Before → after */}
      <Band label={t("beforeAfter")} track="case-before-after" project={p.slug} tone="sky">
        <section className={`${wrap} ${pad}`} aria-labelledby="before-after">
          <Reveal>
            <SectionHeading id="before-after" locale={lang} title={t("beforeAfter")} />
          </Reveal>
          <Reveal className="mt-12 grid grid-cols-1 items-stretch gap-4 lg:mt-14 lg:grid-cols-[1fr_96px_1fr] lg:gap-0" wordStagger={0.018}>
            <div className="rounded-[22px] border border-line bg-surface/50 p-7 md:p-9">
              <Kicker>{t("before")}</Kicker>
              <p className={`mt-4 text-ink-muted ${bodyText}`}>
                <Words text={page.problem[lang]} />
              </p>
            </div>
            <div className="grid place-items-center py-1 lg:py-0" aria-hidden>
              <svg viewBox="0 0 96 40" className="h-8 w-20 rotate-90 text-clay lg:h-10 lg:w-24 lg:rotate-0 rtl:lg:-scale-x-100" fill="none">
                <path data-reveal="pen" d="M4 24 C 26 8, 52 34, 86 18" pathLength={100} strokeDasharray="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path data-reveal="pen" d="M76 10 L 88 17 L 78 28" pathLength={100} strokeDasharray="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={`${floatCard} p-7 md:p-9`}>
              <Kicker accent>{t("after")}</Kicker>
              <p className={`mt-4 text-ink ${bigText}`}>
                <Words text={page.solution[lang]} />
              </p>
            </div>
          </Reveal>
        </section>
      </Band>

      {/* 3. Key features */}
      <Band label={t("features")} track="case-features" project={p.slug}>
        <section className={`${wrap} ${pad}`} aria-labelledby="features">
          <Reveal>
            <SectionHeading id="features" locale={lang} title={t("features")} />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, k) => (
              <Reveal key={k} className="border-t border-line pt-6" wordStagger={0.012}>
                <span data-reveal="text" className="num block w-fit font-display text-[34px] leading-none text-clay">{two(k + 1)}</span>
                {f.title ? (
                  <p className="mt-4 text-[19px] leading-[30px] font-semibold text-ink">
                    <Words text={plainText(f.title)} />
                  </p>
                ) : null}
                <p className={`${f.title ? "mt-2" : "mt-4"} text-[16px] leading-[28px] text-ink-muted`}>
                  <Words text={plainText(f.html)} />
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      </Band>

      {/* 4. The videos: a small theatre, the stage stays while the page scrolls */}
      {videos.length ? (
        <Band label={t("inAction")} track="case-videos" project={p.slug} tone="petrol">
          <VideoTheater
            clips={videos}
            lang={lang}
            heading={
              <Reveal>
                <SectionHeading locale={lang} title={t("inAction")} />
              </Reveal>
            }
          />
        </Band>
      ) : null}

      {/* 5. Desktop screens: one large viewer and the strip of them all */}
      {desktopShots.length ? (
        <Band label={t("screens")} track="case-screens" project={p.slug}>
          <section className={`${wrap} ${pad}`} aria-labelledby="screens">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading id="screens" locale={lang} title={t("screens")} />
              <Kicker>{t("desktop")}</Kicker>
            </Reveal>
            <Reveal className="mt-12">
              <div data-reveal="block">
                <DesktopShots shots={desktopShots} lang={lang} strings={{ ...shotStrings, play: t("play"), pause: t("pause") }} />
              </div>
            </Reveal>
            {status.note ? (
              <Reveal>
                <p data-reveal="text" className="mt-8 text-[14px] leading-[22px] text-ink-muted">{status.note}</p>
              </Reveal>
            ) : null}
          </section>
        </Band>
      ) : null}

      {/* 6. Phone screens: on an arc */}
      {mobileShots.length ? (
        <Band label={t("mobile")} track="case-mobile" project={p.slug} tone="sky">
          <section className={`[overflow-x:clip] ${wrap} ${pad}`} aria-labelledby="mobile-screens">
            <Reveal className="flex flex-col items-center text-center [&_svg]:mx-auto">
              <SectionHeading id="mobile-screens" locale={lang} title={t("mobile")} />
            </Reveal>
            <Reveal className="mt-6">
              <div data-reveal="block">
                <MobileShots shots={mobileShots} lang={lang} strings={shotStrings} />
              </div>
            </Reveal>
          </section>
        </Band>
      ) : null}

      {/* 7. My role, the status, and any extra part of the story (Elite: its admin dashboard) */}
      <Band label={t("myRole")} track="case-role" project={p.slug}>
        <section className={`${wrap} ${pad}`} aria-labelledby="my-role">
          <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12" wordStagger={0.02}>
            <div className="lg:col-span-7">
              <SectionHeading id="my-role" locale={lang} title={t("myRole")} />
              <p className={`mt-8 text-ink ${bigText}`}>
                <Words text={p.card.role[lang]} />
              </p>
              {parts.role ? (
                <p className={`mt-4 text-ink-muted ${bodyText}`}>
                  <Words text={plainText(parts.role.html)} />
                </p>
              ) : null}
            </div>
            {status.body ? (
              <div data-reveal="text" className="lg:col-span-5 lg:self-end">
                <div className={`${floatCard} p-6 md:p-7`}>
                  <p className="flex items-center gap-2 text-[13px] font-medium text-ink-muted">
                    <span className={`relative size-2 rounded-full ${live ? "bg-petrol" : "bg-ink-muted/50"}`} aria-hidden>
                      {live ? <span className="absolute inset-0 animate-ping rounded-full bg-petrol/60" /> : null}
                    </span>
                    {t("status")}
                  </p>
                  <div className="case-prose mt-3" dangerouslySetInnerHTML={{ __html: status.body }} />
                </div>
              </div>
            ) : null}
          </Reveal>
          {parts.extras.map((s) => (
            <Reveal key={s.heading} className="mt-16 grid grid-cols-1 gap-6 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12" wordStagger={0.015}>
              <h3 className={`lg:col-span-5 ${isAr ? "text-[22px] leading-[36px] font-medium" : "font-latin text-[22px] leading-[30px] font-bold"}`}>
                <Words text={plainText(s.heading)} />
              </h3>
              <p className={`text-ink-muted lg:col-span-7 ${bodyText}`}>
                <Words text={plainText(s.html)} />
              </p>
            </Reveal>
          ))}
        </section>
      </Band>

      {/* 8. Under the hood: its own dark band, easy to skip */}
      <Band label={t("inside")} track="case-technical" project={p.slug} tone="petrol">
        <div className="cs-paper">
          <section id="inside" className={`${wrap} ${pad}`} aria-labelledby="inside-title">
            <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <SectionHeading id="inside-title" locale={lang} title={t("inside")} />
                {parts.tech ? <div data-reveal="text" className="case-prose mt-10" dangerouslySetInnerHTML={{ __html: techBody(parts.tech.html) }} /> : null}
              </div>
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-[110px]">
                  <Kicker>{t("stack")}</Kicker>
                  <ul className="mt-4 flex flex-wrap gap-2" dir="ltr">
                    {page.stack.map((name) => {
                      const logo = logoFor(name);
                      return (
                        <li key={name} data-reveal="text" className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 font-latin text-[13px] text-ink">
                          {logo ? <span className="flex size-4 items-center [&_svg]:size-full" aria-hidden>{logo}</span> : null}
                          {name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Reveal>
            {page.diagram ? (
              <Reveal className="mt-16">
                <Kicker>{t("architecture")}</Kicker>
                <MediaReveal className="mt-4">
                  <figure className="overflow-x-auto rounded-2xl bg-[#F3EFE9] p-3 sm:p-6" dir="ltr">
                    {/* eslint-disable-next-line @next/next/no-img-element -- an SVG drawn for this project */}
                    <img src={page.diagram} alt={`${t("architecture")}: ${p.name[lang]}`} className="mx-auto h-auto w-full min-w-[640px]" loading="lazy" />
                  </figure>
                </MediaReveal>
              </Reveal>
            ) : null}
          </section>
        </div>
      </Band>

      {/* 9. The next project */}
      <Band label={t("next")} track="case-next-project" project={p.slug}>
        <section className={`${wrap} ${pad}`} aria-labelledby="next-title">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5" wordStagger={0.02}>
              <Kicker>{t("next")}</Kicker>
              <h2 id="next-title" className={`mt-3 ${titleCls}`}>
                <Words text={next.name[lang]} />
              </h2>
              <p className={`mt-3 text-ink-muted ${bodyText}`}>
                <Words text={next.card.line[lang]} />
              </p>
              <div data-reveal="text" className="mt-7">
                <ProjectLink slug={next.slug} className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-[15px] font-medium text-bg transition-[filter] hover:brightness-110">
                  {t("more")}
                  <Arrow />
                </ProjectLink>
              </div>
              {related.length ? (
                <ul data-reveal="text" className="mt-8 grid gap-2 border-t border-line pt-5">
                  {related.map((r) => {
                    const rp = projectBySlug(r.slug);
                    return rp ? (
                      <li key={r.slug}>
                        <ProjectLink slug={r.slug} className="group inline-flex items-center gap-2 text-[14px] text-ink-muted transition-colors hover:text-petrol">
                          <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                            <path d="M6 3h7v7M13 3 4 12" />
                          </svg>
                          <span>
                            {r.text} · <span className="text-ink underline decoration-line underline-offset-4 group-hover:text-petrol group-hover:decoration-petrol">{rp.name[lang]}</span>
                          </span>
                        </ProjectLink>
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : null}
            </Reveal>
            <MediaReveal className="lg:col-span-7">
              <ProjectLink slug={next.slug} className="group block overflow-hidden rounded-[26px] ring-1 ring-line">
                <picture>
                  <source type="image/avif" srcSet={nextCover.avif} sizes="(min-width: 1024px) 680px, 100vw" />
                  <img
                    src={nextCover.fallback}
                    srcSet={nextCover.webp}
                    sizes="(min-width: 1024px) 680px, 100vw"
                    alt={next.title[lang]}
                    width={next.media.cover.width}
                    height={next.media.cover.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </picture>
              </ProjectLink>
            </MediaReveal>
          </div>
        </section>
      </Band>

      {/* 10. Let's start your project: the same close as the home page */}
      <Band label={ts("contact")} track="case-contact" project={p.slug}>
        <Contact locale={lang} />
      </Band>
      <SectionPager paging={false} />
    </>
  );
}
