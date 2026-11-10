import { getMessages, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/ui/Words";
import { ProcessSteps } from "@/components/process/ProcessSteps";

// One avatar pose per step (design system → Avatar).
const POSES = ["01-understand", "02-plan", "03-build", "04-deliver"];

/** 5. How we work together: four steps, then the closing line. */
export async function HowWeWork({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("process");
  const messages = (await getMessages()) as { process: { steps: { lead: string; text: string }[] } };
  const steps = messages.process.steps.map((s, i) => ({ ...s, pose: POSES[i] }));
  const isAr = locale === "ar";

  return (
    <section id="process" aria-labelledby="process-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <Reveal>
        <SectionHeading id="process-title" locale={locale} title={t("title")} sub={t("subline")} />
      </Reveal>

      <Reveal>
        <div data-reveal="block">
          <ProcessSteps steps={steps} lang={locale} />
        </div>
      </Reveal>

      <Reveal className="mt-16 text-center md:mt-20">
        <p
          className={
            isAr
              ? "text-[26px] leading-[42px] font-medium md:text-[34px] md:leading-[54px]"
              : "font-display text-[30px] leading-[38px] lowercase md:text-[40px] md:leading-[48px]"
          }
        >
          <Words text={t("closing")} />
        </p>
      </Reveal>
    </section>
  );
}
