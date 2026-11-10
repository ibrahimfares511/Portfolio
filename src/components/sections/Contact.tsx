import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { LINKS } from "@/components/ui/SocialLinks";

/**
 * 8. Contact: the four-field form, and beside it WhatsApp and email with the
 * contact pose pointing at the form (it points right, so its column sits on
 * the left in both languages).
 */
export async function Contact({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("contactSection");
  const tf = await getTranslations("footer");
  const tc = await getTranslations("contact");

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

      <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="relative rounded-xl border border-line bg-surface p-5 sm:p-8 lg:col-span-8 lg:rtl:order-first">
          <div data-reveal="block">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal className="relative flex flex-col lg:col-span-4 lg:ltr:order-first">
          <p data-reveal="text" className="text-[14px] text-ink-muted">
            {t("direct")}
          </p>
          <ul data-reveal="text" className="mt-4 grid gap-3">
            <li>
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-lg border border-line bg-surface/70 p-4 transition-colors hover:border-petrol/50"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-sky-soft text-petrol">
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
                  <span className="num self-start font-latin text-[16px] text-ink group-hover:text-petrol">
                    {tc("whatsapp")}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={LINKS.email}
                className="group flex items-center gap-4 rounded-lg border border-line bg-surface/70 p-4 transition-colors hover:border-petrol/50"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-sky-soft text-petrol">
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
                    className="truncate font-latin text-[16px] text-ink group-hover:text-petrol"
                    dir="ltr"
                  >
                    {tc("email")}
                  </span>
                </span>
              </a>
            </li>
          </ul>

          <div
            data-reveal="block"
            className="relative mt-8 hidden self-center lg:mt-auto lg:block"
          >
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 aspect-square w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--sky-soft),transparent)]"
            />
            <picture>
              <source
                type="image/avif"
                srcSet="/avatar/05-contact-320.avif 320w, /avatar/05-contact-480.avif 480w"
                sizes="240px"
              />
              <img
                src="/avatar/05-contact-320.webp"
                srcSet="/avatar/05-contact-320.webp 320w, /avatar/05-contact-480.webp 480w"
                sizes="240px"
                width={848}
                height={1264}
                alt=""
                loading="lazy"
                decoding="async"
                className="relative h-[340px] w-auto select-none"
              />
            </picture>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
