import { getMessages, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ToolsMarquee } from "@/components/tools/ToolsMarquee";

/** 6. Tools I work with: four marquee rows (sitemap order). */
export async function Tools({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("tools");
  const messages = (await getMessages()) as { tools: { rows: { label: string; items: string[] }[] } };

  return (
    <section id="tools" aria-labelledby="tools-title" className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading id="tools-title" locale={locale} title={t("title")} sub={t("subline")} />
        </Reveal>
      </div>
      <Reveal>
        <div data-reveal="block">
          <ToolsMarquee rows={messages.tools.rows} />
        </div>
      </Reveal>
    </section>
  );
}
