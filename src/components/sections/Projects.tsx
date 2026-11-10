import { getTranslations } from "next-intl/server";
import { mainProjects } from "@/lib/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectStack } from "@/components/projects/ProjectStack";

/** 2. Projects: "Selected work", the six main projects as stacked cards. */
export async function Projects({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("projects");
  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-6xl px-4 pt-20 pb-10 sm:px-6 md:pt-28">
      <Reveal>
        <SectionHeading id="projects-title" locale={locale} title={t("title")} sub={t("subline")} />
      </Reveal>
      <ProjectStack
        projects={mainProjects}
        lang={locale}
        strings={{ cta: t("cta"), status: { live: t("status.live"), delivered: t("status.delivered") } }}
      />
    </section>
  );
}
