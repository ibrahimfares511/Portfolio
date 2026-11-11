# Phase 8.1–8.3 checks (Nov 11, 2026)

Lighthouse 12, local production build (`npm run build && npm start`), default throttling
(mobile: slow 4G + 4× CPU; desktop preset).

| Page | Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /ar | mobile | 81 | 100 | 100 | 92* | 3.9 s | 290 ms | 0 |
| /en | mobile | 83 | 100 | 100 | 92* | 3.9 s | 190 ms | 0 |
| /ar | desktop | 99 | 100 | 100 | 92* | 0.8 s | 0 ms | 0.015 |
| /en | desktop | 98 | 97** | 100 | 92* | 0.8 s | 0 ms | 0.005 |
| /ar/projects/wms | mobile | 86 | 100 | 100 | 92* | 3.6 s | 200 ms | 0 |
| /en/projects/haya | desktop | 99 | 100 | 100 | 92* | 0.7 s | 0 ms | 0.005 |

Before this phase, /ar on mobile was 59 (TBT 1,320 ms).

\* The only SEO miss is `canonical`: locally the page is on localhost and the canonical
points to https://ibrahimfares.dev, which Lighthouse rejects. On the real domain it passes.

\** Measured while the hero buttons were still fading in (contrast 1.76 mid-fade). At rest the
clay button is 4.78:1 (AA).

Mobile LCP (~3.6–3.9 s) is held by the preloader: the hero is revealed when it closes. That
is the agreed behaviour (preloader on every load). Real transfer for the home page is ~490 KB.

axe-core (WCAG 2.1 AA + best practice): 0 violations on /ar, /en, a case study in both
lenses, and the 404, light and dark, mobile and desktop.
