import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Words } from "@/components/ui/Words";
import { PoseStage } from "@/components/ui/PoseStage";
import { floatCard } from "@/lib/ui-classes";
import { ICONS, LINKS, WHATSAPP_HANDLE } from "@/components/ui/SocialLinks";

const Icon = ({ k, className = "size-5" }: { k: keyof typeof ICONS; className?: string }) => (
  <svg viewBox={ICONS[k].viewBox} className={className} fill="currentColor" aria-hidden>
    <path d={ICONS[k].d} fillRule={k === "email" ? "evenodd" : undefined} />
  </svg>
);

const CSS = `
@keyframes ct-dot { 0%,60%,100% { opacity:.25; transform:translateY(0) } 30% { opacity:1; transform:translateY(-3px) } }
.ct-dot { animation: ct-dot 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ct-dot { animation: none; opacity: .6 } }
`;

/**
 * 8. Contact: the close of the page, sharing the last screen with the footer (desktop).
 * Calm, on the page's own background: the title and one clear sentence (WhatsApp or email),
 * the two ways to reach me as large rows, then GitHub and LinkedIn as labelled links.
 * Beside it the character sits on the floor with his phone, waiting, his open hand
 * pointing at the words (mirrored in Arabic so he still faces the text).
 */
export async function Contact({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("contactSection");
  const tf = await getTranslations("footer");
  const tc = await getTranslations("contact");

  const rows = [
    { k: "whatsapp" as const, href: LINKS.whatsapp, label: tf("whatsapp"), value: WHATSAPP_HANDLE, external: true, big: true },
    { k: "email" as const, href: LINKS.email, label: tf("email"), value: tc("email"), external: false, big: false },
  ];
  const others = [
    { k: "github" as const, name: "GitHub" },
    { k: "linkedin" as const, name: "LinkedIn" },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto flex max-w-6xl flex-col px-4 py-16 sm:px-6 md:py-20 lg:h-[calc(100dvh-96px)] lg:pt-[92px] lg:pb-4"
    >
      <style href="contact-section" precedence="default">{CSS}</style>
      <Reveal className="grid min-h-0 flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6" wordStagger={0.03}>
        {/* words and ways to reach me */}
        <div className="min-w-0 lg:col-span-6">
          <SectionHeading id="contact-title" locale={locale} title={t("title")} />
          <p className="mt-5 max-w-[30ch] text-[21px] leading-[36px] font-medium text-ink md:text-[26px] md:leading-[44px]">
            <Words text={t("subline")} />
          </p>

          <ul className="mt-8 grid grid-cols-1 border-t border-line">
            {rows.map((r) => (
              <li key={r.k} data-reveal="text" className="border-b border-line">
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group relative flex items-center gap-4 py-5 sm:gap-5"
                >
                  <span aria-hidden className="absolute inset-y-1 -inset-x-3 scale-x-0 rounded-2xl bg-ink/[0.045] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100 ltr:origin-left rtl:origin-right" />
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color,transform] duration-500 group-hover:-rotate-6 group-hover:border-transparent group-hover:bg-clay group-hover:text-on-clay sm:size-14">
                    <Icon k={r.k} className="size-5 sm:size-6" />
                  </span>
                  <span className="relative flex min-w-0 flex-col">
                    <span className="flex items-center gap-2 text-[14px] text-ink-muted">
                      {r.label}
                      {r.big ? (
                        <span className="relative size-1.5 rounded-full bg-[#22c55e]" aria-hidden>
                          <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e]/60" />
                        </span>
                      ) : null}
                    </span>
                    <span
                      dir="ltr"
                      className={`truncate font-latin font-semibold text-ink transition-colors duration-300 group-hover:text-clay ${
                        r.big ? "text-[24px] leading-[32px] sm:text-[32px] sm:leading-[42px]" : "text-[16px] leading-[26px] sm:text-[24px] sm:leading-[34px]"
                      }`}
                    >
                      {r.value}
                    </span>
                  </span>
                  <span className="relative ms-auto hidden size-10 shrink-0 sm:grid place-items-center text-ink-muted transition-[transform,color] duration-500 group-hover:text-clay ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* GitHub and LinkedIn, named so they are seen */}
          <div data-reveal="text" className="mt-7">
            <p className="text-[15px] text-ink-muted">{t("elsewhere")}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {others.map((o) => (
                <a
                  key={o.k}
                  href={LINKS[o.k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-line bg-surface py-2 ps-2 pe-5 text-ink transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_14px_30px_-20px_rgba(22,48,58,0.6)]"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-ink text-bg transition-colors duration-300 group-hover:bg-clay group-hover:text-on-clay">
                    <Icon k={o.k} className={ICONS[o.k].size} />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-latin text-[15px] font-semibold">{o.name}</span>
                    <span dir="ltr" className="font-latin text-[12px] text-ink-muted">
                      ibrahimfares511
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* the character sits on the floor with his phone, waiting for your message */}
        <div className="relative h-[340px] min-h-0 sm:h-[420px] lg:col-span-6 lg:h-full">
          <span aria-hidden className="absolute inset-x-[6%] top-[10%] bottom-[8%] rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent)] opacity-80" />
          <span aria-hidden className="absolute inset-x-[16%] bottom-[2%] h-6 rounded-[50%] bg-black/15 blur-xl dark:bg-black/50" />
          <div className="absolute inset-x-0 top-[4%] bottom-[3%]">
            <PoseStage
              pose="05-sitting"
              bare
              mirror={locale === "ar"}
              widths={[320, 480, 640, 960]}
              size={[960, 1161]}
              sizes="(min-width: 1024px) 560px, 340px"
              floating={[
                {
                  pos: "top-[6%] end-[4%] sm:end-[10%]",
                  node: (
                    <div className={`${floatCard} flex items-center gap-1.5 rounded-[18px] rounded-ee-md px-4 py-3`} aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="ct-dot size-2 rounded-full bg-ink-muted" style={{ animationDelay: `${i * 0.18}s` }} />
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
