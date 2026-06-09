import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import {
  ClipboardList,
  Map,
  Layout,
  Database,
  Plug,
  Zap,
  Rocket,
} from "lucide-react";
import { architectureSteps } from "@/data/content";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTheme } from "@/components/shared/ThemeContext";

const iconMap = {
  clipboard: ClipboardList,
  map: Map,
  layout: Layout,
  database: Database,
  plug: Plug,
  zap: Zap,
  rocket: Rocket,
} as const;

gsap.registerPlugin(ScrollTrigger);

export function ArchitectureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const totalSteps = architectureSteps.length;
            const activeStep = Math.floor(progress * (totalSteps + 1)) - 1;
            setActiveIndex(Math.min(activeStep, totalSteps - 1));
          },
        },
      });

      architectureSteps.forEach((_, i) => {
        const node = nodesRef.current[i];
        if (!node) return;

        gsap.fromTo(
          node,
          { scale: 0.85, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Map dynamic translation values for workflow Roadmap steps
  const steps = architectureSteps.map((step, idx) => {
    const keys = [
      "requirements",
      "planning",
      "uiArchitecture",
      "stateManagement",
      "apiIntegration",
      "optimization",
      "deployment",
    ];
    const stepKey = keys[idx];
    return {
      ...step,
      title: t(`howIThink.steps.${stepKey}.title`),
      description: t(`howIThink.steps.${stepKey}.description`),
    };
  });

  return (
    <section
      id="how-i-think"
      className="relative section-padding overflow-hidden bg-alt-background/40 dark:bg-transparent transition-colors duration-700"
      aria-label="Architecture Thinking"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="container-wide relative z-10" ref={containerRef}>
        <SectionHeading
          label={t("howIThink.label")}
          title={t("howIThink.title")}
          description={t("howIThink.description")}
          align="center"
        />

        <div className="relative mt-20 xl:mt-28 w-full">
          {/* Connecting SVG Wavy Path for Desktop - Flipped horizontally on dir=rtl */}
          <div className="absolute top-1/2 left-0 w-full h-[80px] -translate-y-[100px] hidden lg:block pointer-events-none">
            <svg
              viewBox="0 0 1200 100"
              fill="none"
              preserveAspectRatio="none"
              className={`w-full h-full transition-opacity duration-700 rtl:scale-x-[-1] ${isDark ? "opacity-60" : "opacity-25"}`}
            >
              {/* Background Path (Dotted/Dashed) */}
              <path
                d="M 50 50 C 200 120, 250 -20, 400 50 C 550 120, 650 -20, 800 50 C 950 120, 1050 -20, 1150 50"
                stroke={
                  isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(139, 92, 246, 0.08)"
                }
                strokeWidth="4"
                strokeDasharray="6,6"
              />
              {/* Active Animated Path */}
              <path
                ref={pathRef}
                d="M 50 50 C 200 120, 250 -20, 400 50 C 550 120, 650 -20, 800 50 C 950 120, 1050 -20, 1150 50"
                stroke="url(#roadmap-glow-gradient)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="roadmap-glow-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="50%" stopColor="var(--accent-secondary)" />
                  <stop offset="100%" stopColor="var(--accent-tertiary)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Roadmap Grid / Flex Row */}
          <motion.div
            key={currentLang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-4 relative"
          >
            {steps.map((step, i) => {
              const Icon = iconMap[step.icon];
              const isActive = i <= activeIndex;

              return (
                <div
                  key={step.title}
                  ref={(el) => {
                    nodesRef.current[i] = el;
                  }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Node Circle */}
                  <motion.div
                    whileHover={{ scale: isDark ? 1.08 : 1.02 }}
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500 cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-background bg-gradient-to-br from-accent/20 to-accent-secondary/15 border-accent shadow-[0_0_30px_rgba(129,140,248,0.4)]"
                          : "bg-background bg-gradient-to-br from-accent/15 to-accent-secondary/10 border-accent shadow-[0_4px_20px_rgba(139,92,246,0.1)]"
                        : "bg-background border-border hover:border-accent/30"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 transition-all duration-500 ${
                        isActive
                          ? "text-accent scale-110"
                          : "text-muted group-hover:text-foreground"
                      }`}
                    />

                    {/* Glowing outer core */}
                    {isActive && isDark && (
                      <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-30" />
                    )}
                  </motion.div>

                  {/* Step Index Number */}
                  <span
                    className={`mt-4 font-mono text-[11px] transition-colors duration-500 ${
                      isActive ? "text-accent font-semibold" : "text-muted/60"
                    }`}
                  >
                    0{i + 1}
                  </span>

                  {/* Step Title */}
                  <h3
                    className={`mt-2 font-display text-sm font-bold tracking-tight transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p
                    className={`mt-3 text-xs leading-relaxed max-w-[200px] transition-all duration-500 ${
                      isActive
                        ? "text-muted/90"
                        : "text-muted/40 group-hover:text-muted/70"
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Small connector line for mobile */}
                  {i < architectureSteps.length - 1 && (
                    <div className="w-px h-8 bg-border md:hidden my-4" />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
