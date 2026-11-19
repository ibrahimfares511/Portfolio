import { getMessages, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessJourney } from "@/components/process/ProcessJourney";

// One avatar pose per chapter (design system → Avatar).
const POSES = ["01-understand", "02-plan", "03-build", "04-deliver"];

/** 5. How we work together: a journey drawn by a pen line, four chapters that come alive as it reaches them. */
export async function HowWeWork({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("process");
  const messages = (await getMessages()) as { process: { steps: { lead: string; text: string }[] } };
  const steps = messages.process.steps.map((s, i) => ({ ...s, pose: POSES[i] }));

  return (
    <section id="process" aria-labelledby="process-title" className="mx-auto max-w-6xl px-4 py-20 [overflow-x:clip] sm:px-6 md:py-28">
      <Reveal>
        <SectionHeading id="process-title" locale={locale} title={t("title")} sub={t("subline")} />
      </Reveal>
      <ProcessJourney steps={steps} lang={locale} closing={t("closing")} />
    </section>
  );
}
