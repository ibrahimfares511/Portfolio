# ibrahimfares.dev

Ibrahim Fares' portfolio. Next.js 16 (App Router), TypeScript, Tailwind CSS 4, next-intl (`/ar`, `/en`), GSAP.

## Run

```bash
npm install
npm run dev          # http://localhost:3000  → redirects to /ar
npm run build && npm start
```

`next.config.ts` uses `output: "standalone"`: after `npm run build`, the VPS runs
`node .next/standalone/server.js` (copy `public/` and `.next/static/` next to it).
The same code deploys unchanged to Vercel.

## Deploy (VPS)

```bash
npm ci
npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
cd .next/standalone && PORT=3000 HOSTNAME=127.0.0.1 node server.js   # behind nginx/Caddy with HTTPS
```

- Node 22 (`.nvmrc`). Keep it running with pm2 or a systemd service.
- No secrets are needed. `NEXT_PUBLIC_SITE_URL` is only for a staging host (see `.env.example`).
- Security headers (frame blocking, nosniff, referrer and permissions policies, HSTS) and a one-day cache for the media in `public/` are set in `next.config.ts`. HTTPS and the http → https redirect belong to the reverse proxy.
- Contact is by WhatsApp and email links; there is no form and no API route.

## Project content

Project cards and pages read `content/projects/index.json`, generated from the packages in `../projects` (read-only):

```bash
npm run sync   # copies project.json + case studies, optimises covers, card loops and posters into public/projects/
```

Run it again whenever a package changes. The generated files are committed, so a fresh clone builds without the packages folder.

## Where things live

| Path | What |
| --- | --- |
| `messages/ar.json`, `messages/en.json` | All site copy. Approved copy comes word for word from `_brief/portfolio-sitemap.md`. |
| `COPY-PROPOSED.md` | Copy that is not in the sitemap and still needs Ibrahim's approval. |
| `src/app/globals.css` | Brand tokens ("Sea and Clay"), fonts, base styles. Mirrors the brand pack's `tokens.css`. |
| `src/components/brand/` | The `if` mark and the lockup. |
| `src/components/layout/` | Header, footer, language and theme switches. |
| `src/lib/motion-engine.ts` | The brand motion (preloader on every load, the cover for language and theme switches), inlined in `<head>` so it runs before any JS bundle. |
| `src/lib/motion.ts` | React helpers around it (`onReveal`, `coverSwitch`, theme colours). |
| `MISSING.md` | Assets that are missing and use a placeholder. |

## Copy rules

- Arabic: simple Modern Standard Arabic. Numbers: Western digits only (never format numbers with an `ar` locale without `-u-nu-latn`).
- Wrap numbers such as `+13,000` or `~100` in `className="num"` so their sign stays in place inside Arabic text.

## SEO and social images

- `src/app/sitemap.ts` and `src/app/robots.ts` build `/sitemap.xml` and `/robots.txt` from the project list.
- Every page has its title, description, canonical and `ar`/`en` alternates; the base address is `https://ibrahimfares.dev` (or `NEXT_PUBLIC_SITE_URL`).
- Social images: each case study has a branded card per language in `public/og/projects/<slug>-<lang>.jpg` (logo, project name, line, address over the cover), drawn by `python3 scripts/og/render-projects.py [slug…]` against a build on port 3100; the home page uses `public/og/home-ar.jpg` and `home-en.jpg`. To redraw those after changing the hero text: run a build on port 3100, then `python3 scripts/og/render.py` (needs Python Playwright).
- Structured data (JSON-LD): Person + WebSite on the home page, CreativeWork + breadcrumbs on each case study.
