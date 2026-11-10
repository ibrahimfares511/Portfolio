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

## Where things live

| Path | What |
| --- | --- |
| `messages/ar.json`, `messages/en.json` | All site copy. Approved copy comes word for word from `_brief/portfolio-sitemap.md`. |
| `COPY-PROPOSED.md` | Copy that is not in the sitemap and still needs Ibrahim's approval. |
| `src/app/globals.css` | Brand tokens ("Sea and Clay"), fonts, base styles. Mirrors the brand pack's `tokens.css`. |
| `src/components/brand/` | The `if` mark and the lockup. |
| `src/components/layout/` | Header, footer, language and theme switches. |
| `MISSING.md` | Assets that are missing and use a placeholder. |

## Copy rules

- Arabic: simple Modern Standard Arabic. Numbers: Western digits only (never format numbers with an `ar` locale without `-u-nu-latn`).
- Wrap numbers such as `+13,000` or `~100` in `className="num"` so their sign stays in place inside Arabic text.
