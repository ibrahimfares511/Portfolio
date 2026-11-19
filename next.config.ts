import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security headers on every response. No script policy (CSP script-src): the
 * brand motion engine and the JSON-LD are inline <script>s, so a strict
 * script policy would need nonces. What is set here is safe for the site as
 * it is: no framing by other sites, no plugins, links and forms stay on this
 * origin, and the browser never guesses content types.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Only honoured over HTTPS; one year, sub-domains included (no preload list).
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

/** Media in /public keep their names when re-synced, so they are cached for a day (and served stale while refreshing). */
const mediaCache = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };

const nextConfig: NextConfig = {
  // Self-contained server build: runs on the VPS with `node server.js`,
  // and still deploys unchanged to Vercel.
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/projects/:path*", headers: [mediaCache] },
      { source: "/avatar/:path*", headers: [mediaCache] },
      { source: "/og/:path*", headers: [mediaCache] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
