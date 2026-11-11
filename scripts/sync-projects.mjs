#!/usr/bin/env node
/**
 * Copies the project packages into the site and optimises their media.
 *
 *   npm run sync                      # reads ../projects (the packages folder)
 *   PROJECTS_DIR=/path npm run sync   # somewhere else
 *
 * The packages in ../projects are read-only: nothing there is changed.
 *
 * Writes:
 *   content/projects/<slug>/project.json, case-study.ar.md, case-study.en.md
 *   content/projects/index.json        normalised data the site imports
 *   content/projects/<slug>/page.json  the case-study page: sections parsed
 *                                      from the case studies (HTML), gallery,
 *                                      videos, diagram
 *   public/projects/<slug>/...         covers (AVIF + WebP, 2 sizes), social
 *                                      cover (JPEG), card loop (MP4 + WebM)
 *                                      and its poster, screenshots (AVIF +
 *                                      WebP, 2 sizes), videos, diagram
 *
 * Order and tiers follow _brief/portfolio-site-notes.md.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { z } from "zod";
import { marked } from "marked";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.resolve(process.env.PROJECTS_DIR ?? path.join(SITE, "..", "projects"));
const CONTENT = path.join(SITE, "content", "projects");
const PUBLIC = path.join(SITE, "public", "projects");

// portfolio-site-notes.md → "Project order on the site"
const ORDER = ["wms", "elite", "smart-control", "ertiqaa-academy", "haya", "real-estate-platform", "web-point"];

// portfolio-site-notes.md → Smart Control: "show a small tag
// 'Elite's dashboard / لوحة تحكم Elite'".
const PART_OF_TAG = { elite: { ar: "لوحة تحكم Elite", en: "Elite's dashboard" } };

const L = z.object({ ar: z.string().min(1), en: z.string().min(1) });
const Project = z.object({
  slug: z.string(),
  status: z.enum(["live", "delivered"]),
  year: z.string(),
  title: L,
  role: L,
  summary: L,
  tier: z.literal("other").optional(),
  status_note: L.optional(),
  card: z.object({
    line: L,
    role: L,
    stats: z.array(z.object({ value: z.string(), label: L })).length(2),
  }),
  related: z
    .array(z.union([z.string(), z.object({ slug: z.string(), relation: L })]))
    .optional(),
  part_of: z.object({ slug: z.string(), relation: L }).optional(),
  links: z.object({ live: z.string().nullable(), demo: z.string().nullable() }),
  assets: z.object({
    cover: z.string(),
    cover_social: z.string().optional(),
    card_loop: z.string(),
    card_loop_webm: z.string().optional(),
  }).passthrough(),
}).passthrough();

const rel = (p) => path.relative(SITE, p);
const ensure = (d) => fs.mkdirSync(d, { recursive: true });
const ffmpeg = (...args) => execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
const fresh = (out, src) => fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;

/** "Elite: منصة مزايا للموظفين" → "Elite" (the card name is the part before the colon). */
const shortName = (t) => t.split(":")[0].trim();

async function image(src, outBase, widths) {
  const meta = await sharp(src).metadata();
  const out = {};
  const fit = widths.filter((w) => w <= meta.width);
  for (const w of fit.length ? fit : [meta.width]) {
    const avif = `${outBase}-${w}.avif`;
    const webp = `${outBase}-${w}.webp`;
    if (!fresh(avif, src)) await sharp(src).resize({ width: w }).avif({ quality: 55, effort: 4 }).toFile(avif);
    if (!fresh(webp, src)) await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(webp);
    out[w] = { avif: "/" + path.relative(path.join(SITE, "public"), avif), webp: "/" + path.relative(path.join(SITE, "public"), webp) };
  }
  return { width: meta.width, height: meta.height, sizes: out };
}

/**
 * A case study in Markdown → { title, lead, sections: [{ heading, kind, html }] }.
 * kind: "role" (My role), "tech" (Under the hood), or "plain" (the rest).
 */
function parseCaseStudy(md) {
  const lines = md.replace(/\r/g, "").split("\n").filter((l) => l.trim() !== "---");
  let title = "";
  const lead = [];
  const sections = [];
  let cur = null;
  for (const line of lines) {
    if (line.startsWith("# ")) title = line.slice(2).trim();
    else if (line.startsWith("## ")) {
      cur = { heading: line.slice(3).trim(), body: [] };
      sections.push(cur);
    } else if (cur) cur.body.push(line);
    else if (line.trim()) lead.push(line);
  }
  const kindOf = (h) =>
    /دوري|my role/i.test(h) ? "role" : /من الداخل|under the hood/i.test(h) ? "tech" : "plain";
  const html = (md) => marked.parse(md, { async: false, gfm: true }).trim();
  return {
    title,
    lead: lead.join("\n").replace(/^\*\*|\*\*$/g, "").trim(),
    sections: sections.map((sec) => ({ heading: sec.heading, kind: kindOf(sec.heading), html: html(sec.body.join("\n")) })),
  };
}

async function buildPage(slug, dir, p, pdir) {
  const a = p.assets;
  const shots = [];
  ensure(path.join(pdir, "shots"));
  for (const sh of a.screenshots) {
    const src = path.join(dir, sh.file);
    const device = sh.device ?? (sh.file.includes("/mobile/") ? "mobile" : "desktop");
    const name = path.basename(sh.file, path.extname(sh.file));
    const img = await image(src, path.join(pdir, "shots", `${device}-${name}`), device === "mobile" ? [390, 780] : [800, 1600]);
    shots.push({ name, device, lang: sh.lang ?? null, caption: sh.caption, image: img });
  }
  const videos = [];
  ensure(path.join(pdir, "videos"));
  const cache = path.join(SITE, ".cache", "posters");
  for (const v of a.videos) {
    const name = path.basename(v.file, path.extname(v.file));
    const src = path.join(dir, v.file);
    const mp4 = path.join(pdir, "videos", `${name}.mp4`);
    const webm = path.join(pdir, "videos", `${name}.webm`);
    if (!fresh(mp4, src)) ffmpeg("-i", src, "-an", "-c:v", "copy", "-movflags", "+faststart", mp4);
    if (v.webm && !fresh(webm, path.join(dir, v.webm))) copy(path.join(dir, v.webm), webm);
    const png = path.join(cache, `${slug}-${name}.png`);
    if (!fresh(png, src)) ffmpeg("-i", src, "-frames:v", "1", png);
    const poster = await image(png, path.join(pdir, "videos", `${name}-poster`), [960, 1440]);
    videos.push({
      name,
      lang: v.lang ?? null,
      caption: v.caption,
      mp4: `/projects/${slug}/videos/${name}.mp4`,
      webm: v.webm ? `/projects/${slug}/videos/${name}.webm` : null,
      poster,
    });
  }
  let diagram = null;
  if (a.diagram) {
    copy(path.join(dir, a.diagram), path.join(pdir, "diagram.svg"));
    diagram = `/projects/${slug}/diagram.svg`;
  }
  const read = (lang) => parseCaseStudy(fs.readFileSync(path.join(dir, `case-study.${lang}.md`), "utf8"));
  const page = {
    slug,
    role: p.role,
    problem: p.problem,
    solution: p.solution,
    features: p.features,
    results: p.results,
    stack: p.stack,
    techNotes: p.tech_notes,
    caseStudy: { ar: read("ar"), en: read("en") },
    shots,
    videos,
    diagram,
  };
  fs.writeFileSync(path.join(CONTENT, slug, "page.json"), JSON.stringify(page, null, 2) + "\n");
}

/** Copy a file; the source packages are read-only, the copies must not be. */
function copy(src, dest) {
  fs.copyFileSync(src, dest);
  fs.chmodSync(dest, 0o644);
}

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`Packages folder not found: ${SRC}`);
  ensure(CONTENT);
  ensure(PUBLIC);
  const index = [];

  for (const [order, slug] of ORDER.entries()) {
    const dir = path.join(SRC, slug);
    const raw = JSON.parse(fs.readFileSync(path.join(dir, "project.json"), "utf8"));
    const p = Project.parse(raw);
    if (p.slug !== slug) throw new Error(`${slug}: project.json slug is "${p.slug}"`);

    // 1. Text: copied as is.
    const cdir = path.join(CONTENT, slug);
    ensure(cdir);
    for (const f of ["project.json", "case-study.ar.md", "case-study.en.md"]) {
      copy(path.join(dir, f), path.join(cdir, f));
    }

    // 2. Media.
    const pdir = path.join(PUBLIC, slug);
    ensure(pdir);
    const cover = await image(path.join(dir, p.assets.cover), path.join(pdir, "cover"), [800, 1600]);
    let og = null;
    if (p.assets.cover_social) {
      const src = path.join(dir, p.assets.cover_social);
      const out = path.join(pdir, "og.jpg");
      if (!fresh(out, src)) await sharp(src).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
      og = `/projects/${slug}/og.jpg`;
    }

    const loopSrc = path.join(dir, p.assets.card_loop);
    const mp4 = path.join(pdir, "loop.mp4");
    const webm = path.join(pdir, "loop.webm");
    // MP4: same video, no audio, moov atom first so it starts while loading.
    if (!fresh(mp4, loopSrc)) ffmpeg("-i", loopSrc, "-an", "-c:v", "copy", "-movflags", "+faststart", mp4);
    // WebM: the package's own when it has one, otherwise encoded here (VP9).
    const webmSrc = p.assets.card_loop_webm ? path.join(dir, p.assets.card_loop_webm) : fs.existsSync(path.join(dir, "videos/card-loop.webm")) ? path.join(dir, "videos/card-loop.webm") : null;
    if (webmSrc) {
      if (!fresh(webm, webmSrc)) copy(webmSrc, webm);
    } else if (!fresh(webm, loopSrc)) {
      ffmpeg("-i", loopSrc, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "38", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", webm);
    }
    // Poster: the first frame.
    const cache = path.join(SITE, ".cache", "posters");
    ensure(cache);
    const posterPng = path.join(cache, `${slug}.png`);
    if (!fresh(posterPng, loopSrc)) ffmpeg("-i", loopSrc, "-frames:v", "1", posterPng);
    const poster = await image(posterPng, path.join(pdir, "poster"), [960, 1440]);

    // 3. Links between cards. A plain-string `related` entry that repeats
    // `part_of` (Smart Control → Elite) is the same link: keep it once.
    const related = (p.related ?? [])
      .filter((r) => typeof r !== "string")
      .map((r) => ({ slug: r.slug, relation: r.relation }));
    for (const r of [...related, ...(p.part_of ? [p.part_of] : [])]) {
      if (!ORDER.includes(r.slug)) throw new Error(`${slug}: links to unknown project "${r.slug}"`);
    }

    await buildPage(slug, dir, p, pdir);

    index.push({
      slug,
      order,
      tier: p.tier ?? "main",
      status: p.status,
      statusNote: p.status_note ?? null,
      year: p.year,
      title: p.title,
      name: { ar: shortName(p.title.ar), en: shortName(p.title.en) },
      summary: p.summary,
      card: p.card,
      related,
      partOf: p.part_of ? { ...p.part_of, tag: PART_OF_TAG[p.part_of.slug] ?? p.part_of.relation } : null,
      links: p.links,
      media: {
        cover,
        og,
        loop: {
          mp4: `/projects/${slug}/loop.mp4`,
          webm: `/projects/${slug}/loop.webm`,
          poster,
        },
      },
    });
    console.log(`✓ ${slug}`);
  }

  fs.writeFileSync(path.join(CONTENT, "index.json"), JSON.stringify(index, null, 2) + "\n");
  console.log(`Wrote ${rel(path.join(CONTENT, "index.json"))} (${index.length} projects)`);
}

main().catch((e) => {
  console.error(e instanceof z.ZodError ? JSON.stringify(e.issues, null, 2) : e);
  process.exit(1);
});
