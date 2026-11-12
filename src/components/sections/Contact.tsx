import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { LINKS } from "@/components/ui/SocialLinks";

/**
 * 8. Contact: one card in two panes. The form on the light pane; beside it a
 * petrol pane with WhatsApp and email and the contact pose standing at its
 * bottom, pointing at the form (the pose points right, so this pane is on
 * the left in both languages; on phones it comes after the form).
 */
export async function Contact({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("contactSection");
  const tf = await getTranslations("footer");
  const tc = await getTranslations("contact");

  const row =
    "group flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 transition-[border-color,background-color] duration-300 hover:border-petrol/60 hover:bg-surface";
  const icon =
    "inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-soft text-petrol transition-transform duration-300 group-hover:scale-105";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28"
    >
      <Reveal>
        <SectionHeading
          id="contact-title"
          locale={locale}
          title={t("title")}
          sub={t("subline")}
        />
      </Reveal>

      <Reveal className="mt-10 md:mt-14">
        <div
          data-reveal="block"
          className="grid overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_40px_80px_-50px_rgba(22,48,58,0.55)] lg:grid-cols-12"
        >
          {/* form */}
          <div className="p-5 sm:p-8 lg:col-span-7 lg:p-10 lg:ltr:order-2">
            <ContactForm />
          </div>

          {/* direct + avatar */}
          <div
            data-tone="petrol"
            className="relative flex flex-col overflow-hidden bg-bg p-5 text-ink sm:p-8 lg:col-span-5 lg:p-10 lg:ltr:order-1"
          >
            <span
              aria-hidden
              className="absolute -bottom-24 left-1/2 aspect-square w-[130%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--petrol)_30%,transparent),transparent)]"
            />
            <p className="relative text-[14px] text-ink-muted">{t("direct")}</p>
            <ul className="relative mt-4 grid gap-3">
              <li>
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={row}
                >
                  <span className={icon}>
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.75.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.89 9.9c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.88c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.48-8.4Z" />
                    </svg>
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[13px] text-ink-muted">
                      {tf("whatsapp")}
                    </span>
                    <span className="num self-start font-latin text-[17px] text-ink">
                      {tc("whatsapp")}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={LINKS.email} className={row}>
                  <span className={icon}>
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.5 5h17A1.5 1.5 0 0 1 22 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5Zm.5 2.3v9.7h16V7.3l-7.4 5.53a1 1 0 0 1-1.2 0L4 7.3ZM5.9 7l6.1 4.56L18.1 7H5.9Z"
                      />
                    </svg>
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[13px] text-ink-muted">
                      {tf("email")}
                    </span>
                    <span
                      className="truncate font-latin text-[17px] text-ink"
                      dir="ltr"
                    >
                      {tc("email")}
                    </span>
                  </span>
                </a>
              </li>
            </ul>

            {/* the pose stands on the bottom edge, pointing at the form */}
            <div className="relative mt-8 flex flex-1 items-end justify-end lg:-mb-10 rtl:justify-start">
              <picture>
                <source
                  type="image/avif"
                  srcSet="/avatar/05-contact-320.avif 320w, /avatar/05-contact-480.avif 480w"
                  sizes="260px"
                />
                <img
                  src="/avatar/05-contact-320.webp"
                  srcSet="/avatar/05-contact-320.webp 320w, /avatar/05-contact-480.webp 480w"
                  sizes="260px"
                  width={848}
                  height={1264}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="-mb-5 h-[230px] w-auto select-none sm:-mb-8 sm:h-[280px] lg:mb-0 lg:h-[340px]"
                />
              </picture>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
