import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { OtherWork } from "@/components/sections/OtherWork";
import { WhatICanBuild } from "@/components/sections/WhatICanBuild";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { Tools } from "@/components/sections/Tools";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/** Home page, in the sitemap order. */
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "ar";

  return (
    <>
      <Hero />
      <Projects locale={lang} />
      <OtherWork locale={lang} />
      <WhatICanBuild locale={lang} />
      <HowWeWork locale={lang} />
      <Tools locale={lang} />
      <About locale={lang} />
      <Contact locale={lang} />
    </>
  );
}
