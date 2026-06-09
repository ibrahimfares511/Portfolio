import { motion } from "framer-motion";
import { GraduationCap, Languages, User, Award, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { portfolioData } from "@/data/portfolioData";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTheme } from "@/components/shared/ThemeContext";

export function AboutSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  return (
    <section
      id="about"
      className="relative section-padding overflow-hidden bg-alt-background/30 dark:bg-transparent transition-colors duration-700"
      aria-label="About Me"
    >
      {/* Visual background lights */}
      {isDark && (
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[90px] pointer-events-none" />
      )}

      <div className="container-wide relative z-10">
        <SectionHeading
          label={t("about.label")}
          title={t("about.title")}
          description={t("about.description")}
        />

        <div className="grid lg:grid-cols-12 gap-8 items-stretch mt-12">
          {/* Left Side: Summary & Attributes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between glass rounded-3xl p-6 md:p-8 text-start border border-border"
          >
            <motion.div
              key={currentLang}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {t("about.profileOverview")}
                  </h3>
                </div>

                <p className="text-sm md:text-base leading-relaxed text-muted font-medium max-w-[600px]">
                  {t("about.summary")}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                      {t("about.expertiseFocus")}
                    </h4>
                    <ul className="space-y-1.5">
                      {(t("about.expertiseList", { returnObjects: true }) as string[]).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
                      {t("about.careerStance")}
                    </h4>
                    <ul className="space-y-1.5">
                      {(t("about.careerList", { returnObjects: true }) as string[]).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-secondary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Micro Highlights */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-accent/15 bg-accent/5 text-[10px] font-bold text-accent tracking-wide uppercase">
                  <Award className="h-3.5 w-3.5" /> {t("about.codingHighlight")}
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 text-[10px] font-bold text-emerald-400 tracking-wide uppercase">
                  <Globe className="h-3.5 w-3.5" /> {t("about.remoteHighlight")}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Education & Languages */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-3xl p-6 md:p-8 text-start border border-border flex-1 flex flex-col justify-between"
            >
              <motion.div
                key={currentLang}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {t("about.education")}
                  </h3>
                </div>

                <div className="space-y-6">
                  {(
                    (t("about.educationList", {
                      returnObjects: true,
                    }) as Array<{
                      degree: string;
                      institution: string;
                      description: string;
                    }>) || []
                  ).map((edu, idx) => (
                    <div
                      key={idx}
                      className="relative ps-5 border-s border-border"
                    >
                      {/* Timeline dot */}
                      <span className="absolute -start-1.5 top-1.5 w-3 h-3 rounded-full bg-accent" />
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <h4 className="text-sm font-bold text-foreground leading-snug">
                          {edu.degree}
                        </h4>
                        <span className="text-[10px] font-mono font-semibold text-accent">
                          {portfolioData.education[idx]?.period}
                        </span>
                      </div>
                      <p className="text-xs text-muted-secondary font-medium mt-1">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-muted leading-relaxed mt-2">
                        {edu.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Languages Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl p-6 md:p-8 text-start border border-border"
            >
              <motion.div
                key={currentLang}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Languages className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {t("about.languages")}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {portfolioData.languages.map((lang, idx) => {
                    const langKey = lang.name.toLowerCase();
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-alt-background/40 border border-border/60"
                      >
                        <p className="text-xs text-muted font-bold tracking-wide uppercase">
                          {t(`about.languagesList.${langKey}.name`)}
                        </p>
                        <p className="text-lg font-bold text-gradient-accent mt-1">
                          {t(`about.languagesList.${langKey}.level`)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
