import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useLenis } from "@/hooks/useLenis";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { SEO } from "@/components/SEO";

const AboutSection = lazy(() =>
  import("@/components/sections/AboutSection").then((m) => ({
    default: m.AboutSection,
  })),
);
const TechArsenalSection = lazy(() =>
  import("@/components/sections/TechArsenalSection").then((m) => ({
    default: m.TechArsenalSection,
  })),
);
const CareerJourneySection = lazy(() =>
  import("@/components/sections/CareerJourneySection").then((m) => ({
    default: m.CareerJourneySection,
  })),
);
const ProjectsSection = lazy(() =>
  import("@/components/sections/ProjectsSection").then((m) => ({
    default: m.ProjectsSection,
  })),
);
const ArchitectureSection = lazy(() =>
  import("@/components/sections/ArchitectureSection").then((m) => ({
    default: m.ArchitectureSection,
  })),
);
const ChallengesSection = lazy(() =>
  import("@/components/sections/ChallengesSection").then((m) => ({
    default: m.ChallengesSection,
  })),
);
const ContactSection = lazy(() =>
  import("@/components/sections/ContactSection").then((m) => ({
    default: m.ContactSection,
  })),
);
const CaseStudyView = lazy(() =>
  import("@/components/sections/CaseStudyView").then((m) => ({
    default: m.CaseStudyView,
  })),
);

function SectionFallback() {
  return <div className="section-padding" aria-hidden="true" />;
}

function HomeView() {
  const { i18n } = useTranslation()
  const isAr = (i18n.language || 'en') === 'ar'

  return (
    <main>
      <SEO
        title={isAr ? 'إبراهيم فارس — مطور واجهات أمامية' : 'Ibrahim Fares — Frontend Developer'}
        description={
          isAr
            ? 'مطور واجهات أمامية بخبرة أكثر من 4 سنوات في بناء تطبيقات React. متخصص في React.js وTypeScript وNext.js. متاح للعمل الحر عبر منصة مستقل.'
            : 'Frontend Developer with 4+ years building production-grade React applications. Specialized in React.js, TypeScript, Next.js, and Tailwind CSS. Available for freelance.'
        }
      />
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
        <TechArsenalSection />
        <CareerJourneySection />
        <ProjectsSection />
        <ArchitectureSection />
        <ChallengesSection />
        <ContactSection />
      </Suspense>
    </main>
  );
}

export default function App() {
  useLenis();
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Redirect to saved language preference on mount if visiting root '/'
  useEffect(() => {
    if (location.pathname === "/") {
      const savedLang = localStorage.getItem("portfolio-language");
      if (savedLang === "ar") {
        navigate("/ar", { replace: true });
      }
    }
  }, []); // Mount only

  // 2. Sync URL path (Router location) to i18n language state
  useEffect(() => {
    const path = location.pathname;
    const targetLang = path === "/ar" || path.startsWith("/ar/") ? "ar" : "en";
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [location.pathname, i18n]);

  // 3. Sync language changes back to localStorage, DOM attributes, and SEO titles
  useEffect(() => {
    const lang = i18n.language || "en";
    const dir = lang === "ar" ? "rtl" : "ltr";

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    // Persist user preference
    localStorage.setItem("portfolio-language", lang);

    // SEO updates
    document.title =
      lang === "ar"
        ? "إبراهيم فارس — مطور واجهات أمامية"
        : "Ibrahim Fares — Front-End Engineer";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        lang === "ar"
          ? "إبراهيم فارس — مطور واجهات أمامية بخبرة مهنية تزيد عن 4 سنوات في بناء منصات ويب متكاملة الميزات وتطبيقات ويب متجاوبة وقابلة للتوسع."
          : "Ibrahim Fares — Front-End Engineer building scalable web applications, interactive dashboards, and exceptional user experiences.",
      );
    }
  }, [i18n.language]);

  // 4. Scroll to hash observer for cross-page navigation & landing page anchors
  useEffect(() => {
    const hash = location.hash;
    const isHome = location.pathname === "/" || location.pathname === "/ar";
    if (isHome && hash) {
      const id = hash.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  // 5. Scroll to top on route change if no hash is present (e.g. going to a Case Study)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <Navigation />
      <Suspense fallback={<div className="h-screen w-screen bg-background flex items-center justify-center text-accent">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/ar" element={<HomeView />} />
          <Route path="/projects/:id" element={<CaseStudyView />} />
          <Route path="/ar/projects/:id" element={<CaseStudyView />} />
        </Routes>
      </Suspense>
    </>
  );
}
