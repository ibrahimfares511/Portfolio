import { getMessages, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** 7. About me: the wave pose, the bio, three facts and the CV. */
export async function About({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("about");
  const messages = (await getMessages()) as { about: { info: { label: string; value: string }[] } };

  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="relative order-last flex justify-center lg:order-none lg:col-span-5">
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 aspect-square w-[95%] max-w-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent)]"
          />
          <picture data-reveal="block" className="relative">
            <source
              type="image/avif"
              srcSet="/avatar/07-wave-320.avif 320w, /avatar/07-wave-480.avif 480w, /avatar/07-wave-640.avif 640w"
              sizes="(min-width: 1024px) 380px, 260px"
            />
            <img
              src="/avatar/07-wave-480.webp"
              srcSet="/avatar/07-wave-320.webp 320w, /avatar/07-wave-480.webp 480w, /avatar/07-wave-640.webp 640w"
              sizes="(min-width: 1024px) 380px, 260px"
              width={848}
              height={1264}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-[340px] w-auto select-none lg:h-[520px]"
            />
          </picture>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <SectionHeading id="about-title" locale={locale} title={t("title")} />
          <p data-reveal="text" className="mt-6 text-[17px] leading-[32px] text-ink-muted md:text-[18px] md:leading-[34px]">
            {t("bio")}
          </p>

          <dl data-reveal="text" className="mt-8 divide-y divide-line border-y border-line">
            {messages.about.info.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                <dt className="text-[14px] text-ink-muted">{row.label}</dt>
                <dd className="text-[16px] text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal="text" className="mt-8">
            <a
              href="/cv/Ibrahim-Fares-CV.pdf"
              download
              className="inline-flex h-12 items-center gap-2 rounded-md border-[1.5px] border-ink/80 px-6 text-[16px] font-medium text-ink transition-colors hover:bg-ink hover:text-bg"
            >
              <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 3v10M6 9l4 4 4-4M4 16h12" />
              </svg>
              {t("cv")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
