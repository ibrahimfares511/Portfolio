import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PoseStage, floatCard } from "@/components/ui/PoseStage";
import { ICONS, LINKS, WHATSAPP_HANDLE } from "@/components/ui/SocialLinks";

const Icon = ({ k, className = "size-5" }: { k: keyof typeof ICONS; className?: string }) => (
  <svg viewBox={ICONS[k].viewBox} className={className} fill="currentColor" aria-hidden>
    <path d={ICONS[k].d} fillRule={k === "email" ? "evenodd" : undefined} />
  </svg>
);

const Arrow = () => (
  <span className="ms-auto grid size-11 shrink-0 place-items-center rounded-full border border-current/25 transition-[transform,background-color,border-color] duration-500 group-hover:rotate-[-45deg] group-hover:border-transparent group-hover:bg-clay group-hover:text-on-clay rtl:group-hover:rotate-[45deg]">
    <svg viewBox="0 0 16 16" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  </span>
);

/**
 * 8. Contact: the close of the page. No form: two ways to reach me, said big. WhatsApp (by username,
 * so the number stays private) is the main one, email beside it, GitHub and LinkedIn after. Beside
 * them the contact pose in its patch of light, pointing at them, with a chat bubble being typed.
 * One screen on desktop.
 */
export async function Contact({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("contactSection");
  const tf = await getTranslations("footer");
  const tc = await getTranslations("contact");

  const typing = (
    <div className={`${floatCard} flex items-center gap-1.5 rounded-es-md px-4 py-3`} aria-hidden>
      {[0, 1, 2].map((d) => (
        <span key={d} className="ct-dot size-2 rounded-full bg-ink-muted" style={{ animationDelay: `${d * 0.15}s` }} />
      ))}
    </div>
  );
  const wa = (
    <div className={`${floatCard} grid size-12 place-items-center rounded-full text-petrol`} aria-hidden>
      <Icon k="whatsapp" className="size-6" />
    </div>
  );

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto flex max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 md:py-28 lg:min-h-dvh lg:pt-[96px] lg:pb-12"
    >
      <style href="contact-section" precedence="default">{`
@keyframes ct-dot { 0%,80%,100% { transform: translateY(0); opacity: .45 } 40% { transform: translateY(-3px); opacity: 1 } }
.ct-dot { animation: ct-dot 1.1s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ct-dot { animation: none } }
`}</style>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* the pose points to its right, so it stands on the left in both languages */}
        <div className="relative order-last min-w-0 lg:col-span-5 ltr:lg:order-first rtl:lg:order-last">
          <PoseStage
            pose="05-contact"
            floating={[
              { node: wa, pos: "end-[8%] top-[10%]" },
              { node: typing, pos: "start-0 top-[34%] sm:-start-5" },
            ]}
          />
        </div>

        <Reveal className="min-w-0 lg:col-span-7">
          <SectionHeading id="contact-title" locale={locale} title={t("title")} sub={t("subline")} />

          <ul className="mt-9 grid grid-cols-1 gap-4">
            {/* WhatsApp: the main way, by username */}
            <li data-reveal="text">
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-5 overflow-hidden rounded-[22px] bg-ink p-5 text-bg shadow-[0_30px_60px_-34px_var(--ink)] transition-transform duration-500 hover:-translate-y-1 sm:p-6"
              >
                <span aria-hidden className="absolute -end-16 -top-16 size-48 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--clay)_45%,transparent),transparent)] transition-transform duration-700 group-hover:scale-150" />
                <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-clay text-on-clay transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                  <Icon k="whatsapp" className="size-7" />
                </span>
                <span className="relative flex min-w-0 flex-col">
                  <span className="flex items-center gap-2 text-[14px] opacity-75">
                    {tf("whatsapp")}
                    <span className="relative size-2 rounded-full bg-[#4ade80]" aria-hidden>
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/70" />
                    </span>
                  </span>
                  <span dir="ltr" className="truncate font-latin text-[24px] leading-[32px] font-bold tracking-[-0.01em] sm:text-[30px] sm:leading-[38px]">
                    {WHATSAPP_HANDLE}
                  </span>
                </span>
                <span className="relative ms-auto">
                  <Arrow />
                </span>
              </a>
            </li>

            {/* Email */}
            <li data-reveal="text">
              <a
                href={LINKS.email}
                className="group flex items-center gap-5 rounded-[22px] border border-line bg-surface/70 p-5 text-ink transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1 hover:border-petrol/50 hover:bg-surface sm:p-6"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sky-soft text-petrol transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                  <Icon k="email" className="size-6" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[14px] text-ink-muted">{tf("email")}</span>
                  <span dir="ltr" className="truncate font-latin text-[18px] leading-[28px] font-semibold sm:text-[22px] sm:leading-[32px]">
                    {tc("email")}
                  </span>
                </span>
                <Arrow />
              </a>
            </li>
          </ul>

          {/* and where else to find me */}
          <div data-reveal="text" className="mt-6 flex items-center gap-3">
            {(["github", "linkedin"] as const).map((k) => (
              <a
                key={k}
                href={LINKS[k]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={k === "github" ? "GitHub" : "LinkedIn"}
                className="grid size-11 place-items-center rounded-full border border-line text-ink transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-petrol/60 hover:text-petrol"
              >
                <Icon k={k} className={ICONS[k].size} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
