import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";

/** 404: simple, with the avatar (sitemap). The shrug pose, "404" in IF Pen. */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("notFound");
  const isAr = locale === "ar";
  return (
    <section className="mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center gap-6 px-4 pt-24 pb-16 text-center sm:px-6 md:flex-row md:gap-14 md:text-start">
      <picture className="shrink-0">
        <source
          type="image/avif"
          srcSet="/avatar/10-shrug-320.avif 320w, /avatar/10-shrug-480.avif 480w, /avatar/10-shrug-640.avif 640w"
          sizes="(min-width: 768px) 320px, 220px"
        />
        <img
          src="/avatar/10-shrug-480.webp"
          srcSet="/avatar/10-shrug-320.webp 320w, /avatar/10-shrug-480.webp 480w, /avatar/10-shrug-640.webp 640w"
          sizes="(min-width: 768px) 320px, 220px"
          width={848}
          height={1264}
          alt=""
          className="h-[280px] w-auto select-none md:h-[440px]"
        />
      </picture>
      <div className="flex flex-col items-center gap-5 md:items-start">
        <p className="num font-display text-[96px] leading-none text-petrol md:text-[140px]" aria-hidden>
          404<span className="text-clay">.</span>
        </p>
        <h1 className={isAr ? "text-[26px] leading-[40px] font-medium md:text-[32px] md:leading-[50px]" : "font-latin text-[26px] leading-[34px] font-bold md:text-[32px] md:leading-[40px]"}>
          {t("title")}
        </h1>
        <ButtonLink href={`/${locale}`}>{t("home")}</ButtonLink>
      </div>
    </section>
  );
}
