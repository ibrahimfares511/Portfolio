import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PoseStage } from "@/components/ui/PoseStage";
import { ICONS, LINKS, WHATSAPP_HANDLE } from "@/components/ui/SocialLinks";

const Icon = ({ k, className = "size-5" }: { k: keyof typeof ICONS; className?: string }) => (
  <svg viewBox={ICONS[k].viewBox} className={className} fill="currentColor" aria-hidden>
    <path d={ICONS[k].d} fillRule={k === "email" ? "evenodd" : undefined} />
  </svg>
);

/**
 * 8. Contact: the close of the page, sharing the last screen with the footer (desktop).
 * One calm petrol panel: the title, then the ways to reach me as a quiet list (WhatsApp by username
 * first, then email), each row lighting up on hover; the character stands at the panel's edge.
 */
export async function Contact({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("contactSection");
  const tf = await getTranslations("footer");
  const tc = await getTranslations("contact");

  const rows = [
    { k: "whatsapp" as const, href: LINKS.whatsapp, label: tf("whatsapp"), value: WHATSAPP_HANDLE, external: true, big: true },
    { k: "email" as const, href: LINKS.email, label: tf("email"), value: tc("email"), external: false, big: false },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto flex max-w-6xl flex-col px-4 py-16 sm:px-6 md:py-20 lg:h-[calc(100dvh-136px)] lg:pt-[92px] lg:pb-6"
    >
      <Reveal className="lg:h-full">
        <div
          data-reveal="block"
          data-tone="petrol"
          className="relative grid h-full grid-cols-1 overflow-hidden rounded-[32px] bg-bg text-ink shadow-[0_40px_90px_-50px_rgba(13,27,33,0.9)] lg:grid-cols-12"
        >
          {/* light and texture */}
          <span aria-hidden className="absolute -top-40 -end-24 size-[520px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--clay)_28%,transparent),transparent)]" />
          <span aria-hidden className="absolute -bottom-48 -start-24 size-[560px] rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent)]" />
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--ink)_1px,transparent_1px),linear-gradient(90deg,var(--ink)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(closest-side,#000,transparent)]"
          />

          {/* words and ways to reach me */}
          <div className="relative flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <SectionHeading id="contact-title" locale={locale} title={t("title")} sub={t("subline")} />

            <ul className="mt-8 grid grid-cols-1 border-t border-line">
              {rows.map((r) => (
                <li key={r.k} data-reveal="text" className="border-b border-line">
                  <a
                    href={r.href}
                    {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative flex items-center gap-4 py-5 sm:gap-5"
                  >
                    {/* a soft light sweeps in behind the row on hover */}
                    <span aria-hidden className="absolute inset-y-1 -inset-x-3 origin-[inline-start] scale-x-0 rounded-2xl bg-ink/[0.06] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100 ltr:origin-left rtl:origin-right" />
                    <span className="relative grid size-12 shrink-0 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color,transform] duration-500 group-hover:-rotate-6 group-hover:border-transparent group-hover:bg-clay group-hover:text-on-clay">
                      <Icon k={r.k} className="size-5" />
                    </span>
                    <span className="relative flex min-w-0 flex-col">
                      <span className="flex items-center gap-2 text-[13px] text-ink-muted">
                        {r.label}
                        {r.big ? (
                          <span className="relative size-1.5 rounded-full bg-[#4ade80]" aria-hidden>
                            <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/70" />
                          </span>
                        ) : null}
                      </span>
                      <span
                        dir="ltr"
                        className={`truncate font-latin font-semibold text-ink transition-colors duration-300 group-hover:text-clay ${
                          r.big ? "text-[22px] leading-[30px] sm:text-[28px] sm:leading-[36px]" : "text-[17px] leading-[26px] sm:text-[20px] sm:leading-[30px]"
                        }`}
                      >
                        {r.value}
                      </span>
                    </span>
                    <span className="relative ms-auto grid size-10 shrink-0 place-items-center text-ink-muted transition-[transform,color] duration-500 group-hover:text-clay ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div data-reveal="text" className="mt-6 flex items-center gap-3">
              {(["github", "linkedin"] as const).map((k) => (
                <a
                  key={k}
                  href={LINKS[k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={k === "github" ? "GitHub" : "LinkedIn"}
                  className="grid size-10 place-items-center rounded-full border border-line text-ink-muted transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-ink/40 hover:text-ink"
                >
                  <Icon k={k} className={ICONS[k].size} />
                </a>
              ))}
            </div>
          </div>

          {/* the character, standing on the panel's bottom edge, in the light */}
          <div className="relative hidden min-h-0 lg:col-span-5 lg:block">
            <div className="absolute inset-x-0 top-10 bottom-0">
              <PoseStage pose="05-contact" bare mirror={locale === "en"} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
