import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Calendar, Briefcase, Code, Network, Download } from "lucide-react";
import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { Particles } from "@/components/shared/Particles";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useTheme } from "@/components/shared/ThemeContext";
import { portfolioData } from "@/data/portfolioData";
import characterPng from "@/assets/character.png";
import characterWebP from "@/assets/character.webp";
import character400Png from "@/assets/character-400.png";
import character400WebP from "@/assets/character-400.webp";
import character800Png from "@/assets/character-800.png";
import character800WebP from "@/assets/character-800.webp";
import character1200Png from "@/assets/character-1200.png";
import character1200WebP from "@/assets/character-1200.webp";
import cvPdf from "@/assets/Ibrahim_Fares_CV.pdf";
import { useTranslation } from "react-i18next";

// Responds to viewport resize and prefers-reduced-motion
function useReducedHeroAnimations() {
  const [shouldAnimate, setShouldAnimate] = React.useState(
    () =>
      window.innerWidth >= 768 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setShouldAnimate(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return shouldAnimate;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const visibleVariant = { opacity: 1, y: 0 };

const iconMap = [Calendar, Briefcase, Network, Code];

export function HeroSection() {
  const shouldAnimate = useReducedHeroAnimations();
  const { x, y } = useMouseParallax(0.015);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const isRtl = currentLang === "ar";

  const cvFile = cvPdf;
  const cvFileName = "Ibrahim_Fares_CV.pdf";

  const statsData = portfolioData.stats.map((stat, idx) => ({
    icon: iconMap[idx] || Code,
    value: stat.value,
    suffix: stat.suffix,
    label: t(`hero.stats.${idx}`),
  }));

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-32 pb-16"
        aria-label="Hero"
      >
        <AuroraBackground />
        <Particles count={60} />

        <div className="container-wide px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center [direction:ltr]">
            {/* Left Text Column */}
            <div
              className="flex flex-col lg:col-span-7"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <m.div
                key={currentLang}
                variants={shouldAnimate ? containerVariants : undefined}
                initial={shouldAnimate ? "hidden" : false}
                animate={shouldAnimate ? "visible" : false}
                className="flex flex-col text-start"
              >
                <m.div
                  variants={shouldAnimate ? itemVariants : undefined}
                  initial={shouldAnimate ? undefined : visibleVariant}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    {t("hero.title")}
                  </span>
                </m.div>

                <m.h1
                  variants={shouldAnimate ? itemVariants : undefined}
                  initial={shouldAnimate ? undefined : visibleVariant}
                  className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] glow-text"
                >
                  <span className="text-foreground">{t("hero.firstName")}</span>
                  <br />
                  <span className="text-gradient-accent">
                    {t("hero.lastName")}
                  </span>
                </m.h1>

                <m.p
                  variants={shouldAnimate ? itemVariants : undefined}
                  initial={shouldAnimate ? undefined : visibleVariant}
                  className="mt-6 text-[3.6vw] sm:text-lg md:text-xl text-muted max-w-xl leading-relaxed text-start"
                >
                  {t("hero.tagline")}
                </m.p>

                <m.div
                  variants={shouldAnimate ? itemVariants : undefined}
                  initial={shouldAnimate ? undefined : visibleVariant}
                  className="mt-10 flex flex-nowrap gap-3 items-center"
                >
                  <MagneticButton
                    asChild
                    size="lg"
                    className="rounded-full px-5 py-2.5 text-sm sm:px-7 sm:py-3 sm:text-base"
                  >
                    <a href="#projects" className="flex items-center gap-2">
                      {t("hero.viewWork")}{" "}
                      <span className="text-sm rtl:rotate-180">→</span>
                    </a>
                  </MagneticButton>
                  <MagneticButton
                    variant="outline"
                    size="lg"
                    className="rounded-full border-border text-foreground/80 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 hover:border-accent/30 transition-all duration-300 px-5 py-2.5 text-sm sm:px-7 sm:py-3 sm:text-base"
                    asChild
                  >
                    <a
                      href={cvFile}
                      download={cvFileName}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {t("hero.downloadCv")}
                    </a>
                  </MagneticButton>
                </m.div>

                {/* Scroll Down Indicator */}
                <m.div
                  variants={shouldAnimate ? itemVariants : undefined}
                  initial={shouldAnimate ? undefined : visibleVariant}
                  className="mt-12 hidden lg:flex items-center gap-3 text-muted/60"
                >
                  <div className="w-6 h-10 rounded-full border border-muted/30 flex items-start justify-center p-1.5">
                    <m.div
                      animate={shouldAnimate ? { y: [0, 12, 0] } : { y: 6 }}
                      transition={
                        shouldAnimate
                          ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                          : undefined
                      }
                      className="w-1 h-2 rounded-full bg-accent"
                    />
                  </div>
                  <span className="text-[11px] font-medium tracking-widest uppercase">
                    {t("hero.scrollDown")}
                  </span>
                </m.div>
              </m.div>
            </div>

            {/* Right Avatar Scene Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
              {/* Parallax Container — mouse parallax only on desktop */}
              <m.div
                style={
                  shouldAnimate
                    ? { x: Math.round(x * 1.2), y: Math.round(y * 1.2) }
                    : undefined
                }
                className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center"
              >
                {/* Outer Pulsing Glow Circular Frame */}
                <div
                  className={`absolute inset-4 rounded-full bg-gradient-to-br to-transparent transition-all duration-700 ${
                    isDark
                      ? "from-accent/12 via-accent-secondary/8 blur-[50px] opacity-70 animate-pulse"
                      : "from-accent/5 via-accent-secondary/2 blur-[60px] opacity-50 animate-pulse"
                  }`}
                />

                {/* Glowing Outline Ring 1 */}
                <m.div
                  animate={shouldAnimate ? { rotate: 360 } : undefined}
                  transition={
                    shouldAnimate
                      ? { duration: 60, repeat: Infinity, ease: "linear" }
                      : undefined
                  }
                  className={`absolute inset-0 rounded-full border border-dashed transition-all duration-700 ${
                    isDark
                      ? "border-accent/10 opacity-30"
                      : "border-accent/5 opacity-20"
                  }`}
                />

                {/* Glowing Outline Ring 2 */}
                <m.div
                  animate={shouldAnimate ? { rotate: -360 } : undefined}
                  transition={
                    shouldAnimate
                      ? { duration: 40, repeat: Infinity, ease: "linear" }
                      : undefined
                  }
                  className={`absolute inset-4 rounded-full border transition-all duration-700 ${
                    isDark
                      ? "border-accent/5 border-t-accent/15 border-b-accent-secondary/15"
                      : "border-accent/5 opacity-20"
                  }`}
                />

                {/* Character Image */}
                <m.div
                  initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
                  animate={shouldAnimate ? { opacity: 1, scale: 1 } : false}
                  transition={
                    shouldAnimate ? { duration: 1, ease: "easeOut" } : undefined
                  }
                  className="relative z-10 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border border-white/10 dark:border-white/10 light:border-black/5 shadow-xl shadow-black/5 dark:shadow-black/20 bg-gradient-to-b from-white/5 to-white/[0.02] dark:from-white/5 dark:to-white/[0.02] light:from-black/[0.02] light:to-black/[0.005]"
                >
                  <picture className="w-full h-full">
                    <source
                      type="image/webp"
                      srcSet={`${character400WebP} 400w, ${character800WebP} 800w, ${character1200WebP} 1200w, ${characterWebP} 2048w`}
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 360px, 400px"
                    />
                    <source
                      type="image/png"
                      srcSet={`${character400Png} 400w, ${character800Png} 800w, ${character1200Png} 1200w, ${characterPng} 2048w`}
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 360px, 400px"
                    />
                    <img
                      src={characterPng}
                      alt="Ibrahim Fares Character"
                      fetchPriority="high"
                      className="w-full h-full object-cover object-center sharp-image"
                      loading="eager"
                    />
                  </picture>
                </m.div>

                {/* Floating Badge 1: React (Top Left) */}
                <m.div
                  animate={shouldAnimate ? { y: [0, -8, 0] } : undefined}
                  transition={
                    shouldAnimate
                      ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                  }
                  style={
                    shouldAnimate ? { x: x * -1.5, y: y * -1.5 } : undefined
                  }
                  className={`absolute top-12 left-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500 ${
                    isDark
                      ? "glass border-sky-400/20 text-sky-400 shadow-[0_4px_12px_rgba(56,189,248,0.15)] font-semibold"
                      : "bg-white border-slate-200/80 text-sky-600 shadow-sm font-semibold"
                  } text-xs`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-pulse" />
                  React
                </m.div>

                {/* Floating Badge 2: TypeScript (Mid Left) */}
                <m.div
                  animate={shouldAnimate ? { y: [0, 8, 0] } : undefined}
                  transition={
                    shouldAnimate
                      ? {
                          duration: 4.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5,
                        }
                      : undefined
                  }
                  style={shouldAnimate ? { x: x * -2, y: y * -2 } : undefined}
                  className={`absolute top-1/2 -left-8 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500 ${
                    isDark
                      ? "glass border-blue-500/20 text-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.15)] font-semibold"
                      : "bg-white border-slate-200/80 text-blue-600 shadow-sm font-semibold"
                  } text-xs`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                  TypeScript
                </m.div>

                {/* Floating Badge 3: Logo Chip (Bottom Left) */}
                <m.div
                  animate={
                    shouldAnimate
                      ? { scale: [1, 1.05, 1], rotate: [0, 10, -10, 0] }
                      : undefined
                  }
                  transition={
                    shouldAnimate
                      ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                  }
                  style={shouldAnimate ? { x: x * -1, y: y * -1 } : undefined}
                  className={`absolute bottom-16 left-4 z-20 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${
                    isDark
                      ? "glass border-accent/20 text-accent font-bold text-xs"
                      : "bg-white border-slate-200/80 text-slate-700 shadow-sm font-semibold text-xs"
                  }`}
                >
                  JS
                </m.div>

                {/* Floating Badge 4: Code Symbol (Top Right) */}
                <m.div
                  animate={shouldAnimate ? { y: [0, -6, 0] } : undefined}
                  transition={
                    shouldAnimate
                      ? {
                          duration: 3.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2,
                        }
                      : undefined
                  }
                  style={
                    shouldAnimate ? { x: x * 1.5, y: y * 1.5 } : undefined
                  }
                  className={`absolute top-10 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-500 ${
                    isDark
                      ? "glass border-accent-secondary/30 text-accent-secondary font-bold text-sm shadow-[0_4px_12px_rgba(192,132,252,0.15)]"
                      : "bg-white border-slate-200/80 text-accent font-bold text-sm shadow-sm"
                  }`}
                >
                  &lt;/&gt;
                </m.div>

                {/* Floating Badge 5: Commits Chart Widget (Bottom Right) */}
                <m.div
                  animate={shouldAnimate ? { y: [0, 10, 0] } : undefined}
                  transition={
                    shouldAnimate
                      ? {
                          duration: 4.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.8,
                        }
                      : undefined
                  }
                  style={shouldAnimate ? { x: x * 2, y: y * 2 } : undefined}
                  className="absolute bottom-8 -right-8 z-20 glass rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200/80 p-3 w-[120px] shadow-sm text-left"
                >
                  <div className="flex flex-col gap-2">
                    <div className="h-1.5 w-full bg-accent/40 rounded-full overflow-hidden">
                      <div className="h-full w-[75%] bg-accent rounded-full" />
                    </div>
                    <div className="h-1.5 w-full bg-accent-secondary/40 rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-accent-secondary rounded-full" />
                    </div>
                    <div className="h-1.5 w-full bg-accent-tertiary/40 rounded-full overflow-hidden">
                      <div className="h-full w-[90%] bg-accent-tertiary rounded-full" />
                    </div>
                    <div className="h-1.5 w-full bg-emerald-500/40 rounded-full overflow-hidden">
                      <div className="h-full w-[60%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </m.div>
              </m.div>
            </div>
          </div>

          {/* Stats Section */}
          <m.div
            initial={shouldAnimate ? { opacity: 0, y: 40 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
            transition={
              shouldAnimate
                ? { duration: 0.8, delay: 0.8, ease: "easeOut" }
                : undefined
            }
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-20"
          >
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative glass rounded-2xl p-6 md:p-8 hover:border-accent/30 dark:hover:border-accent/30 light:hover:border-accent/50 transition-all duration-500 overflow-hidden"
                >
                  {/* Accent glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative flex flex-col items-start text-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-display text-3xl md:text-4xl font-bold text-gradient-accent">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="mt-2 text-xs md:text-sm text-muted font-medium tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
