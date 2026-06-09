import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileEdit,
  Users,
  Zap,
  Database,
  MapPin,
  ChevronRight,
  Target,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { portfolioData } from "@/data/portfolioData";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/shared/ThemeContext";

const iconMap = {
  "real-time-chat": Users,
  "exam-engine": FileEdit,
  "drag-drop-erp": Database,
  "legacy-refactoring": Zap,
  "geo-discovery": MapPin,
} as const;

type ChallengeType = Omit<
  (typeof portfolioData.challenges)[number],
  "title" | "summary" | "challenge" | "solution" | "outcome"
> & {
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
};

export function ChallengesSection() {
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeType | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const isRtl = currentLang === "ar";

  // Combine static structural data (title always EN from portfolioData)
  // with translated summary/challenge/solution/outcome from i18n
  const challenges = portfolioData.challenges.map((challenge, idx) => {
    const localList = t("challenges.challengesList", {
      returnObjects: true,
    }) as Array<{
      title: string;
      summary: string;
      challenge: string;
      solution: string;
      outcome: string;
    }> | null;

    const localChal = localList && localList[idx] ? localList[idx] : null;

    return {
      ...challenge,
      // Change 1: title always stays in English (from portfolioData), never translated
      title: challenge.title,
      summary: localChal?.summary || challenge.summary,
      challenge: localChal?.challenge || challenge.challenge,
      solution: localChal?.solution || challenge.solution,
      outcome: localChal?.outcome || challenge.outcome,
    };
  });

  return (
    <section
      id="challenges"
      className="relative section-padding"
      aria-label="Engineering Challenges"
    >
      <div className="container-wide">
        <SectionHeading
          label={t("challenges.label")}
          title={t("challenges.title")}
          description={t("challenges.description")}
          className="mb-0!"
        />

        {/* Horizontal Row of 5 Cards */}
        <motion.div
          key={currentLang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6"
        >
          {challenges.map((item) => {
            const Icon = iconMap[item.id as keyof typeof iconMap] || FileEdit;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: isDark ? -6 : -2 }}
                transition={{ duration: 0.3 }}
                className="group relative glass rounded-2xl p-6 hover:border-accent/30 dark:hover:border-accent/30 light:hover:border-accent/50 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="text-start">
                  {/* Icon Frame */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                    style={{
                      background: isDark ? `${item.accent}15` : `rgba(139, 92, 246, 0.08)`,
                      color: isDark ? item.accent : `var(--accent)`,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Title — always English per Change 1 */}
                  <h3 className="font-display text-sm font-bold text-foreground mb-2.5 leading-snug">
                    {item.title}
                  </h3>

                  {/* Short description */}
                  <p className="text-[11px] text-muted leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                {/* Dialog Detail Trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setSelectedChallenge(item)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent hover:text-accent-hover transition-colors group cursor-pointer w-fit mt-auto"
                    >
                      {t("challenges.viewSolution")}
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </button>
                  </DialogTrigger>

                  {/* Dialog popup content
                      Change 2: wider (max-w-2xl), more padding
                      Change 3: dir prop drives RTL/LTR text + icon alignment
                      Change 5: mobile 92vw, vertically scrollable */}
                  <DialogContent
                    className="
                      max-w-2xl w-[92vw]
                      max-h-[90vh] overflow-y-auto
                      p-8 sm:p-10
                    "
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    {/* Ambient Background Glows */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/8 dark:bg-accent/5 blur-3xl" />
                      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent-secondary/8 dark:bg-accent-secondary/5 blur-3xl" />
                    </div>

                    {selectedChallenge && (
                      <div className="relative z-10 space-y-7">
                        {/* Header: icon + title */}
                        <DialogHeader className="space-y-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              background: isDark ? `${selectedChallenge.accent}18` : `rgba(139, 92, 246, 0.1)`,
                              color: isDark ? selectedChallenge.accent : `var(--accent)`,
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <DialogTitle className="text-xl sm:text-2xl font-display font-bold leading-snug">
                            {selectedChallenge.title}
                          </DialogTitle>
                        </DialogHeader>

                        {/* Change 4: section labels with divider + bolder styling */}
                        <div className="space-y-6 pt-5 border-t border-border">

                          {/* Challenge */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                              <Target
                                className="h-4 w-4 shrink-0"
                                style={{ color: isDark ? selectedChallenge.accent : `var(--accent)` }}
                              />
                              <h4
                                className="text-xs font-extrabold uppercase tracking-widest"
                                style={{ color: isDark ? selectedChallenge.accent : `var(--accent)` }}
                              >
                                {t("challenges.lblChallenge")}
                              </h4>
                            </div>
                            <p className="text-sm text-muted leading-relaxed">
                              {selectedChallenge.challenge}
                            </p>
                          </div>

                          {/* Solution */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                              <Wrench
                                className="h-4 w-4 shrink-0"
                                style={{ color: isDark ? selectedChallenge.accent : `var(--accent)` }}
                              />
                              <h4
                                className="text-xs font-extrabold uppercase tracking-widest"
                                style={{ color: isDark ? selectedChallenge.accent : `var(--accent)` }}
                              >
                                {t("challenges.lblSolution")}
                              </h4>
                            </div>
                            <p className="text-sm text-muted leading-relaxed">
                              {selectedChallenge.solution}
                            </p>
                          </div>

                          {/* Outcome */}
                          <div className="rounded-xl bg-emerald-500/5 dark:bg-emerald-500/8 border border-emerald-500/20 p-5 space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
                              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                              <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                {t("challenges.lblOutcome")}
                              </h4>
                            </div>
                            <p className="text-sm text-emerald-950 dark:text-emerald-100/90 leading-relaxed">
                              {selectedChallenge.outcome}
                            </p>
                          </div>

                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All button — centered below cards */}
        {/* <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            className="rounded-full border-border text-xs font-semibold text-muted hover:text-foreground dark:hover:bg-white/5 light:hover:bg-black/5 hover:border-accent/35 transition-colors px-6 py-2"
          >
            {t("challenges.btnViewAll")}
          </Button>
        </div> */}
      </div>
    </section>
  );
}
