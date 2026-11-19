import { getTranslations } from "next-intl/server";
import { otherProjects } from "@/lib/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/ui/Words";
import { CountUp } from "@/components/ui/CountUp";
import { InViewVideo } from "@/components/projects/InViewVideo";
import { ProjectLink } from "@/components/case/NextProject";

/**
 * 3. Other work: Web Point (tier "other"), in the same language as the Selected work showcase but lighter:
 * the recording on the brand gradient, then status and year, name, line, "My role", two numbers that
 * count up, and the way in. One screen on desktop, so the pager reaches it in one step.
 */
export async function OtherWork({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("otherWork");
  const tp = await getTranslations("projects");
  const isAr = locale === "ar";

  return (
    <section
      id="other-work"
      aria-labelledby="other-work-title"
      className="mx-auto flex max-w-6xl flex-col px-4 pt-16 pb-20 sm:px-6 md:pt-20 md:pb-24 lg:h-dvh lg:justify-center lg:pt-[92px] lg:pb-10"
    >
      <Reveal>
        <SectionHeading id="other-work-title" locale={locale} title={t("title")} />
      </Reveal>

      <ul className="mt-8 grid gap-10 lg:mt-10">
        {otherProjects.map((p) => (
          <li key={p.slug} id={`project-${p.slug}`} className="scroll-mt-24">
            <Reveal>
              <article aria-labelledby={`project-${p.slug}-name`} className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
                {/* The recording, on the brand gradient */}
                <div data-reveal="block" className="relative lg:col-span-7">
                  <div className="rounded-[22px] bg-[radial-gradient(110%_90%_at_10%_0%,color-mix(in_oklab,var(--surface)_70%,transparent),transparent_62%),radial-gradient(90%_80%_at_100%_100%,var(--clay-soft),transparent_66%)] p-3 ring-1 ring-line sm:p-5 lg:max-w-[calc((100dvh-330px)*1.5)] lg:rounded-[28px] lg:p-7">
                    <div className="overflow-hidden rounded-xl border border-line/70 bg-surface shadow-[0_30px_60px_-30px_rgba(22,48,58,0.55)] dark:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]" dir="ltr">
                      <div className="flex h-7 items-center gap-1.5 border-b border-line bg-bg/70 px-3" aria-hidden>
                        <span className="size-2 rounded-full bg-line" />
                        <span className="size-2 rounded-full bg-line" />
                        <span className="size-2 rounded-full bg-line" />
                      </div>
                      <InViewVideo mp4={p.media.loop.mp4} webm={p.media.loop.webm} poster={p.media.loop.poster} label={p.title[locale]} />
                    </div>
                  </div>
                  <ProjectLink slug={p.slug} aria-hidden tabIndex={-1} data-cursor-label={tp("cta")} className="absolute inset-0 z-10" />
                </div>

                {/* The story in short */}
                <div className="flex flex-col lg:col-span-5">
                  <div data-reveal="text" className="flex items-center gap-2.5 text-[13px] leading-[20px] text-ink-muted">
                    <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1">
                      <span className="size-2 rounded-full bg-ink-muted/50" aria-hidden />
                      {t("delivered")}
                    </span>
                  </div>

                  <h3
                    id={`project-${p.slug}-name`}
                    className={
                      isAr
                        ? "mt-4 text-[26px] leading-[40px] font-medium lg:text-[32px] lg:leading-[48px]"
                        : "mt-4 font-latin text-[26px] leading-[32px] font-bold tracking-[-0.015em] lg:text-[34px] lg:leading-[40px]"
                    }
                  >
                    <Words text={p.name[locale]} />
                  </h3>
                  <p className="mt-2 text-[16px] leading-[28px] text-ink-muted lg:text-[17px] lg:leading-[30px]">
                    <Words text={p.card.line[locale]} />
                  </p>

                  <div className="mt-5 border-s-2 border-clay ps-4">
                    <p data-reveal="text" className="text-[12px] leading-[18px] font-medium tracking-[0.06em] text-ink-muted uppercase">
                      {tp("role")}
                    </p>
                    <p className="mt-0.5 text-[15px] leading-[24px] font-medium text-ink">
                      <Words text={p.card.role[locale]} />
                    </p>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5">
                    {p.card.stats.map((s, i) => (
                      <div key={i} data-reveal="text" className="flex flex-col-reverse gap-1">
                        <dt className="text-[13px] leading-[20px] text-ink-muted">{s.label[locale]}</dt>
                        <dd className="num self-start font-display text-[34px] leading-[38px] text-petrol lg:text-[40px] lg:leading-[44px]">
                          <CountUp value={s.value} delay={0.5 + i * 0.08} />
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div data-reveal="text" className="mt-6">
                    <ProjectLink
                      slug={p.slug}
                      className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-[15px] font-medium text-bg transition-[filter] hover:brightness-110"
                    >
                      {tp("cta")}
                      <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </ProjectLink>
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
