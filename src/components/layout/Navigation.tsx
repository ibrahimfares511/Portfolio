import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/shared/ThemeContext";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "How I Think", href: "#how-i-think" },
  { label: "Challenges", href: "#challenges" },
  { label: "Experience", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

const getNavKey = (label: string) => {
  if (label === "How I Think") return "howIThink";
  return label.toLowerCase();
};

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const navigate = useNavigate();
  const location = useLocation();

  const isCaseStudy = location.pathname.includes('/projects/');
  const getHref = (href: string) => {
    return isCaseStudy ? `/${currentLang === 'ar' ? 'ar' : ''}${href}` : href;
  };

  const handleLanguageToggle = (lang: "en" | "ar") => {
    const hash = location.hash || "";
    if (isCaseStudy) {
      const segments = location.pathname.split('/');
      const projectId = segments[segments.length - 1];
      const targetPath = lang === "ar" ? `/ar/projects/${projectId}${hash}` : `/projects/${projectId}${hash}`;
      navigate(targetPath);
    } else {
      const targetPath = lang === "ar" ? `/ar${hash}` : `/${hash}`;
      navigate(targetPath);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <div className="container-wide px-4 sm:px-6 lg:px-8">
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500",
              scrolled
                ? "glass-strong shadow-lg"
                : "bg-transparent border-transparent",
            )}
            aria-label="Main navigation"
          >
            {/* Logo area */}
            <a
              href={getHref('#hero')}
              className="flex items-center gap-3 font-display tracking-tight group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary text-white text-xs font-bold shadow-[0_0_15px_rgba(129,140,248,0.4)]">
                IF
              </span>
              <span className="font-display font-semibold text-sm tracking-widest text-foreground/90 uppercase hidden sm:inline-block transition-colors group-hover:text-accent">
                Ibrahim Fares
              </span>
            </a>

            {/* Links in center - hidden for now */}
            <ul className="hidden items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={getHref(link.href)}
                    className="px-3.5 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
                  >
                    {t(`nav.${getNavKey(link.label)}`)}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right side items: Language Switcher + Theme Switcher + Let's Talk Button */}
            <div className="flex items-center gap-1.5 sm:gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold me-1 sm:me-2 border-e border-white/10 dark:border-white/10 light:border-black/10 pe-2 sm:pe-4">
                <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted hidden sm:block" />
                <button
                  onClick={() => handleLanguageToggle("en")}
                  className={cn(
                    "px-1 sm:px-1.5 py-0.5 rounded-md transition-all duration-300 hover:text-accent cursor-pointer text-[11px] sm:text-xs",
                    currentLang === "en"
                      ? "text-accent bg-accent/10 font-bold"
                      : "text-muted",
                  )}
                >
                  EN
                </button>
                <span className="text-white/10 dark:text-white/10 light:text-black/10">
                  |
                </span>
                <button
                  onClick={() => handleLanguageToggle("ar")}
                  className={cn(
                    "px-1 sm:px-1.5 py-0.5 rounded-md transition-all duration-300 hover:text-accent cursor-pointer text-[11px] sm:text-xs",
                    currentLang === "ar"
                      ? "text-accent bg-accent/10 font-bold"
                      : "text-muted",
                  )}
                >
                  AR
                </button>
              </div>

              {/* Theme switch capsule */}
              <button
                onClick={toggleTheme}
                className="relative flex items-center justify-between w-[52px] h-[28px] sm:w-[64px] sm:h-[32px] rounded-full p-1 bg-white/5 border border-white/10 dark:border-white/10 light:border-black/10 dark:bg-white/5 light:bg-black/5 cursor-pointer overflow-hidden transition-colors"
                aria-label="Toggle theme"
              >
                <div className="flex items-center justify-around w-full z-10">
                  <Sun
                    className={cn(
                      "h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors",
                      theme === "light" ? "text-accent" : "text-muted",
                    )}
                  />
                  <Moon
                    className={cn(
                      "h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors",
                      theme === "dark" ? "text-accent" : "text-muted",
                    )}
                  />
                </div>
                <motion.div
                  className="absolute top-[3px] left-[3px] w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] rounded-full bg-accent/20 border border-accent/30 shadow-[0_0_10px_rgba(129,140,248,0.3)]"
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  style={{
                    x: theme === "dark" ? (isMobile ? 22 : 30) : 0,
                  }}
                />
              </button>

              <a
                href={getHref('#contact')}
                className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-full bg-gradient-to-r from-accent to-accent-secondary text-white hover:scale-[1.02] shadow-[0_4px_15px_rgba(129,140,248,0.25)] hover:shadow-[0_4px_20px_rgba(129,140,248,0.4)] transition-all duration-300 whitespace-nowrap"
              >
                {t("nav.letsTalk")}{" "}
                <span className="ml-0.5 rtl:rotate-180">→</span>
              </a>
            </div>

            {/* Mobile menu trigger - hidden as links are hidden */}
            <div className="hidden items-center gap-3 md:hidden">
              {/* Compact Language Switcher on mobile */}
              <div className="flex items-center gap-1 text-[11px] font-bold me-1">
                <Globe className="h-3 w-3 text-muted" />
                <button
                  onClick={() => handleLanguageToggle("en")}
                  className={cn(
                    "px-1 py-0.5 rounded transition-all duration-300 cursor-pointer",
                    currentLang === "en"
                      ? "text-accent bg-accent/10"
                      : "text-muted",
                  )}
                >
                  EN
                </button>
                <span className="text-white/10 dark:text-white/10 light:text-black/10">
                  |
                </span>
                <button
                  onClick={() => handleLanguageToggle("ar")}
                  className={cn(
                    "px-1 py-0.5 rounded transition-all duration-300 cursor-pointer",
                    currentLang === "ar"
                      ? "text-accent bg-accent/10"
                      : "text-muted",
                  )}
                >
                  AR
                </button>
              </div>

              {/* Theme switch on mobile */}
              <button
                onClick={toggleTheme}
                className="relative flex items-center justify-between w-[52px] h-[26px] rounded-full p-1 bg-white/5 border border-white/10 dark:bg-white/5 light:bg-black/5 cursor-pointer"
                aria-label="Toggle theme"
              >
                <div className="flex items-center justify-around w-full z-10">
                  <Sun className="h-3 w-3 text-muted dark:text-muted light:text-accent" />
                  <Moon className="h-3 w-3 text-muted dark:text-accent light:text-muted" />
                </div>
                <motion.div
                  className="absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-accent/20 border border-accent/30"
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  style={{
                    x: theme === "dark" ? 24 : 0,
                  }}
                />
              </button>

              <button
                className="p-2 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-20 z-40 md:hidden glass-strong rounded-2xl p-6"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={getHref(link.href)}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-colors text-start"
                  >
                    {t(`nav.${getNavKey(link.label)}`)}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={getHref('#contact')}
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white"
            >
              {t("nav.letsTalk")}{" "}
              <span className="ml-0.5 rtl:rotate-180">→</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
