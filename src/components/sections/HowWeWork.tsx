import { getMessages, getTranslations } from "next-intl/server";
import { ProcessStory } from "@/components/process/ProcessStory";

// One avatar pose per chapter (design system → Avatar).
const POSES = ["01-understand", "02-plan", "03-build", "04-deliver"];

/** 5. How we work together: four chapters of a short story, ending on the closing promise. */
export async function HowWeWork({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("process");
  const messages = (await getMessages()) as { process: { steps: { lead: string; text: string }[] } };
  const steps = messages.process.steps.map((s, i) => ({ ...s, pose: POSES[i] }));

  return (
    <section id="process" aria-labelledby="process-title" className="py-20 [overflow-x:clip] md:py-28 lg:py-0">
      <ProcessStory steps={steps} lang={locale} title={t("title")} sub={t("subline")} closing={t("closing")} />
    </section>
  );
}
