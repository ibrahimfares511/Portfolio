# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

No test suite is configured.

## Environment

Copy `.env` and set:
```
VITE_GITHUB_TOKEN=<GitHub personal access token>
```

The token enables GitHub GraphQL API for richer data (contribution history, pinned repos, language colors). Without it, the app falls back to the unauthenticated REST API + jogruber scraper — which works but is rate-limited.

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, GSAP, Three.js / R3F, React Router v6, i18next.

**Single-page portfolio** with two routes: `/` (English) and `/ar` (Arabic). Case study detail pages live at `/projects/:id` and `/ar/projects/:id`. All section components are lazy-loaded; only `HeroSection` and `Navigation` are eagerly bundled.

**Routing drives language, not i18n state.** The URL path is the source of truth for language (`/ar` = Arabic, anything else = English). `App.tsx` syncs i18n language to the URL on every navigation, sets `document.dir`/`document.lang`, persists to `localStorage`, and updates SEO meta tags.

**Data layer — three files:**
- `src/data/portfolioData.ts` — static profile, skills, career, and stats data used across all sections.
- `src/data/caseStudiesData.ts` — full case study content keyed by `{ en: { [id]: CaseStudy }, ar: { [id]: CaseStudy } }`. Adding a new project requires entries in both language keys plus images in `src/assets/projects/<ProjectName>/`.
- `src/data/content.ts` — supplementary content data.

**Translations:** `src/locales/en.json` and `src/locales/ar.json` hold UI strings. Structured data (case studies, career entries) lives in `portfolioData.ts`/`caseStudiesData.ts` with separate `en`/`ar` objects rather than in the JSON files.

**GitHub live data** (`src/hooks/useGithub.ts`) fetches profile, repos, contribution graph, and pinned repos via GraphQL (preferred) with a REST + jogruber scraper fallback. Results are cached in `localStorage` (5 s in dev, 1 h in prod), keyed by username + token prefix.

**Path alias:** `@/` maps to `src/`. Use it everywhere instead of relative imports.

**Build chunking:** Vite splits `vendor` (react/react-dom), `motion` (framer-motion/gsap), and `three` (Three.js/R3F/Drei) into separate chunks to keep the initial bundle small.
