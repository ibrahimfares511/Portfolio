/** The public address of the site; NEXT_PUBLIC_SITE_URL overrides it (e.g. a staging host). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ibrahimfares.dev").replace(/\/$/, "");

export const OG_LOCALE = { ar: "ar_EG", en: "en_US" } as const;
