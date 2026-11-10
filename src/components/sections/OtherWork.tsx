import { getTranslations } from "next-intl/server";
import { otherProjects } from "@/lib/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { InViewVideo } from "@/components/projects/InViewVideo";

/**
 * 3. Other work: Web Point (tier "other"), a lighter, horizontal card.
 * Status follows the sitemap: "تم التسليم (2022) / Delivered (2022)".
 */
export async function OtherWork({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("otherWork");
  const tp = await getTranslations("projects");
  const isAr = locale === "ar";

  return (
    <section id="other-work" aria-labelledby="other-work-title" className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 md:pt-20 md:pb-28">
      <Reveal>
        <SectionHeading id="other-work-title" locale={locale} title={t("title")} />
      </Reveal>

      <ul className="mt-10 grid gap-6">
        {otherProjects.map((p) => (
          <li key={p.slug} id={`project-${p.slug}`} className="scroll-mt-24">
            <Reveal>
              <article
                aria-labelledby={`project-${p.slug}-name`}
                className="grid items-center gap-6 rounded-xl border border-line bg-surface/60 p-4 sm:p-5 md:grid-cols-12 md:gap-8 md:p-6"
              >
                <div data-reveal="block" className="overflow-hidden rounded-lg border border-line/80 md:col-span-5" dir="ltr">
                  <InViewVideo mp4={p.media.loop.mp4} webm={p.media.loop.webm} poster={p.media.loop.poster} label={p.title[locale]} />
                </div>

                <div className="flex flex-col gap-4 md:col-span-7">
                  <div data-reveal="text" className="flex flex-wrap items-center gap-3">
                    <h3
                      id={`project-${p.slug}-name`}
                      className={isAr ? "text-[24px] leading-[36px] font-medium" : "font-latin text-[24px] leading-[32px] font-bold"}
                    >
                      {p.name[locale]}
                    </h3>
                    <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[13px] text-ink-muted">
                      <span className="size-2 rounded-full bg-ink-muted/50" aria-hidden />
                      {t("delivered")}
                    </span>
                  </div>
                  <p data-reveal="text" className="text-[16px] leading-[28px] text-ink-muted">
                    {p.card.line[locale]}
                  </p>
                  <p data-reveal="text" className="flex items-start gap-2 text-[14px] leading-[22px] text-ink">
                    <span className="mt-[9px] h-px w-4 shrink-0 bg-clay" aria-hidden />
                    {p.card.role[locale]}
                  </p>
                  <div data-reveal="text" className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
                    <dl className="flex gap-8">
                      {p.card.stats.map((s, i) => (
                        <div key={i} className="flex flex-col-reverse gap-1">
                          <dt className="text-[13px] leading-[20px] text-ink-muted">{s.label[locale]}</dt>
                          <dd className="num self-start font-display text-[32px] leading-[36px] text-petrol">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <a
                      href={`/${locale}/projects/${p.slug}`}
                      className="inline-flex h-11 items-center gap-2 rounded-md border-[1.5px] border-ink/80 px-5 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-bg"
                    >
                      {tp("cta")}
                      <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
