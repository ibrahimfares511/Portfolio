import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { OtherWork } from "@/components/sections/OtherWork";
import { WhatICanBuild } from "@/components/sections/WhatICanBuild";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { Tools } from "@/components/sections/Tools";

/**
 * Home page, in the sitemap order. Sections not built yet show their
 * approved title and a dashed placeholder naming the phase that fills them.
 */
const PLACEHOLDERS = [
  { id: "about", key: "about", phase: 6 },
  { id: "contact", key: "contact", phase: 6 },
] as const;

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");
  const lang = locale === "en" ? "en" : "ar";

  return (
    <>
      <Hero />
      <Projects locale={lang} />
      <OtherWork locale={lang} />
      <WhatICanBuild locale={lang} />
      <HowWeWork locale={lang} />
      <Tools locale={lang} />

      {PLACEHOLDERS.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <Reveal>
            <SectionHeading id={`${s.id}-title`} locale={locale} title={t(s.key)} />
          </Reveal>
          <div className="mt-10 flex h-56 items-center justify-center rounded-lg border border-dashed border-line font-latin text-sm text-ink-muted" dir="ltr">
            Phase {s.phase}
          </div>
        </section>
      ))}
    </>
  );
}
