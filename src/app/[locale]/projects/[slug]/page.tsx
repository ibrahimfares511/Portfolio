import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL, OG_LOCALE } from "@/lib/site";
import { projects, projectBySlug, type Project } from "@/lib/projects";
import { loadProjectPage, type CaseSection } from "@/lib/project-page";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/ui/Words";
import { ButtonLink } from "@/components/ui/Button";
import { InViewVideo } from "@/components/projects/InViewVideo";
import { LensSwitch } from "@/components/case/LensSwitch";
import { Gallery } from "@/components/case/Gallery";
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
  const title = `${p.name[lang]} · ${t("title")}`;
  const images = p.media.og
    ? [{ url: p.media.og, width: 1200, height: 630, alt: p.title[lang] }]
    : [{ url: `/og/home-${lang}.jpg`, width: 1200, height: 630 }];
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
      siteName: t("title"),
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

/** One case-study section: heading on the side (desktop), the text as written. */
function Section({ s, lang }: { s: CaseSection; lang: Lang }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8 md:py-14">
      <h2
        data-reveal="text"
        className={`md:col-span-4 ${
          lang === "ar"
            ? "text-[24px] leading-[38px] font-medium md:text-[28px] md:leading-[44px]"
            : "font-latin text-[24px] leading-[32px] font-bold tracking-[-0.01em] md:text-[28px] md:leading-[36px]"
        }`}
      >
        {s.heading}
      </h2>
      <div
        data-reveal="text"
        className="case-prose md:col-span-8"
        dangerouslySetInnerHTML={{ __html: s.html }}
      />
    </Reveal>
  );
}

function BlockTitle({ children, lang }: { children: string; lang: Lang }) {
  return (
    <h2
      className={
        lang === "ar"
          ? "mb-8 text-[24px] leading-[38px] font-medium md:text-[28px] md:leading-[44px]"
          : "mb-8 font-latin text-[24px] leading-[32px] font-bold tracking-[-0.01em] md:text-[28px] md:leading-[36px]"
      }
    >
      {children}
      <span
        className="ms-1 inline-block size-[0.22em] rounded-full bg-clay"
        aria-hidden
      />
    </h2>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-4 rtl:-scale-x-100 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function LinkCard({
  href,
  kicker,
  title,
  text,
}: {
  href: string;
  kicker: string;
  title: string;
  text?: string;
}) {
  return (
    <a
      href={href}
      className="group flex h-full flex-col gap-2 rounded-xl border border-line bg-surface/70 p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-petrol/40 sm:p-6"
    >
      <span className="text-[13px] text-ink-muted">{kicker}</span>
      <span className="flex items-center gap-2 text-[19px] font-medium text-ink group-hover:text-petrol">
        {title}
        <Arrow className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </span>
      {text ? (
        <span className="text-[14px] leading-[22px] text-ink-muted">
          {text}
        </span>
      ) : null}
    </a>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang: Lang = locale === "en" ? "en" : "ar";
  const p = projectBySlug(slug);
  const page = loadProjectPage(slug);
  if (!p || !page) notFound();

  const t = await getTranslations("caseStudy");
  const tp = await getTranslations("projects");
  const tc = await getTranslations("contactSection");
  const th = await getTranslations("hero");
  const to = await getTranslations("otherWork");

  const cs = page.caseStudy[lang];
  const plain = cs.sections.filter((s) => s.kind === "plain");
  const technical = cs.sections.filter((s) => s.kind !== "plain");
  const shots = page.shots.filter((s) => !s.lang || s.lang === lang);
  const videos = page.videos.filter((v) => !v.lang || v.lang === lang);
  const home = `/${lang}`;
  const live = p.status === "live";
  const statusText =
    p.tier === "other" ? to("delivered") : tp(`status.${p.status}`);
  const i = projects.findIndex((x) => x.slug === slug);
  const next: Project = projects[(i + 1) % projects.length];
  const relatedCards = [
    ...(p.partOf
      ? [{ slug: p.partOf.slug, text: p.partOf.relation[lang] }]
      : []),
    ...p.related.map((r) => ({ slug: r.slug, text: r.relation[lang] })),
    ...projects
      .filter((x) => x.partOf?.slug === slug)
      .map((x) => ({ slug: x.slug, text: x.partOf!.tag[lang] })),
  ].filter(
    (r, k, all) =>
      r.slug !== next.slug && all.findIndex((x) => x.slug === r.slug) === k,
  );

  const plainPanel = (
    <>
      <div className="mt-6">
        {plain.map((s) => (
          <Section key={s.heading} s={s} lang={lang} />
        ))}
      </div>

      {videos.length ? (
        <section
          className="border-t border-line py-12 md:py-16"
          aria-label={t("videos")}
        >
          <BlockTitle lang={lang}>{t("videos")}</BlockTitle>
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {videos.map((v, k) => (
              <Reveal
                key={v.name}
                className={
                  videos.length % 2 === 1 && k === 0 ? "md:col-span-2" : ""
                }
              >
                <figure data-reveal="block">
                  <div
                    className="overflow-hidden rounded-lg border border-line bg-surface shadow-[0_24px_50px_-34px_rgba(22,48,58,0.6)]"
                    dir="ltr"
                  >
                    <InViewVideo
                      mp4={v.mp4}
                      webm={v.webm}
                      poster={v.poster}
                      label={v.caption[lang]}
                    />
                  </div>
                  <figcaption className="mt-3 text-[14px] leading-[22px] text-ink-muted">
                    {v.caption[lang]}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {shots.length ? (
        <section
          className="border-t border-line py-12 md:py-16"
          aria-label={t("screens")}
        >
          <BlockTitle lang={lang}>{t("screens")}</BlockTitle>
          <Gallery
            shots={shots}
            lang={lang}
            strings={{
              desktop: t("desktop"),
              mobile: t("mobile"),
              close: t("close"),
              prev: t("prev"),
              next: t("nextShot"),
            }}
          />
        </section>
      ) : null}
    </>
  );

  const technicalPanel = (
    <>
      <div className="mt-6">
        {technical.map((s) => (
          <Section key={s.heading} s={s} lang={lang} />
        ))}
      </div>

      <section
        className="border-t border-line py-12 md:py-16"
        aria-label={t("stack")}
      >
        <BlockTitle lang={lang}>{t("stack")}</BlockTitle>
        <ul className="flex flex-wrap gap-2.5" dir="ltr">
          {page.stack.map((name) => {
            const logo = logoFor(name);
            return (
              <li
                key={name}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface/80 px-4 font-latin text-[14px] text-ink"
              >
                {logo ? (
                  <span
                    className="flex size-[18px] items-center [&_svg]:size-full"
                    aria-hidden
                  >
                    {logo}
                  </span>
                ) : null}
                {name}
              </li>
            );
          })}
        </ul>
      </section>

      {page.diagram ? (
        <section
          className="border-t border-line py-12 md:py-16"
          aria-label={t("architecture")}
        >
          <BlockTitle lang={lang}>{t("architecture")}</BlockTitle>
          <Reveal>
            <figure
              data-reveal="block"
              className="overflow-x-auto rounded-xl border border-line bg-[#F3EFE9] p-3 sm:p-6"
              dir="ltr"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- an SVG drawn for this project */}
              <img
                src={page.diagram}
                alt={`${t("architecture")}: ${p.name[lang]}`}
                className="mx-auto h-auto w-full min-w-[640px]"
                loading="lazy"
              />
            </figure>
          </Reveal>
        </section>
      ) : null}
    </>
  );

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
        image: p.media.og ? `${SITE_URL}${p.media.og}` : undefined,
        keywords: page.stack.join(", "),
        creator: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: lang === "ar" ? "إبراهيم فارس" : "Ibrahim Fares",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("back"),
            item: `${SITE_URL}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: p.name[lang],
            item: `${SITE_URL}/${lang}/projects/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 md:pt-32">
      <JsonLd data={ld} />
      {/* Head */}
      <Reveal>
        <a
          data-reveal="text"
          href={`${home}#projects`}
          className="inline-flex items-center gap-2 text-[15px] text-ink-muted transition-colors hover:text-petrol"
        >
          <Arrow className="rotate-180" />
          {t("back")}
        </a>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {p.partOf ? (
              <a
                data-reveal="text"
                href={`${home}/projects/${p.partOf.slug}`}
                className="mb-3 inline-flex items-center rounded-sm bg-sky-soft/70 px-2 py-0.5 text-[13px] text-petrol hover:bg-sky-soft"
              >
                {p.partOf.tag[lang]}
              </a>
            ) : null}
            <h1
              className={
                lang === "ar"
                  ? "text-[34px] leading-[52px] font-medium md:text-[46px] md:leading-[68px]"
                  : "font-latin text-[36px] leading-[44px] font-bold tracking-[-0.02em] md:text-[50px] md:leading-[58px]"
              }
            >
              <Words text={cs.title} />
            </h1>
            <p
              data-reveal="text"
              className="mt-5 max-w-2xl text-[17px] leading-[30px] text-ink-muted md:text-[19px] md:leading-[34px]"
            >
              {cs.lead}
            </p>
          </div>

          <div
            data-reveal="text"
            className="content-start rounded-xl border border-line bg-surface/70 p-5 text-[15px] sm:p-6 lg:col-span-5"
          >
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="text-[13px] text-ink-muted">{t("role")}</dt>
                <dd className="mt-1 text-ink">{p.card.role[lang]}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-ink-muted">{t("year")}</dt>
                <dd className="mt-1 text-ink">
                  <span className="num">{p.year}</span>
                </dd>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <dt className="text-[13px] text-ink-muted">{t("status")}</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`relative size-2 rounded-full ${live ? "bg-petrol" : "bg-ink-muted/50"}`}
                      aria-hidden
                    >
                      {live ? (
                        <span className="absolute inset-0 animate-ping rounded-full bg-petrol/60" />
                      ) : null}
                    </span>
                    {statusText}
                  </span>
                  {p.statusNote ? (
                    <span className="text-[14px] text-ink-muted">
                      {p.statusNote[lang]}
                    </span>
                  ) : null}
                </dd>
              </div>
            </dl>
            {p.links.live ? (
              <div className="mt-5">
                <a
                  href={p.links.live}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 font-medium text-petrol underline decoration-petrol/30 underline-offset-4 hover:decoration-petrol"
                >
                  {t("visit")}
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </Reveal>

      {/* Cover: the card loop, larger */}
      <Reveal className="mt-10 md:mt-14">
        <div
          data-reveal="block"
          className="rounded-xl bg-[radial-gradient(120%_90%_at_15%_0%,var(--sky-soft),transparent_60%),radial-gradient(90%_80%_at_100%_100%,var(--clay-soft),transparent_65%)] p-3 sm:p-8 lg:p-12"
        >
          <div
            className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-line/80 bg-surface shadow-[0_30px_60px_-34px_rgba(22,48,58,0.6)]"
            dir="ltr"
          >
            <div
              className="flex h-7 items-center gap-1.5 border-b border-line bg-bg/70 px-3"
              aria-hidden
            >
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
            </div>
            <InViewVideo
              mp4={p.media.loop.mp4}
              webm={p.media.loop.webm}
              poster={p.media.loop.poster}
              label={p.title[lang]}
            />
          </div>
        </div>
      </Reveal>

      {/* The two lenses */}
      <div className="mt-12 md:mt-16">
        <LensSwitch
          label={t("lensLabel")}
          names={{ plain: t("plain"), technical: t("technical") }}
          plain={plainPanel}
          technical={technicalPanel}
        />
      </div>

      {/* Related, next, contact */}
      <footer className="mt-6 border-t border-line pt-12 md:pt-16">
        <div className="grid gap-4 md:grid-cols-2">
          {relatedCards.map((r) => {
            const rp = projectBySlug(r.slug);
            return rp ? (
              <LinkCard
                key={r.slug}
                href={`${home}/projects/${r.slug}`}
                kicker={r.text}
                title={rp.name[lang]}
              />
            ) : null;
          })}
          <LinkCard
            href={`${home}/projects/${next.slug}`}
            kicker={t("next")}
            title={next.name[lang]}
            text={next.card.line[lang]}
          />
        </div>

        <Reveal className="mt-14 flex flex-col items-start gap-5 rounded-xl bg-petrol p-6 text-bg sm:flex-row sm:items-center sm:justify-between sm:p-10 dark:bg-surface dark:text-ink">
          <div>
            <p
              data-reveal="text"
              className={
                lang === "ar"
                  ? "text-[26px] leading-[40px] font-medium"
                  : "font-latin text-[26px] leading-[34px] font-bold"
              }
            >
              {tc("title")}
            </p>
            <p
              data-reveal="text"
              className="mt-2 max-w-xl text-[16px] leading-[28px] opacity-80"
            >
              {tc("subline")}
            </p>
          </div>
          <span data-reveal="text">
            <ButtonLink href={`${home}#contact`}>{th("primary")}</ButtonLink>
          </span>
        </Reveal>
      </footer>
    </article>
  );
}
