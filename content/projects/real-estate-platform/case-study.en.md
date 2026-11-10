# Bilingual Real Estate Platform

**A real estate marketplace in Arabic and English where a listing goes all the way to a signed contract and recorded payments.**

## The problem

Most property sites stop at "contact the agent". The business behind this platform needed more than that: owners publish their own listings, staff check them before they go public, buyers and tenants send offers, and both sides sign and pay inside the same system. All of it had to work in Arabic first, with a full English version.

## What was built

One web app with four experiences: a public site for visitors, and separate dashboards for property owners, employees and admins. A listing moves through review, publishing, inquiries, viewings and offers. An accepted offer becomes a contract that both parties sign online, and payments are recorded against it with a downloadable receipt.

## Key features

- Search and filter listings by purpose, location, type, price and bedrooms, then open a full property page with gallery, specs, amenities and map.
- List a property with a guided form: prices for sale or rent, specs, amenities, photos and a pinned map location, in both languages.
- Send inquiries, book viewings and make offers; owners and staff answer from their dashboards.
- Sign contracts online: the status updates as each side signs and turns active when both have signed.
- Track payments per contract and download a receipt as PDF.
- Admins review listings before they go live and follow everything through reports and activity logs.

## My role

Frontend, built solo: every screen, routing, roles, both languages, state management and the full integration with the API. The backend (Laravel) was built by a separate developer, and I worked against his API contract.

## Results

- **3 weeks** to build the whole frontend.
- **4** roles served by one codebase, with access checked before a page loads.

## Under the hood

Next.js 16 (App Router), React 19 and TypeScript, Tailwind CSS with shadcn/ui, TanStack Query, React Hook Form with Zod, and next-intl. The code is organised by domain module (api → hooks → components), mirroring the backend modules one to one. In numbers: 49 pages per language across 4 role areas (public, user, employee, admin); 521 translation keys per language, Arabic (RTL) as the default and English (LTR); 9 backend modules integrated (properties, interactions, offers, contracts, payments, reports, notifications, sliders and auth).

- **Access is decided before render.** An edge proxy reads the token and role cookies and redirects at the edge, so a user never sees a screen that isn't theirs, not even for a moment.
- **One set of dashboard screens for three roles.** Offers, inquiries, viewings and payments are shared components with a variant, so a fix in one place reaches every role.
- **Pages degrade instead of crashing.** Server-side requests go through a small `safeServerFetch` wrapper: if one endpoint fails, that section hides and the rest of the page still loads.

## Status

Delivered.
