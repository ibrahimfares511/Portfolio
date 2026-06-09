import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'https://ibrahimfares.dev'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`

const DEFAULT_TITLE = 'Ibrahim Fares — Frontend Developer'
const DEFAULT_DESC =
  'Frontend Developer with 4+ years of experience specializing in React.js, TypeScript, and Next.js. Building fast, scalable, pixel-perfect interfaces.'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  jsonLd?: Record<string, unknown>
}

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const lang = i18n.language || 'en'
  const isAr = lang === 'ar'
  const locale = isAr ? 'ar_EG' : 'en_US'

  // Derive canonical URL from current path if not explicitly provided
  const canonicalUrl = url ?? `${BASE_URL}${location.pathname}`

  // Compute EN/AR alternates from the canonical URL
  const enUrl = canonicalUrl.replace(/^https:\/\/ibrahimfares\.dev\/ar(\/|$)/, `${BASE_URL}/`)
  const arUrl = enUrl === `${BASE_URL}/`
    ? `${BASE_URL}/ar`
    : enUrl.replace(`${BASE_URL}/`, `${BASE_URL}/ar/`)

  // Resolve relative image paths
  const resolvedImage = image.startsWith('http') ? image : `${BASE_URL}${image}`

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ibrahim Fares',
    url: BASE_URL,
    jobTitle: 'Frontend Developer',
    description: 'Frontend Developer with 4+ years building React.js applications',
    sameAs: [
      'https://github.com/ibrahimfares511',
      'https://linkedin.com/in/ibrahimfares511',
    ],
    knowsAbout: ['React.js', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Frontend Development'],
  }

  return (
    <Helmet>
      {/* Basic */}
      <html lang={lang} dir={isAr ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Ibrahim Fares" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="image" property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Ibrahim Fares Portfolio" />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@ibrahimfares511" />

      {/* hreflang alternates */}
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ar" href={arUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      {/* Person JSON-LD (always present) */}
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>

      {/* Page-specific JSON-LD (case studies etc.) */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
