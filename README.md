# ibrahimfares.dev

Ibrahim Fares' portfolio. Next.js 16 (App Router), TypeScript, Tailwind CSS 4, next-intl (`/ar`, `/en`), next-themes, GSAP.

## Run

```bash
npm install
npm run dev          # http://localhost:3000  → redirects to /ar
npm run build && npm start
```

`next.config.ts` uses `output: "standalone"`: after `npm run build`, the VPS runs
`node .next/standalone/server.js` (copy `public/` and `.next/static/` next to it).
The same code deploys unchanged to Vercel.

## Contact form

`/api/contact` emails each message to Ibrahim through SMTP. Copy `.env.example` to `.env.local` (or set the same variables on the server) and fill in the SMTP account. With Gmail: turn on 2-step verification, create an App password, and use it as `SMTP_PASS`. In development without SMTP, messages are printed in the terminal instead. Spam guards: a hidden honeypot field, a minimum time on the form, and 5 messages per 10 minutes per IP.

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
