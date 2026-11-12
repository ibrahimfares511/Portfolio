import { getMessages, getTranslations } from "next-intl/server";
import { projectBySlug } from "@/lib/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

type Card = { lead: string; join: string; text: string };

// Sitemap → "What I can build", proof column: links to the project cards.
const PROOF: string[][] = [
  ["wms", "smart-control"],
  ["ertiqaa-academy", "haya", "elite", "real-estate-platform"],
  [],
];

// Shorter chip labels where the card name is long (Ibrahim, Nov 10, 2026;
// the sitemap's proof column calls it "real estate platform").
const CHIP_NAME: Record<string, { ar: string; en: string }> = {
  "real-estate-platform": { ar: "منصة عقارات", en: "Real estate platform" },
};

const ICONS = [
  // Internal systems: a building with rows (warehouses, staff, reports)
  <svg key="0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 27V12l12-7 12 7v15" />
    <path d="M9 27v-9h14v9M9 22h14M4 27h24" />
  </svg>,
  // Platforms and web apps: a browser window with content
  <svg key="1" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="6" width="24" height="20" rx="3" />
    <path d="M4 11h24M9 16h8M9 20h5M21 16h2v4h-2z" />
  </svg>,
];

/** 4. What can I build for you? Three cards; the third is the open door. */
export async function WhatICanBuild({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("build");
  const messages = (await getMessages()) as { build: { cards: Card[] } };
  const cards = messages.build.cards;

  return (
    <section id="build" aria-labelledby="build-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <Reveal>
        <SectionHeading id="build-title" locale={locale} title={t("title")} sub={t("subline")} />
      </Reveal>

      <Reveal className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3">
        {cards.map((c, i) => {
          const proof = PROOF[i].map((slug) => projectBySlug(slug)!).filter(Boolean);
          const last = i === cards.length - 1;
          return (
            <article
              key={i}
              data-reveal="block"
              className={`relative flex min-h-[340px] flex-col overflow-hidden rounded-xl border border-line p-6 md:p-7 ${
                last
                  ? "bg-[radial-gradient(110%_80%_at_100%_0%,var(--sky-soft),transparent_65%),radial-gradient(90%_70%_at_0%_100%,var(--clay-soft),transparent_70%)] dark:bg-[radial-gradient(110%_80%_at_100%_0%,var(--sky-soft),transparent_65%),radial-gradient(90%_70%_at_0%_100%,color-mix(in_oklab,var(--clay-soft)_55%,transparent),transparent_70%)]"
                  : "bg-surface"
              }`}
            >
              {last ? null : <div className="mb-6 size-10 text-petrol">{ICONS[i]}</div>}

              <p className={`text-[18px] leading-[32px] text-ink-muted md:text-[19px] md:leading-[34px] ${last ? "relative z-10 max-w-[15em]" : ""}`}>
                <strong className={`font-medium text-ink ${locale === "en" ? "font-bold" : ""} ${last ? "block text-[24px] leading-[38px] md:text-[26px]" : ""}`}>
                  {c.lead}
                </strong>
                {last ? null : c.join}
                {c.text}
              </p>

              {proof.length ? (
                <div className="mt-auto pt-8">
                  <p className="text-[13px] text-ink-muted">{t("proofLabel")}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {proof.map((p) => (
                      <li key={p.slug}>
                        <a
                          href={`#project-${p.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/60 px-3 py-1.5 text-[14px] text-ink transition-colors hover:border-petrol/50 hover:text-petrol"
                        >
                          {(CHIP_NAME[p.slug] ?? p.name)[locale]}
                          <svg viewBox="0 0 16 16" className="size-3 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                            <path d="M6 3h7v7M13 3 4 12" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="relative z-10 mt-auto flex items-end pt-8 max-lg:min-h-[200px]">
                    <ButtonLink href={`/${locale}#contact`}>{t("cta")}</ButtonLink>
                  </div>
                  {/* A pen sketch instead of another avatar: an idea (the dot) → a system. */}
                  <svg
                    aria-hidden
                    viewBox="0 0 220 170"
                    fill="none"
                    className="pointer-events-none absolute end-4 bottom-4 z-0 h-[150px] w-auto text-petrol md:h-[180px] rtl:-scale-x-100"
                  >
                    {[
                      "M30 38 C 70 20, 96 60, 112 84",
                      "M104 70 L113 86 L96 84",
                      "M120 92 h80 a10 10 0 0 1 10 10 v46 a10 10 0 0 1 -10 10 h-80 a10 10 0 0 1 -10 -10 v-46 a10 10 0 0 1 10 -10 z",
                      "M126 110 h40 M126 122 h64 M126 134 h28",
                      "M178 132 v14 M188 126 v20 M198 118 v28",
                    ].map((d, i) => (
                      <path
                        key={i}
                        data-reveal="pen"
                        d={d}
                        pathLength={1}
                        strokeDasharray="1"
                        stroke="currentColor"
                        strokeOpacity={i < 2 ? 0.8 : 0.55}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                    <circle cx="30" cy="38" r="9" fill="var(--clay)" />
                  </svg>
                </>
              )}
            </article>
          );
        })}
      </Reveal>
    </section>
  );
}
