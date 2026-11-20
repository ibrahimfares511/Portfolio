import { getTranslations } from "next-intl/server";

/** WhatsApp by phone number (wa.me needs the number in international form, digits only). */
export const WHATSAPP_HANDLE = "+20 100 721 8535";

export const LINKS = {
  whatsapp: "https://wa.me/201007218535",
  email: "mailto:ibrahimfares511@gmail.com",
  github: "https://github.com/ibrahimfares511",
  linkedin: "https://www.linkedin.com/in/ibrahimfares511",
} as const;

export const ICONS: Record<keyof typeof LINKS, { viewBox: string; d: string; size: string }> = {
  whatsapp: {
    viewBox: "0 0 24 24",
    size: "size-[18px]",
    d: "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.75.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.89 9.9c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.88c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.48-8.4Z",
  },
  email: {
    viewBox: "0 0 24 24",
    size: "size-[18px]",
    d: "M3.5 5h17A1.5 1.5 0 0 1 22 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5Zm.5 2.3v9.7h16V7.3l-7.4 5.53a1 1 0 0 1-1.2 0L4 7.3ZM5.9 7l6.1 4.56L18.1 7H5.9Z",
  },
  github: {
    viewBox: "0 0 16 16",
    size: "size-[18px]",
    d: "M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z",
  },
  linkedin: {
    viewBox: "0 0 24 24",
    size: "size-[17px]",
    d: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  },
};

/** WhatsApp, email, GitHub and LinkedIn as round icon buttons. */
export async function SocialLinks({ className = "" }: { className?: string }) {
  const t = await getTranslations("footer");
  const labels: Record<keyof typeof LINKS, string> = {
    whatsapp: `${t("whatsapp")}: ${WHATSAPP_HANDLE}`,
    email: `${t("email")}: ibrahimfares511@gmail.com`,
    github: "GitHub",
    linkedin: "LinkedIn",
  };

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {(Object.keys(LINKS) as (keyof typeof LINKS)[]).map((key) => {
        const external = key !== "email";
        return (
          <li key={key}>
            <a
              href={LINKS[key]}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={labels[key]}
              title={labels[key]}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-petrol/40 hover:text-petrol"
            >
              <svg viewBox={ICONS[key].viewBox} className={ICONS[key].size} fill="currentColor" aria-hidden>
                <path d={ICONS[key].d} fillRule={key === "email" ? "evenodd" : undefined} />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
