import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Users, Zap, Map, FileText, Database, Globe, Grid, Menu,
  Monitor, Play, Check, Cpu, RotateCw, Code,
  ExternalLink, Github, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { caseStudiesData } from "@/data/caseStudiesData";
import { projectImages, type ProjectImages, type ProjectScreen } from "@/assets/projects/projectImages";
import { portfolioData } from "@/data/portfolioData";
import { useTheme } from "@/components/shared/ThemeContext";
import { SEO } from "@/components/SEO";

// ─── Icon map ────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users, zap: Zap, map: Map, file: FileText, database: Database,
  globe: Globe, grid: Grid, menu: Menu, monitor: Monitor, play: Play,
  check: Check, cpu: Cpu, refresh: RotateCw, code: Code,
};

// ─── Shared easing ───────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;

// ─── Shared fade-up variant ───────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.1 },
  }),
};

// ─── FadeUp wrapper ───────────────────────────────────────────────────────────
interface FadeUpProps { children: React.ReactNode; delay?: number }
const FadeUp: React.FC<FadeUpProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
    variants={fadeUp} custom={delay / 0.1} style={{ willChange: "transform, opacity" }}
  >
    {children}
  </motion.div>
);

// ─── CountUp ─────────────────────────────────────────────────────────────────
const CountUp: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1.8 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [displayValue, setDisplayValue] = useState("");
  const hasAnimated = useRef(false);
  const match = value.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    if (match) {
      hasAnimated.current = true;
      const prefix = match[1]; const targetNumber = parseInt(match[2], 10); const suffix = match[3];
      let startTime: number | null = null;
      const animate = (ts: number) => {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / (duration * 1000), 1);
        const eased = p * (2 - p);
        setDisplayValue(`${prefix}${Math.floor(eased * targetNumber)}${suffix}`);
        if (p < 1) requestAnimationFrame(animate); else setDisplayValue(value);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration, match]);

  if (!match) {
    const letters = value.split("");
    return (
      <span ref={ref} className="inline-block" dir="ltr">
        {letters.map((char, i) => (
          <motion.span key={i} initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }} className="inline-block">
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </span>
    );
  }
  return <span ref={ref}>{displayValue || `${match[1]}0${match[3]}`}</span>;
};

// ─── parseDeepDiveText ────────────────────────────────────────────────────────
const parseDeepDiveText = (text: string) => {
  const splitWords = [
    " chosen ", " selected ", " utilized ", " implemented ", " adopted ", " used ",
    " created ", " built ", " integrated ", " engineered ", " chosen over ",
    " تم اختيار ", " تم استخدام ", " تم اعتماد ", " تم تطوير ", " تم بناء ", " تم دمج "
  ];
  for (const word of splitWords) {
    const idx = text.indexOf(word);
    if (idx !== -1) return { title: text.slice(0, idx + word.length).trim(), desc: text.slice(idx + word.length).trim() };
  }
  const words = text.split(" ");
  if (words.length > 4) return { title: words.slice(0, 4).join(" "), desc: words.slice(4).join(" ") };
  return { title: text, desc: "" };
};

// ─── FeatureItem ─────────────────────────────────────────────────────────────
interface FeatureItem {
  type: string; title: string; desc: string; icon: string;
  challengeDetail: { solution: string } | null; imageIndex: number;
}

// ─── shared viewport preset ──────────────────────────────────────────────────
const vp = { once: true as const, amount: 0.25 };

// ─── ScreenshotFrame ─────────────────────────────────────────────────────────
// Renders a full-visible screenshot (objectFit: contain) in a dark stage.
interface ScreenshotFrameProps {
  src: string | undefined;
  alt: string;
  fallbackTitle: string;
  accentColor: string;
  isDark: boolean;
  delay?: number;
  borderRadius?: number;
}

const ScreenshotFrame: React.FC<ScreenshotFrameProps> = ({
  src, alt, fallbackTitle, accentColor, isDark, delay = 0, borderRadius = 16,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={vp}
    transition={{ duration: 0.8, ease, delay }}
    style={{
      width: "100%",
      borderRadius,
      overflow: "hidden",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
      boxShadow: isDark
        ? "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)"
        : "0 24px 64px rgba(0,0,0,0.14)",
      background: isDark ? "#080810" : "#f0f0f5",
    }}
  >
    {src ? (
      <img
        src={src} alt={alt} loading="lazy"
        style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
      />
    ) : (
      <div style={{
        aspectRatio: "16/10",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "0.75rem", padding: "3rem",
        background: `linear-gradient(135deg, ${accentColor}12 0%, transparent 100%)`,
      }}>
        <span style={{ color: accentColor, fontWeight: 700, fontSize: "1.1rem", textAlign: "center" }}>
          {fallbackTitle}
        </span>
      </div>
    )}
  </motion.div>
);

// ─── ProblemSection ───────────────────────────────────────────────────────────
// Editorial, no image. Sets the narrative context.
interface ProblemSectionProps {
  item: FeatureItem;
  accentColor: string;
  isDark: boolean;
  t: (key: string) => string;
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ item, accentColor, isDark, t }) => {
  const mutedText = isDark ? "rgba(255,255,255,0.58)" : "rgba(0,0,0,0.58)";
  return (
    <div style={{ paddingTop: "7rem", paddingBottom: "5rem", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}
      className="px-4 sm:px-8 lg:px-20">
      <div style={{ maxWidth: 760 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={vp} transition={{ duration: 0.55, ease }}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}
        >
          <div style={{ width: 28, height: 2, background: accentColor, borderRadius: 2, flexShrink: 0 }} />
          <span style={{
            fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase" as const, fontWeight: 700, color: accentColor,
          }}>
            {t("caseStudy.theChallenge") || "The Challenge"}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={vp} transition={{ duration: 0.65, ease, delay: 0.08 }}
          style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.08,
            letterSpacing: "-0.03em", color: isDark ? "#fff" : "#0f0f14",
            margin: "0 0 1.75rem",
          }}
        >
          {item.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={vp} transition={{ duration: 0.65, ease, delay: 0.18 }}
          style={{
            fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.9,
            color: mutedText, margin: 0,
          }}
        >
          {item.desc}
        </motion.p>
      </div>
    </div>
  );
};

// ─── FlagshipSection ──────────────────────────────────────────────────────────
// One per keychallenge. Alternates image-dominant vs content-dominant layouts.
interface FlagshipSectionProps {
  item: FeatureItem;
  index: number; // 0-based among flagship challenge sections
  projectAsset: ProjectImages | undefined;
  studyTitle: string;
  isDark: boolean;
  accentColor: string;
  t: (key: string) => string;
}

const FlagshipSection: React.FC<FlagshipSectionProps> = ({
  item, index, projectAsset, studyTitle, isDark, accentColor, t,
}) => {
  const imageOnLeft = index % 2 === 0;
  // Vary column ratio to break visual monotony
  const cols = imageOnLeft ? "58% 42%" : "40% 60%";
  const imageSrc = projectAsset?.screens[item.imageIndex]?.src;
  const mutedText = isDark ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.6)";
  const dimText  = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";

  const ImageEl = (
    <motion.div
      initial={{ opacity: 0, x: imageOnLeft ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={vp}
      transition={{ duration: 0.75, ease }}
    >
      <ScreenshotFrame
        src={imageSrc} alt={item.title}
        fallbackTitle={studyTitle}
        accentColor={accentColor} isDark={isDark}
        delay={0.05}
      />
    </motion.div>
  );

  const ContentEl = (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      {/* Label row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={vp} transition={{ duration: 0.5, ease, delay: 0.1 }}
        style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
      >
        <div style={{ width: 20, height: 2, background: accentColor, borderRadius: 2 }} />
        <span style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em",
          textTransform: "uppercase" as const, fontWeight: 700, color: accentColor,
        }}>
          {t("caseStudy.theChallenge") || "The Challenge"}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={vp} transition={{ duration: 0.6, ease, delay: 0.18 }}
        style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.6rem, 2.8vw, 2.5rem)", lineHeight: 1.12,
          letterSpacing: "-0.02em", color: isDark ? "#fff" : "#0f0f14", margin: 0,
        }}
      >
        {item.title}
      </motion.h3>

      {/* Problem */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={vp} transition={{ duration: 0.6, ease, delay: 0.26 }}
      >
        <span style={{
          display: "block", marginBottom: "0.45rem",
          fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const,
          fontWeight: 700, fontFamily: "monospace", color: dimText,
        }}>
          {t("caseStudy.problem") || "Problem"}
        </span>
        <p style={{ fontSize: "0.94rem", lineHeight: 1.82, color: mutedText, margin: 0 }}>
          {item.desc}
        </p>
      </motion.div>

      {/* Solution */}
      {item.challengeDetail && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={vp} transition={{ duration: 0.6, ease, delay: 0.36 }}
          style={{
            background: isDark ? `rgba(${hexToRgb(accentColor)},0.07)` : `rgba(${hexToRgb(accentColor)},0.05)`,
            border: `1px solid ${isDark ? `rgba(${hexToRgb(accentColor)},0.18)` : `rgba(${hexToRgb(accentColor)},0.14)`}`,
            borderRadius: 10, padding: "1rem 1.2rem",
          }}
        >
          <span style={{
            display: "block", marginBottom: "0.45rem",
            fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" as const,
            fontWeight: 700, fontFamily: "monospace", color: accentColor,
          }}>
            {t("caseStudy.howISolvedIt") || "How I Solved It"}
          </span>
          <p style={{
            fontSize: "0.88rem", lineHeight: 1.78, margin: 0,
            color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.66)",
          }}>
            {item.challengeDetail.solution}
          </p>
        </motion.div>
      )}
    </div>
  );

  return (
    <div style={{ paddingTop: "5rem", paddingBottom: "5rem", boxSizing: "border-box" }} className="px-4 sm:px-8 lg:px-20">
      {/* Desktop 2-col */}
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: cols, gap: "4.5rem", alignItems: "center" }}
      >
        {imageOnLeft ? <>{ImageEl}{ContentEl}</> : <>{ContentEl}{ImageEl}</>}
      </div>

      {/* Mobile stacked */}
      <div className="flex flex-col gap-7 md:hidden">
        {ImageEl}
        {ContentEl}
      </div>
    </div>
  );
};

// ─── HighlightCard ────────────────────────────────────────────────────────────
interface HighlightCardProps {
  icon: string;
  title: string;
  desc: string;
  index: number;
  isDark: boolean;
  accentColor: string;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ icon, title, desc, index, isDark, accentColor }) => {
  const IconComponent = iconMap[icon] || Code;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={vp}
      transition={{ duration: 0.45, ease, delay: index * 0.06 }}
      style={{
        padding: "1.5rem",
        borderRadius: 12,
        background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)",
        display: "flex", flexDirection: "column" as const, gap: "0.85rem",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `rgba(${hexToRgb(accentColor)},0.1)`,
        border: `1px solid rgba(${hexToRgb(accentColor)},0.18)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accentColor,
        flexShrink: 0,
      }}>
        <IconComponent className="h-4 w-4" />
      </div>
      <div>
        <p style={{
          fontSize: "0.875rem", fontWeight: 700, margin: "0 0 0.35rem",
          color: isDark ? "#fff" : "#0f0f14", lineHeight: 1.3,
        }}>
          {title}
        </p>
        <p style={{
          fontSize: "0.82rem", lineHeight: 1.7, margin: 0,
          color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

// ─── HighlightsGrid ───────────────────────────────────────────────────────────
// Compact multi-column grid for contributions and arch decisions.
interface HighlightsGridProps {
  contributionItems: FeatureItem[];
  archDecisions: string[];
  isDark: boolean;
  accentColor: string;
  t: (key: string) => string;
}

const HighlightsGrid: React.FC<HighlightsGridProps> = ({
  contributionItems, archDecisions, isDark, accentColor, t,
}) => {
  // Combine contributions + parsed arch decisions into a unified card list
  const cards: Array<{ icon: string; title: string; desc: string }> = [
    ...contributionItems.map(item => ({ icon: item.icon, title: item.title, desc: item.desc })),
    ...archDecisions.map(decision => {
      const parsed = parseDeepDiveText(decision);
      return { icon: "code", title: parsed.title, desc: parsed.desc };
    }),
  ];

  if (cards.length === 0) return null;

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "2rem", boxSizing: "border-box" }} className="px-4 sm:px-8 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={vp} transition={{ duration: 0.55, ease }}
        style={{ marginBottom: "2.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ width: 24, height: 2, background: accentColor, borderRadius: 2 }} />
          <span style={{
            fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase" as const, fontWeight: 700, color: accentColor,
          }}>
            {t("caseStudy.technicalStack") || "Engineering"}
          </span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1,
          letterSpacing: "-0.025em", color: isDark ? "#fff" : "#0f0f14",
          margin: 0,
        }}>
          {t("caseStudy.keyFeatures") || "Engineering Highlights"}
        </h2>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1.25rem",
      }}>
        {cards.map((card, i) => (
          <HighlightCard
            key={i} index={i}
            icon={card.icon} title={card.title} desc={card.desc}
            isDark={isDark} accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
};

// ─── CaseStudySections ────────────────────────────────────────────────────────
interface CaseStudySectionsProps {
  flagshipItems: FeatureItem[];       // problem statement + keyChallenges
  contributionItems: FeatureItem[];   // contributionBullets → highlights grid
  archDecisions: string[];            // raw arch decision strings → highlights grid
  projectAsset: ProjectImages | undefined;
  studyTitle: string;
  isDark: boolean;
  accentColor: string;
  t: (key: string) => string;
}

const CaseStudySections: React.FC<CaseStudySectionsProps> = ({
  flagshipItems, contributionItems, archDecisions, projectAsset, studyTitle, isDark, accentColor, t,
}) => {
  const [problemItem, ...challengeItems] = flagshipItems;

  return (
    <>
      {/* 1. Editorial problem statement */}
      {problemItem && (
        <ProblemSection
          item={problemItem}
          accentColor={accentColor} isDark={isDark} t={t}
        />
      )}

      {/* 2. Flagship challenge sections (image + challenge/solution) */}
      {challengeItems.map((item, i) => (
        <FlagshipSection
          key={i} item={item} index={i}
          projectAsset={projectAsset} studyTitle={studyTitle}
          isDark={isDark} accentColor={accentColor} t={t}
        />
      ))}

      {/* 3. Engineering highlights grid */}
      <HighlightsGrid
        contributionItems={contributionItems}
        archDecisions={archDecisions}
        isDark={isDark} accentColor={accentColor} t={t}
      />
    </>
  );
};

// ─── Bento span pattern (3-col grid, each row sums to 3) ─────────────────────
// Row 1: [2, 1]  Row 2: [1, 1, 1]  Row 3: [1, 2]  → repeats every 6 items
// ─── GalleryCard ─────────────────────────────────────────────────────────────
interface GalleryCardProps {
  screen: ProjectScreen;
  index: number;
  isDark: boolean;
  ratio?: string;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ screen, index, isDark, ratio = "16/9", onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={vp}
    transition={{ duration: 0.4, ease, delay: Math.min(index * 0.06, 0.36) }}
    onClick={onClick}
    className="group relative overflow-hidden cursor-pointer"
    style={{
      borderRadius: 14,
      background: isDark ? "#080810" : "#f0f0f5",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
      aspectRatio: ratio,
    }}
    whileHover={{ scale: 1.012, transition: { duration: 0.22, ease } }}
  >
    <img
      src={screen.src}
      alt={screen.label}
      loading="lazy"
      className="w-full h-full object-cover object-top block transition-transform duration-500 group-hover:scale-105"
    />
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }}
    >
      <p className="p-4 text-white text-xs font-semibold tracking-wide uppercase"
        style={{ letterSpacing: "0.1em" }}>
        {screen.label}
      </p>
    </div>
  </motion.div>
);

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  screens: ProjectScreen[];
  startIndex: number;
  accentColor: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ screens, startIndex, accentColor, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const total = screens.length;
  const screen = screens[current];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent(c => (c + 1) % total);
      if (e.key === "ArrowLeft")  setCurrent(c => (c - 1 + total) % total);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [total, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "1.25rem", right: "1.25rem",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "50%", width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#fff",
        }}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Image */}
      <div
        style={{ maxWidth: "88vw", maxHeight: "78vh", width: "100%", position: "relative" }}
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={screen.src}
            alt={screen.label}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
            style={{
              width: "100%", maxHeight: "78vh",
              objectFit: "contain", objectPosition: "center",
              borderRadius: 10, display: "block",
            }}
          />
        </AnimatePresence>
      </div>

      {/* Caption + counter */}
      <div
        style={{ marginTop: "1.25rem", textAlign: "center" }}
        onClick={e => e.stopPropagation()}
      >
        <p style={{ color: "rgba(255,255,255,0.88)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
          {screen.label}
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", fontFamily: "monospace" }}>
          <span style={{ color: accentColor }}>{String(current + 1).padStart(2, "0")}</span>
          {" / "}{String(total).padStart(2, "0")}
        </p>
      </div>

      {/* Prev / Next */}
      {total > 1 && (
        <div
          style={{
            position: "absolute", bottom: "1.75rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}
          onClick={e => e.stopPropagation()}
        >
          {[
            { label: "Prev", icon: <ChevronLeft className="h-4 w-4" />, action: () => setCurrent(c => (c - 1 + total) % total) },
            { label: "Next", icon: <ChevronRight className="h-4 w-4" />, action: () => setCurrent(c => (c + 1) % total) },
          ].map(({ label, icon, action }) => (
            <button key={label} onClick={action}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "0.45rem 1rem",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.8rem", fontWeight: 600,
              }}
            >
              {label === "Prev" && icon}{label}{label === "Next" && icon}
            </button>
          ))}
        </div>
      )}
    </motion.div>,
    document.body
  );
};

// ─── ProductGallery ───────────────────────────────────────────────────────────
interface ProductGalleryProps {
  screens: ProjectScreen[];
  studyTitle: string;
  isDark: boolean;
  accentColor: string;
  t: (key: string) => string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  screens, studyTitle, isDark, accentColor, t,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (screens.length === 0) return null;

  return (
    <div style={{ padding: "4rem 0 2rem", boxSizing: "border-box" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={vp} transition={{ duration: 0.55, ease }}
        style={{ marginBottom: "2rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
          <div style={{ width: 24, height: 2, background: accentColor, borderRadius: 2 }} />
          <span style={{
            fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase" as const, fontWeight: 700, color: accentColor,
          }}>
            {t("caseStudy.gallery") || "Product Gallery"}
          </span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.1,
          letterSpacing: "-0.025em", color: isDark ? "#fff" : "#0f0f14",
          margin: 0,
        }}>
          {studyTitle}
        </h2>
      </motion.div>

      {/* Gallery: hero first image full-width, then 2-col grid */}
      <div className="flex flex-col gap-3 md:gap-4">
        {screens.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 md:gap-4">
            {screens.map((screen, i) => (
              <GalleryCard
                key={i}
                screen={screen}
                index={i}
                isDark={isDark}
                ratio="16/10"
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            screens={screens}
            startIndex={lightboxIndex}
            accentColor={accentColor}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── hex → "r,g,b" ───────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean, 16);
  return `${(num >> 16) & 255},${(num >> 8) & 255},${num & 255}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CaseStudyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentLang = i18n.language || "en";
  const isRtl = currentLang === "ar";
  const study = caseStudiesData[currentLang]?.[id || ""];

  const [hoveredCard, setHoveredCard] = useState<"prev" | "next" | null>(null);

  useEffect(() => {
    if (!study) {
      navigate(currentLang === "ar" ? "/ar#projects" : "/#projects", { replace: true });
    }
  }, [study, navigate, currentLang]);

  if (!study) return null;

  const projectIds = ["wms", "ertiqaa-academy", "web-point-erp", "haya-academy", "mrs-ayat-asaad"];
  const currentIndex = projectIds.indexOf(study.id);
  const prevProject = caseStudiesData[currentLang]?.[projectIds[(currentIndex - 1 + projectIds.length) % projectIds.length]]
    || caseStudiesData["en"][projectIds[(currentIndex - 1 + projectIds.length) % projectIds.length]];
  const nextProject = caseStudiesData[currentLang]?.[projectIds[(currentIndex + 1) % projectIds.length]]
    || caseStudiesData["en"][projectIds[(currentIndex + 1) % projectIds.length]];

  const projectData = portfolioData.projects.find(p => p.id === study.id);
  const accentColor = projectData?.accent || "#a855f7";
  const dir = isRtl ? -1 : 1;

  const projectAsset = projectImages.find(p => p.id === study.id);
  const laptopCover = projectAsset?.cover || "";

  // Flagship: problem statement + key challenges (narrative storytelling sections)
  const flagshipItems: FeatureItem[] = [
    {
      type: "challenge",
      title: currentLang === "ar" ? "بيان المشكلة" : "Problem Statement",
      desc: study.challengeText,
      icon: "zap",
      challengeDetail: null,
      imageIndex: 0,
    },
    ...study.keyChallenges.slice(0, 3).map((challenge, idx) => {
      const screensCount = projectAsset?.screens.length ?? 1;
      return {
        type: "challenge",
        title: challenge.title,
        desc: challenge.desc,
        icon: "zap",
        challengeDetail: { solution: challenge.solution },
        imageIndex: challenge.imageIndex ?? (idx + 4) % screensCount,
      };
    }),
  ];

  // Highlights: what was built + arch decisions → compact grid
  const contributionItems: FeatureItem[] = study.contributionBullets.map((bullet, idx) => ({
    type: "contribution",
    title: bullet.title,
    desc: bullet.desc,
    icon: bullet.icon,
    challengeDetail: null,
    imageIndex: idx + 1,
  }));

  const titleWords = study.title.split(" ");
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const titleWord = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const resultIcons = [Zap, Users, Check];

  const taglineDelay = 0.1 + (titleWords.length - 1) * 0.08 + 0.15;
  const buttonsDelay = taglineDelay + 0.15;
  const metaDelay = taglineDelay + 0.2;

  const hasLiveUrl = study.liveUrl && study.liveUrl !== "#";
  const hasGithubUrl = study.githubUrl && study.githubUrl !== "#";
  const hasButtons = hasLiveUrl || hasGithubUrl;

  const bgGrid = {
    backgroundImage: isDark
      ? "radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)"
      : "radial-gradient(rgba(0,0,0,0.035) 1px,transparent 1px)",
    backgroundSize: "24px 24px",
  };

  const frameBg = isDark ? "#1a1a2e" : "#e0e0e8";
  const barBg = isDark ? "#12121a" : "#d0d0da";

  // ─── SEO ─────────────────────────────────────────────────────────────────────
  const BASE_URL = "https://ibrahimfares.dev";
  const seoTitle = isRtl
    ? `دراسة حالة: ${study.title} | إبراهيم فارس`
    : `${study.title} — Case Study | Ibrahim Fares`;
  const techPreview = study.techStack.slice(0, 4).join(", ");
  const seoDescription = isRtl
    ? `${study.tagline} التقنيات: ${techPreview}`
    : `${study.tagline} Built with: ${techPreview}`;
  const seoImage = projectAsset?.cover || `${BASE_URL}/og-image.jpg`;
  const seoUrl = `${BASE_URL}${isRtl ? "/ar" : ""}/projects/${study.id}`;
  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.tagline,
    author: { "@type": "Person", name: "Ibrahim Fares", url: BASE_URL },
    url: seoUrl,
    keywords: study.techStack.join(", "),
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground relative transition-colors duration-300"
      dir={isRtl ? "rtl" : "ltr"}
      style={bgGrid}
    >
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
        type="article"
        jsonLd={caseStudyJsonLd}
      />

      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-screen pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[150px] animate-pulse"
          style={{ backgroundImage: `radial-gradient(circle,${accentColor} 0%,transparent 70%)`, opacity: isDark ? 0.12 : 0.06, animationDuration: "8s" }} />
        <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[130px] animate-pulse"
          style={{ backgroundImage: "radial-gradient(circle,#a855f7 0%,transparent 70%)", opacity: isDark ? 0.15 : 0.05, animationDuration: "12s" }} />
      </div>

      <div className="container-wide px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════ */}
        <section className="relative pt-28 pb-12">

          <div className="mb-8">
            <Link
              to={currentLang === "ar" ? "/ar#projects" : "/#projects"}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-accent transition-colors cursor-pointer group"
            >
              {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              <span className="group-hover:underline">{t("caseStudy.backToProjects")}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh]">

            {/* LEFT: Content */}
            <div className="flex flex-col gap-6 text-center lg:text-start order-1">

              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0 }}
                className="flex justify-center lg:justify-start"
              >
                <span
                  className="inline-block px-3 py-1 rounded-full font-mono text-[11px] uppercase font-semibold"
                  style={{
                    letterSpacing: "0.15em",
                    background: `rgba(${hexToRgb(accentColor)}, 0.08)`,
                    border: `1px solid rgba(${hexToRgb(accentColor)}, 0.25)`,
                    color: accentColor,
                  }}
                >
                  {study.category}
                </span>
              </motion.div>

              <motion.h1
                variants={titleContainer} initial="hidden" animate="visible"
                className="font-display font-extrabold tracking-tight dark:text-white text-[#0f0f14]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
              >
                {titleWords.map((word, i) => (
                  <motion.span key={i} variants={titleWord} className="inline-block mr-[0.25em] rtl:ml-[0.25em]">
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: taglineDelay }}
                style={{
                  fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 480,
                  color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
                }}
                className="mx-auto lg:mx-0"
              >
                {study.tagline}
              </motion.p>

              {hasButtons && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: buttonsDelay }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
                >
                  {hasLiveUrl && (
                    <a href={study.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
                      style={{
                        padding: "0.75rem 1.5rem", borderRadius: 6,
                        background: accentColor, color: "#fff",
                        fontSize: 14, fontWeight: 600,
                        boxShadow: `0 4px 20px rgba(${hexToRgb(accentColor)},0.3)`,
                      }}>
                      {t("caseStudy.liveProject")} <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {hasGithubUrl && (
                    <a href={study.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:opacity-80"
                      style={{
                        padding: "0.75rem 1.5rem", borderRadius: 6,
                        background: "transparent",
                        border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.15)",
                        color: isDark ? "#fff" : "#0f0f14",
                        fontSize: 14, fontWeight: 600,
                      }}>
                      {t("caseStudy.viewOnGithub")} <Github className="h-4 w-4" />
                    </a>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: metaDelay }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2"
              >
                {[
                  { label: t("caseStudy.role"), value: study.role },
                  { label: t("caseStudy.year"), value: study.year },
                  { label: t("caseStudy.type"), value: study.category },
                  { label: t("caseStudy.status"), value: study.status === "Live" ? t("caseStudy.live") : study.status },
                ].map((meta, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", fontSize: 13 }}>|</span>
                    )}
                    <div className="flex items-center gap-1 font-mono" style={{ fontSize: 13 }}>
                      <span style={{ color: accentColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>{meta.label}:</span>
                      <span className="dark:text-white text-[#0f0f14]">{meta.value}</span>
                    </div>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Laptop mockup */}
            <div className="flex items-center justify-center order-2">
              <motion.div
                initial={{ opacity: 0, y: 60, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                style={{
                  perspective: 1200,
                  transformStyle: "preserve-3d",
                  transformOrigin: "center bottom",
                  width: "100%",
                  maxWidth: 560,
                }}
              >
                <div style={{
                  background: frameBg,
                  borderRadius: "12px 12px 4px 4px",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: isDark ? "0 40px 80px rgba(0,0,0,0.5)" : "0 30px 60px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: 32, background: barBg,
                    display: "flex", alignItems: "center",
                    padding: "0 12px", gap: 6,
                  }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <div style={{
                        width: "40%", height: 14, borderRadius: 100,
                        background: "rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{
                          fontFamily: "monospace", fontSize: 10,
                          color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                          overflow: "hidden", maxWidth: "90%", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {study.id}.com
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ aspectRatio: "16/10", overflow: "hidden", background: "#0a0a14" }}>
                    {laptopCover ? (
                      <img
                        src={laptopCover} alt={study.title} loading="eager"
                        style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", objectPosition: "top center" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="font-display font-bold text-accent text-xl select-none">{study.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  width: "85%", margin: "0 auto", height: 18,
                  background: frameBg,
                  borderRadius: "0 0 6px 6px",
                  clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
                }} />

                <div style={{
                  width: 60, height: 10,
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  borderRadius: 3,
                  margin: "4px auto 0",
                }} />
              </motion.div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — SCROLL-DRIVEN CASE STUDY SECTIONS
        ═══════════════════════════════════════════════════════ */}
        <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 mt-8">
          <CaseStudySections
            flagshipItems={flagshipItems}
            contributionItems={contributionItems}
            archDecisions={study.archDecisions}
            projectAsset={projectAsset}
            studyTitle={study.title}
            isDark={isDark}
            accentColor={accentColor}
            t={t}
          />
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3 — TECHNICAL STACK
        ═══════════════════════════════════════════════════════ */}
        <FadeUp delay={0}>
          <section className="space-y-6 text-start mt-20 lg:mt-32">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                {t("caseStudy.technicalStack")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
                {t("caseStudy.technicalStack")}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {study.techStack.map((tech, i) => {
                return (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="inline-flex items-center gap-1.5 cursor-default select-none"
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    whileHover={{
                      borderColor: accentColor,
                      backgroundColor: `rgba(${hexToRgb(accentColor)},0.08)`,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {tech}
                  </motion.div>
                );
              })}
            </div>
          </section>
        </FadeUp>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4 — RESULTS & IMPACT
        ═══════════════════════════════════════════════════════ */}
        <section className="space-y-8 text-start mt-20 lg:mt-32">
          <FadeUp delay={0}>
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-accent uppercase block">
                {t("caseStudy.resultsAndImpact")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
                {t("caseStudy.resultsAndImpact")}
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {study.metrics.map((metric, i) => {
              const MetricIcon = resultIcons[i] || Check;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.12 }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${hexToRgb(accentColor)},0.3)`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
                  }}
                  className="p-6 rounded-xl flex flex-col text-start relative overflow-hidden transition-all duration-300"
                  style={{
                    willChange: "transform, opacity",
                    background: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.06)",
                  }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(to right,${accentColor},var(--accent-secondary))` }} />
                  <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/10 text-accent self-start mb-4">
                    <MetricIcon className="w-5 h-5" />
                  </div>
                  <span className="font-sans font-black bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent mb-2 tracking-tight block select-none"
                    style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)" }}>
                    <CountUp value={metric.value} />
                  </span>
                  <span className="font-medium dark:text-white text-[#0f0f14] mb-1" style={{ fontSize: "1rem" }}>
                    {metric.label}
                  </span>
                  <span className="leading-relaxed"
                    style={{ fontSize: "0.82rem", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                    {metric.desc}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 5 — PRODUCT GALLERY
        ═══════════════════════════════════════════════════════ */}
        {projectAsset && projectAsset.screens.length > 0 && (
          <section className="mt-20 lg:mt-32">
            <ProductGallery
              screens={projectAsset.screens}
              studyTitle={study.title}
              isDark={isDark}
              accentColor={accentColor}
              t={t}
            />
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 6 — BOTTOM NAVIGATION
        ═══════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 mt-20 pb-16 border-t"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)" }}>

          <motion.div
            initial={{ opacity: 0, x: -30 * dir }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="w-full flex h-[140px]"
          >
            <Link to={`/${currentLang === "ar" ? "ar/" : ""}projects/${prevProject.id}`}
              onMouseEnter={() => setHoveredCard("prev")} onMouseLeave={() => setHoveredCard(null)}
              className="p-6 rounded-2xl transition-all duration-300 text-start flex flex-col justify-between group w-full h-full"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                border: `1px solid ${hoveredCard === "prev" ? accentColor : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
              }}>
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300"
                style={{ color: hoveredCard === "prev" ? accentColor : isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1">←</span>
                {t("caseStudy.previousProject")}
              </span>
              <div>
                <h4 className="text-lg font-bold dark:text-white text-[#0f0f14] group-hover:text-accent transition-colors duration-300">
                  {prevProject.title}
                </h4>
                <p className="text-xs tracking-wider uppercase font-semibold" style={{ color: accentColor, fontSize: "12px" }}>
                  {prevProject.category}
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 * dir }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="w-full flex h-[140px]"
          >
            <Link to={`/${currentLang === "ar" ? "ar/" : ""}projects/${nextProject.id}`}
              onMouseEnter={() => setHoveredCard("next")} onMouseLeave={() => setHoveredCard(null)}
              className="p-6 rounded-2xl transition-all duration-300 text-start flex flex-col justify-between group w-full h-full"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                border: `1px solid ${hoveredCard === "next" ? accentColor : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
              }}>
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300 self-start sm:self-end"
                style={{ color: hoveredCard === "next" ? accentColor : isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                {t("caseStudy.nextProject")}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
              </span>
              <div className="sm:text-end">
                <h4 className="text-lg font-bold dark:text-white text-[#0f0f14] group-hover:text-accent transition-colors duration-300">
                  {nextProject.title}
                </h4>
                <p className="text-xs tracking-wider uppercase font-semibold" style={{ color: accentColor, fontSize: "12px" }}>
                  {nextProject.category}
                </p>
              </div>
            </Link>
          </motion.div>

        </section>

      </div>
    </div>
  );
}
