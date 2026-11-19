import { getMessages, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/ui/Words";
import { AboutVisual } from "@/components/about/AboutVisual";
import { CvButton } from "@/components/about/CvButton";

const CSS = `
@keyframes ab-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
.ab-float { animation: ab-float 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ab-float { animation: none } }
`;

const icons = {
  place: (
    <g>
      <path d="M10 18s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10z" />
      <circle cx="10" cy="8" r="2.2" />
    </g>
  ),
  lang: (
    <g>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c2.2 2.3 3.2 4.8 3.2 7.5s-1 5.2-3.2 7.5c-2.2-2.3-3.2-4.8-3.2-7.5s1-5.2 3.2-7.5z" />
    </g>
  ),
};

/**
 * 7. About me, in the same language as the rest of the page: the waving character on the brand
 * gradient with two facts floating beside him (where, which languages), and on the other side the
 * title, the first line of the bio said large, then the rest, all written in word by word, what I'm open to
 * as two live cards, and the CV. One screen on desktop.
 */
export async function About({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("about");
  const messages = (await getMessages()) as { about: { info: { label: string; value: string }[] } };
  const [place, langs, open] = messages.about.info;
  const isAr = locale === "ar";

  // "I'm Ibrahim Fares, a web systems developer from Egypt." is said large; the rest follows.
  const bio = t("bio");
  const cut = bio.indexOf(". ") + 1;
  const lead = cut > 0 ? bio.slice(0, cut) : bio;
  const rest = cut > 0 ? bio.slice(cut).trim() : "";
  // "Freelance projects (full systems) · Remote jobs (frontend)" → two cards: name + (detail)
  const offers = open.value.split("·").map((s) => {
    const m = s.trim().match(/^(.*?)\s*\((.*)\)$/);
    return m ? { name: m[1], detail: m[2] } : { name: s.trim(), detail: "" };
  });

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto flex max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 md:py-28 lg:min-h-dvh lg:pt-[96px] lg:pb-10"
    >
      <style href="about-section" precedence="default">{CSS}</style>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* The character, on the brand gradient, with two facts floating beside him */}
        <div className="relative order-last lg:order-none lg:col-span-5">
          <AboutVisual
            facts={[
              { label: place.label, value: place.value, icon: icons.place },
              { label: langs.label, value: langs.value, icon: icons.lang },
            ]}
          />
        </div>

        {/* Who I am */}
        <Reveal className="lg:col-span-7" wordStagger={0.022}>
          <SectionHeading id="about-title" locale={locale} title={t("title")} />

          <p
            className={
              isAr
                ? "mt-6 text-[26px] leading-[42px] font-medium text-balance text-ink md:text-[32px] md:leading-[50px]"
                : "mt-6 font-latin text-[26px] leading-[36px] font-bold tracking-[-0.02em] text-balance text-ink md:text-[32px] md:leading-[42px]"
            }
          >
            <Words text={lead} />
          </p>
          {rest ? (
            <p className="mt-4 text-[17px] leading-[31px] text-ink-muted md:text-[18px] md:leading-[33px]">
              <Words text={rest} />
            </p>
          ) : null}

          {/* What I'm open to */}
          <div data-reveal="text" className="mt-7">
            <p className="text-[12px] leading-[18px] font-medium tracking-[0.06em] text-ink-muted uppercase">{open.label}</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {offers.map((o) => (
                <li key={o.name} className="flex items-start gap-3 rounded-2xl border border-line bg-surface/70 p-4">
                  <span className="relative mt-2 size-2 shrink-0 rounded-full bg-petrol" aria-hidden>
                    <span className="absolute inset-0 animate-ping rounded-full bg-petrol/60" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[16px] leading-[24px] font-medium text-ink">{o.name}</span>
                    {o.detail ? <span className="text-[14px] leading-[22px] text-ink-muted">{o.detail}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal="text" className="mt-7">
            <CvButton href="/cv/Ibrahim-Fares-CV.pdf" label={t("cv")} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
