import type { CaseSection } from "./project-page";

/**
 * Splits the case-study Markdown sections into the parts the page lays out
 * on their own. The Markdown always runs: problem, what was built, features,
 * role, (extra sections), results, under the hood, status.
 */
export function splitSections(sections: CaseSection[]) {
  const role = sections.find((s) => s.kind === "role") ?? null;
  const tech = sections.find((s) => s.kind === "tech") ?? null;
  const techAt = tech ? sections.indexOf(tech) : sections.length;
  const plain = sections.filter((s) => s.kind === "plain");
  const status = tech ? sections.slice(techAt + 1).find((s) => s.kind === "plain") ?? null : null;
  // results: the last plain section before "under the hood"
  const before = sections.slice(0, techAt).filter((s) => s.kind === "plain");
  const results = before.length > 3 ? before[before.length - 1] : null;
  // anything else (Elite's "Smart Control" section…) is shown as its own text band
  const extras = plain.slice(3).filter((s) => s !== results && s !== status);
  return { role, tech, status, extras };
}

/** The tech section without its first "Stack:" line (the stack is shown as logos). */
export function techBody(html: string) {
  return html.replace(/^\s*<p><strong>[^<]*(Stack|التقنيات|الأدوات)[^<]*<\/strong>[\s\S]*?<\/p>\s*/i, "");
}

/** The status section split into the status itself and the demo-data note (the <em> paragraph). */
export function statusParts(html: string) {
  const note = html.match(/<p><em>([\s\S]*?)<\/em><\/p>/);
  return {
    body: html.replace(/<p><em>[\s\S]*?<\/em><\/p>/, "").trim(),
    note: note ? note[1] : null,
  };
}

/** A year ("2026") is shown as it is, never counted up from zero. */
export const isYear = (v: string) => /^(19|20)\d\d$/.test(v.trim());

/**
 * The features as written in the case study's "Key features" list: a bold
 * title when the project has one ("<strong>Stock you can trust.</strong> …"),
 * otherwise the sentence alone. HTML is kept (it is our own Markdown).
 */
export function featureItems(html: string) {
  return Array.from(html.matchAll(/<li>([\s\S]*?)<\/li>/g)).map((m) => {
    const li = m[1].replace(/^\s*<p>|<\/p>\s*$/g, "").trim();
    const t = li.match(/^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/);
    return t ? { title: t[1].replace(/[.:：]\s*$/, ""), html: t[2] } : { title: null, html: li };
  });
}

/** HTML from our Markdown → plain text (for the word-by-word entrance). */
export function plainText(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
