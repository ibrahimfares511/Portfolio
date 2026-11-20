import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd, personLd } from "@/components/seo/JsonLd";
import { Band } from "@/components/layout/Band";
import { SectionPager } from "@/components/layout/SectionPager";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { OtherWork } from "@/components/sections/OtherWork";
import { WhatICanBuild } from "@/components/sections/WhatICanBuild";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { Tools } from "@/components/sections/Tools";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/**
 * Home page, in the sitemap order. Each section sits in a band; the tones
 * alternate so the page changes colour as you go: light, light, sky, light,
 * petrol (squared paper), sky, light, clay.
 */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "ar";
  const t = await getTranslations("hero");
  const ts = await getTranslations("sections");
  const [name, role] = t("eyebrow").split("·").map((s) => s.trim());

  return (
    <>
      <JsonLd data={personLd(lang, role)} />
      <Band label={name} track="home-hero">
        <Hero />
      </Band>
      <Band label={ts("projects")} track="home-projects">
        <Projects locale={lang} />
      </Band>
      <Band label={ts("otherWork")} track="home-other-work" tone="sky">
        <OtherWork locale={lang} />
      </Band>
      <Band label={ts("build")} track="home-what-i-build">
        <WhatICanBuild locale={lang} />
      </Band>
      <Band label={ts("process")} track="home-process" tone="petrol">
        <HowWeWork locale={lang} />
      </Band>
      <Band label={ts("tools")} track="home-tools" tone="sky">
        <Tools locale={lang} />
      </Band>
      <Band label={ts("about")} track="home-about">
        <About locale={lang} />
      </Band>
      <Band label={ts("contact")} track="home-contact" minHeight="calc(100vh - 96px)">
        <Contact locale={lang} />
      </Band>
      <SectionPager />
    </>
  );
}
