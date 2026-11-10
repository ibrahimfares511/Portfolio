import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hero } from "@/components/sections/Hero";

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

  return (
    <>
      <Hero />

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
