import { SITE_URL } from "@/lib/site";
import { LINKS } from "@/components/ui/SocialLinks";

/** Structured data for search engines (schema.org), as a JSON-LD block. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify can't break out of the tag once "<" is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const PERSON_ID = `${SITE_URL}/#person`;

/** Who the site is about: name, role, picture, profiles. Text is the site's own copy. */
export function personLd(lang: "ar" | "en", jobTitle: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: lang === "ar" ? "إبراهيم فارس" : "Ibrahim Fares",
        alternateName: lang === "ar" ? "Ibrahim Fares" : "إبراهيم فارس",
        jobTitle,
        url: `${SITE_URL}/${lang}`,
        image: `${SITE_URL}/avatar/06-arms-crossed-848.webp`,
        sameAs: [LINKS.github, LINKS.linkedin],
        knowsLanguage: ["ar", "en"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: lang === "ar" ? "إبراهيم فارس" : "Ibrahim Fares",
        inLanguage: ["ar", "en"],
        publisher: { "@id": PERSON_ID },
      },
    ],
  };
}
