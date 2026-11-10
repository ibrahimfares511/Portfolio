import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Phase 1 skeleton: every home section in the sitemap order, with its
 * approved title and a dashed placeholder showing the phase that fills it.
 */
const SECTIONS = [
  { id: "projects", key: "projects", phase: 3 },
  { id: "other-work", key: "otherWork", phase: 4 },
  { id: "build", key: "build", phase: 4 },
  { id: "process", key: "process", phase: 5 },
  { id: "tools", key: "tools", phase: 5 },
  { id: "about", key: "about", phase: 6 },
  { id: "contact", key: "contact", phase: 6 },
] as const;

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");
  const th = await getTranslations("hero");
  const isAr = locale === "ar";

  return (
    <>
      <section id="top" className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 pt-24 pb-16 sm:px-6">
        <p className="text-ink-muted">{th("eyebrow")}</p>
        <h1
          className={
            isAr
              ? "mt-4 max-w-3xl text-[36px] leading-[56px] font-medium md:text-[52px] md:leading-[76px]"
              : "mt-4 max-w-3xl text-[38px] leading-[48px] font-semibold tracking-tight md:text-[52px] md:leading-[64px]"
          }
        >
          {th("headline")}
          <span className="ms-2 inline-block size-[0.2em] rounded-full bg-clay" aria-hidden />
        </h1>
        <Placeholder phase={2} />
      </section>

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading id={`${s.id}-title`} locale={locale}>
            {t(s.key)}
          </SectionHeading>
          <Placeholder phase={s.phase} />
        </section>
      ))}
    </>
  );
}

function Placeholder({ phase }: { phase: number }) {
  return (
    <div className="mt-10 flex h-56 items-center justify-center rounded-lg border border-dashed border-line font-latin text-sm text-ink-muted" dir="ltr">
      Phase {phase}
    </div>
  );
}
