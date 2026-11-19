import { getTranslations } from "next-intl/server";
import { mainProjects } from "@/lib/projects";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";

/** 2. Projects: "Selected work", the six main projects as a horizontal showcase (one screen each on desktop). */
export async function Projects({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("projects");
  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 pb-12 md:pt-24 lg:pt-0 lg:pb-0">
      <ProjectShowcase
        projects={mainProjects}
        lang={locale}
        title={t("title")}
        sub={t("subline")}
        strings={{ cta: t("cta"), next: t("next"), prev: t("prev"), role: t("role"), status: { live: t("status.live"), delivered: t("status.delivered") } }}
      />
    </section>
  );
}
