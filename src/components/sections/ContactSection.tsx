import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, Github, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { useTheme } from "@/components/shared/ThemeContext";

const iconMap = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  "message-circle": MessageCircle,
} as const;

const socialDetails = [
  {
    label: "Email",
    value: "ibrahimfares511@gmail.com",
    href: "mailto:ibrahimfares511@gmail.com",
    icon: "mail",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ibrahimfares511",
    href: "https://linkedin.com/in/ibrahimfares511",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    value: "github.com/ibrahimfares511",
    href: "https://github.com/ibrahimfares511",
    icon: "github",
  },
  {
    label: "WhatsApp",
    value: "(+20) 1007218535",
    href: "https://wa.me/201007218535",
    icon: "message-circle",
  },
] as const;

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL;

export function ContactSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const isRtl = currentLang === "ar";

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEmailClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("ibrahimfares511@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = t("contact.form.validation.nameRequired");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("contact.form.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.form.validation.emailInvalid");
    }
    if (!formData.message.trim()) {
      newErrors.message = t("contact.form.validation.messageRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          _subject: "New message from Portfolio",
          _next: "YOUR_PORTFOLIO_URL/thank-you",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section
      id="contact"
      className="relative section-padding pt-0 pb-8 overflow-hidden bg-alt-background/30 dark:bg-transparent transition-colors duration-700"
      aria-label="Contact"
    >
      <AuroraBackground intensity={0.02} />

      <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Large Combined Card Container */}
        <motion.div
          key={currentLang}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl glass p-8 md:p-12 overflow-hidden border border-border"
        >
          {/* Inner ambient glow background */}
          {isDark && (
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
          )}
          {isDark && (
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent-secondary/5 rounded-full blur-[60px] pointer-events-none" />
          )}

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left Column: Call to Action, Contact Form & Compact Social Badges (62% Width) */}
            <div className="w-full lg:w-[62%] space-y-6 text-start">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
                  {t("contact.label")}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-snug max-w-lg">
                  {t("contact.title")}
                </h2>
                <p className="text-sm text-muted max-w-xl leading-relaxed">
                  {t("contact.description")}
                </p>
              </div>

              {/* Form / Success Alert Switcher */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-sm leading-relaxed text-start font-medium"
                  >
                    {t("contact.form.success")}
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    action={FORMSPREE_URL}
                    method="POST"
                    className="space-y-5"
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    {/* Formspree Helper Inputs */}
                    <input
                      type="hidden"
                      name="_subject"
                      value="New message from Portfolio"
                    />
                    <input
                      type="hidden"
                      name="_next"
                      value="YOUR_PORTFOLIO_URL/thank-you"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="form-name"
                          className="block text-xs font-semibold text-foreground/80"
                        >
                          {t("contact.form.nameLabel")}
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t("contact.form.namePlaceholder")}
                          className={`w-full p-[14px] rounded-xl bg-white/10 dark:bg-white/[0.08] light:bg-black/[0.04] border text-sm text-foreground placeholder-muted/50 focus:outline-none transition-all duration-300 ${
                            errors.name
                              ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-white/15 dark:border-white/15 light:border-black/15 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                          }`}
                        />
                        {errors.name && (
                          <span className="block text-[11px] text-red-500 font-medium">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="form-email"
                          className="block text-xs font-semibold text-foreground/80"
                        >
                          {t("contact.form.emailLabel")}
                        </label>
                        <input
                          id="form-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t("contact.form.emailPlaceholder")}
                          className={`w-full p-[14px] rounded-xl bg-white/10 dark:bg-white/[0.08] light:bg-black/[0.04] border text-sm text-foreground placeholder-muted/50 focus:outline-none transition-all duration-300 ${
                            errors.email
                              ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border-white/15 dark:border-white/15 light:border-black/15 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                          }`}
                        />
                        {errors.email && (
                          <span className="block text-[11px] text-red-500 font-medium">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="form-message"
                        className="block text-xs font-semibold text-foreground/80"
                      >
                        {t("contact.form.messageLabel")}
                      </label>
                      <textarea
                        id="form-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("contact.form.messagePlaceholder")}
                        className={`w-full p-[14px] rounded-xl bg-white/10 dark:bg-white/[0.08] light:bg-black/[0.04] border text-sm text-foreground placeholder-muted/50 focus:outline-none transition-all duration-300 resize-none ${
                          errors.message
                            ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-white/15 dark:border-white/15 light:border-black/15 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                        }`}
                      />
                      {errors.message && (
                        <span className="block text-[11px] text-red-500 font-medium">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Error Alert (only shows if send fails, success hides form) */}
                    {submitStatus === "error" && (
                      <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-xs font-semibold">
                        {t("contact.form.error")}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSending}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-xs shadow-md shadow-accent/20 hover:shadow-accent/35 active:scale-98 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer w-full sm:w-auto"
                    >
                      {isSending
                        ? t("contact.form.sending")
                        : t("contact.form.send")}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Or Contact Directly Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">
                  {t("contact.orDirectly")}
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              {/* Compact 2x2 Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialDetails.map((link) => {
                  const Icon = iconMap[link.icon];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={
                        link.label === "Email" ? handleEmailClick : undefined
                      }
                      target={link.label === "Email" ? undefined : "_blank"}
                      rel={
                        link.label === "Email"
                          ? undefined
                          : "noopener noreferrer"
                      }
                      dir="ltr"
                      className="relative flex items-center gap-3 p-3.5 rounded-2xl border border-border border-l-[3px] border-l-transparent bg-glass hover:bg-white/[0.08] dark:hover:bg-white/[0.08] light:hover:bg-black/[0.02] hover:border-l-accent transition-all duration-200 ease-out group shadow-xs cursor-pointer w-full text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center transition-transform group-hover:scale-110">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col leading-none text-left">
                        <span className="text-[9px] font-bold text-muted uppercase tracking-wider mb-1">
                          {link.label}
                        </span>
                        <span className="text-xs font-semibold text-foreground/80 break-all">
                          {link.value}
                        </span>
                      </div>

                      {link.label === "Email" && (
                        <AnimatePresence>
                          {copied && (
                            <motion.span
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-3 py-1.5 text-[10px] font-bold bg-emerald-600 dark:bg-emerald-500 text-white rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none"
                            >
                              {currentLang === "ar" ? "تم النسخ!" : "Copied!"}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Large Centered Avatar (38% Width) */}
            <div className="w-full lg:w-[38%] flex items-center justify-center">
              <div className="relative flex items-center justify-center select-none w-full max-w-[260px] sm:max-w-[300px] aspect-square">
                {/* Glowing background circles */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 via-accent-secondary/15 to-transparent blur-[30px] animate-pulse pointer-events-none" />

                {/* Thin outer outline ring */}
                <div
                  className={`absolute inset-4 rounded-full border transition-all duration-700 pointer-events-none ${
                    isDark ? "border-accent/15" : "border-accent/5"
                  }`}
                />

                {/* Image wrapper */}
                <div className="relative z-10 w-[80%] h-[80%] rounded-full overflow-hidden border border-white/10 dark:border-white/10 light:border-black/5 shadow-2xl bg-background/50 backdrop-blur-md">
                  <img
                    src="/favicon.svg"
                    alt="Ibrahim Fares Logo"
                    className="w-full h-full object-contain object-center p-4"
                    style={{ transform: "scale(1.4) translate(-5px, 10px)" }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Row */}
        <div className="mt-20 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p className="font-medium">
            &copy; {new Date().getFullYear()} Ibrahim Fares.{" "}
            {t("contact.copyright")}
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 font-bold text-accent hover:text-accent-hover transition-colors cursor-pointer group"
          >
            {t("contact.backToTop")}
            <span className="transition-transform group-hover:-translate-y-0.5 duration-300">
              ↑
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
