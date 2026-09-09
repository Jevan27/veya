---
name: seo
description: >-
  Production-grade SEO engineering, search discoverability, metadata architecture,
  structured data (JSON-LD), Core Web Vitals, and technical on-page optimization for Veya's
  public web surfaces. Use when building or auditing public web pages, landing pages,
  dynamic digital card profiles, robots.txt, sitemaps, canonical tags, and Open Graph previews.
---

# SEO Engineering Skill for Veya

This skill defines the technical standards, architectural rules, metadata conventions, structured data schemas, crawlability governance, and audit workflows for search engine optimization (SEO) across Veya's public-facing web applications (`frontend/`), built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind/Vanilla CSS.

This skill is **exclusively responsible for technical and on-page SEO engineering**. It treats SEO as a software engineering discipline grounded in search engine discoverability, semantic HTML, structured data, web performance, and user intent—never as superficial keyword manipulation.

---

## 1. Purpose

The objective of this skill is to provide a production-grade, repeatable SEO engineering framework that ensures:
1. **Search Engine Discoverability**: Search crawlers (Googlebot, Bingbot, etc.) can efficiently crawl, render, and index public Veya pages.
2. **Technical Correctness**: Canonical URLs, robots directives, sitemaps, HTTP status codes, and redirects adhere strictly to IETF, W3C, and search engine specifications.
3. **Intent-Driven Information Architecture**: Content, metadata, and document hierarchies directly resolve user search intent.
4. **Structured Data Fidelity**: High-fidelity Schema.org JSON-LD entities enable rich search snippets without fabricating data.
5. **Security & Privacy Isolation**: Private user data, authenticated dashboards, and unlisted business cards are never leaked or exposed to search crawlers.
6. **Zero Bloat / Native-First**: Framework-native capabilities (e.g., Next.js 15 Metadata API, Route Handlers, `sitemap.ts`, `robots.ts`) are leveraged before introducing third-party packages.

---

## 2. When to Use This Skill & Skill Boundaries

### Activate this skill when:
- Creating, modifying, or auditing public-facing web pages in `frontend/app/`.
- Configuring global or page-level metadata (`<title>`, meta descriptions, Open Graph, Twitter/X cards, alternates/canonical).
- Implementing or generating `robots.txt` (`app/robots.ts`) or XML sitemaps (`app/sitemap.ts`).
- Building dynamic public profile pages (e.g., public digital business cards at `/card/[identifier]`).
- Implementing or validating Schema.org JSON-LD structured data (`Organization`, `WebApplication`, `ProfilePage`, `Person`, `FAQPage`, etc.).
- Optimizing Core Web Vitals (LCP, INP, CLS), semantic HTML, heading hierarchies, and image optimization for web pages.
- Designing URL structures, routing slugs, redirect strategies (301/308), or custom 404 error boundaries (`not-found.tsx`).
- Reviewing public copy and landing page content for search intent, keyword alignment, and E-E-A-T principles.

### Cross-Skill Boundaries:
- **Web Frontend Code (`seo + frontend-development`)**:
  When authoring React components, layouts, and page routing in `frontend/app/`, ensure adherence to Next.js 15 Server Component patterns and TypeScript standards. Mobile code in `app/` is out of scope for SEO.
- **Backend API & Data Contracts (`seo + backend-development`)**:
  When sitemaps or public card pages require server endpoints (e.g., `/api/v1/public/cards/:identifier`), coordinate with `backend-development` to ensure public DTO isolation (`PublicCardDto`) and appropriate caching headers.
- **Application Security (`seo + security`)**:
  When determining indexing rules for user profiles, cards, and account surfaces, strictly enforce data boundary rules. Private cards (`isPublished: false`), user IDs, contact secrets, and authenticated routes must never be exposed or indexed.
- **Visual Design & Layouts (`seo + ui-design`)**:
  When styling landing pages, typography, cards, and social share previews, coordinate with `ui-design` for design tokens, dark/light themes, and accessibility contrast.
- **Automated Verification (`seo + testing`)**:
  When writing end-to-end or integration tests verifying metadata output, HTTP status codes, or sitemap validity, coordinate with `testing`.

---

## 3. Core Principles & Philosophy

1. **SEO is Quality Engineering**: Search engines rank fast, accessible, semantically structured, and genuinely useful pages. SEO is an emergent property of great engineering, clear copywriting, and correct technical configuration.
2. **Intent Over Keyword Density**: Optimize for what users need to accomplish, not arbitrary keyword percentages. Match search intent with high-clarity copy.
3. **Zero Hallucination / Zero Fabrication**: Never generate fake ratings, fake user counts, non-existent product features, or deceptive structured data. All metadata must reflect verifiable product reality.
4. **Security & Privacy First**: SEO must never compromise user privacy. Public profile indexing must respect publication flags (`isPublished: true`), user consent, and security boundaries.
5. **Native-First Dependency Discipline**: Do not add npm packages for capabilities that Next.js 15 and web standards provide natively.

---

## 4. Project Inspection Protocol

Before authoring or modifying any SEO-related configuration or page in Veya, the AI **must** execute this deterministic inspection protocol:

```text
1. Inspect Package & Framework Configuration
   ↓ (frontend/package.json, next.config.mjs)
2. Inspect Route Tree & Rendering Strategy
   ↓ (frontend/app/layout.tsx, page.tsx, card/[identifier]/page.tsx)
3. Inspect Current Metadata & Robots/Sitemap Setup
   ↓ (Search for generateMetadata, robots.ts, sitemap.ts, public/robots.txt)
4. Inspect Data Fetching & Public Endpoints
   ↓ (frontend/lib/api.ts, backend/src/cards/public-cards.controller.ts)
5. Inspect Shared Contracts & Security Boundaries
   ↓ (packages/shared/src/cards/types.ts -> PublicCardDto vs CardDto)
6. Inspect Environment Variables
   ↓ (NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_API_URL in .env, frontend/app/layout.tsx)
```

### Inspection Checklist:
- **Framework & Version**: Confirm Next.js version (currently `^15.2.0`), React version (`19.2.3`), and routing paradigm (`app/` App Router).
- **Rendering Model**: Confirm whether pages run as React Server Components (RSC), Client Components (`'use client'`), Static (SSG), or Dynamic Server Rendering (SSR / ISR via `revalidate`).
- **Base URL Configuration**: Check `metadataBase` in `frontend/app/layout.tsx` and environment variable `NEXT_PUBLIC_SITE_URL` (default: `https://veya.app`).
- **Public vs. Private Routes**:
  - Public marketing routes: `/`, `/card/[identifier]`
  - Future marketing routes: `/features`, `/download`, `/about`, `/faq`, `/contact`, `/pricing`
  - Private mobile app endpoints / authenticated APIs: `backend/src/` routes requiring `JwtAuthGuard` (must never be linked or indexed).

---

## 5. Dependency Rules & Framework-First Architecture

### Rule: Do not install an SEO library simply because one exists.

Next.js 15 provides built-in, first-class primitives for all core SEO requirements:
- Metadata & Open Graph: Native `Metadata` and `Viewport` types via `next`.
- Dynamic Meta: Native `generateMetadata()` asynchronous lifecycle function.
- Sitemaps: Native `app/sitemap.ts` (returns `MetadataRoute.Sitemap`).
- Robots: Native `app/robots.ts` (returns `MetadataRoute.Robots`).
- Image Optimization: Native `next/image` with AVIF/WebP conversion, layout shift prevention, and lazy loading.
- Font Optimization: Native `next/font/google` (zero CLS, self-hosted font optimization).
- JSON-LD Structured Data: Native React `<script type="application/ld+json">` embedded in Server Components.

### Evaluation Criteria Before Proposing Any Dependency:
1. **Can native Next.js 15 features solve the problem?** If yes, use native Next.js.
2. **Can existing project packages solve the problem?** If yes, reuse them.
3. **What is the bundle and runtime impact?** Avoid any client-side runtime overhead.
4. **Is the package actively maintained and compatible with React 19?**
5. If a third-party package is deemed helpful (e.g., `schema-dts` for TypeScript type-checking of JSON-LD), **recommend it in the implementation plan for user review** rather than silently installing it.

---

## 6. Technical SEO & Indexability

Search engine crawlers must be given unambiguous instructions regarding what to crawl and index:

### Core Directives Matrix:

| Page Category | Example Route | Robots Directives | Canonical Target | Sitemap Status |
| :--- | :--- | :--- | :--- | :--- |
| **Root Landing Page** | `/` | `index, follow` | `https://veya.app/` | Included |
| **Public Marketing** | `/features`, `/download`, `/faq` | `index, follow` | Absolute URL | Included |
| **Published Public Card** | `/card/jevan-veya` | `index, follow` (if public) | Absolute slug URL | Dynamic Sitemap |
| **Unpublished / Private Card** | `/card/[draft-id]` | `noindex, nofollow` | None (or self) | Excluded |
| **Card Not Found (404)** | `/card/non-existent` | `noindex, nofollow` (via 404 status) | None | Excluded |
| **API Endpoints** | `/api/v1/*` | Disallowed via `robots.txt` | N/A | Excluded |
| **Internal / Auth Routes** | `/dashboard`, `/admin` | `noindex, nofollow` + Disallow | N/A | Excluded |

### Invariants:
- Never rely on `robots.txt` for security or privacy. Robots.txt prevents crawling, not indexing (pages can still be indexed if linked externally).
- For private or unpublished resources, always return a `noindex, nofollow` robots meta tag or a true `404 Not Found` HTTP status code.

---

## 7. Metadata Architecture (Next.js 15 App Router)

Next.js 15 provides a declarative Metadata API. All public pages must define metadata either statically (`export const metadata: Metadata`) or dynamically (`export async function generateMetadata()`).

### Root Layout Pattern (`frontend/app/layout.tsx`):
```typescript
import type { Metadata, Viewport } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://veya.app';

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Veya — Digital Business Cards & Contactless Networking',
    template: '%s | Veya',
  },
  description: 'Instant, contactless digital business cards for modern professionals. Share your profile via QR, NFC, or direct link with zero app required.',
  applicationName: 'Veya',
  authors: [{ name: 'Veya Team', url: siteUrl }],
  generator: 'Next.js',
  keywords: [
    'digital business card',
    'contactless business card',
    'virtual business card',
    'NFC business card',
    'vCard QR code',
    'professional networking',
  ],
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Veya',
    title: 'Veya — Digital Business Cards & Contactless Networking',
    description: 'Instant, contactless digital business cards for modern professionals. Share your profile via QR, NFC, or link.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Veya — Digital Business Cards',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veya — Digital Business Cards',
    description: 'Instant, contactless digital business cards for modern professionals.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
};
```

---

## 8. Title Tag Engineering

The `<title>` tag is the most critical on-page SEO signal and primary SERP headline.

### Guidelines:
- **Length**: Target 50–60 characters (prevent SERP truncation around 600px width).
- **Structure**:
  - Landing Page: `Primary Value Proposition — Brand` (e.g., `Veya — Digital Business Cards & Contactless Networking`)
  - Feature Page: `Feature Name — Specific Benefit | Veya` (e.g., `NFC & QR Sharing — Instant Contact Exchange | Veya`)
  - Public Card: `Full Name — Role | Company` (e.g., `Jevan Campillos — Product Designer | Veya`)
- **Intent Alignment**: Every title must immediately clarify what the user will find on the page.
- **No Keyword Stuffing**: Avoid unnatural strings like `Digital Business Card, Best Virtual Card, Free NFC Card, Online Business Card | Veya`.

---

## 9. Meta Descriptions

The meta description serves as the click-through invitation on the SERP.

### Guidelines:
- **Length**: Target 140–160 characters (truncate gracefully before 160).
- **Content Requirements**:
  1. Clearly summarize the page's unique value proposition.
  2. Include primary target terms naturally.
  3. Include an active, benefit-driven call-to-action (e.g., "Share instantly with QR or NFC," "Save contact directly to your phone").
  4. Ensure 100% unique descriptions per page—never repeat the same description across different public routes.
- **Deception Ban**: Never promise information or tools not present on the actual page.

---

## 10. Canonical URLs & URL Normalization

Canonicalization specifies the definitive authoritative URL for a resource to eliminate duplicate content indexing.

### Rules:
1. **Always Use Absolute URLs**:
   ```typescript
   alternates: {
     canonical: `https://veya.app/card/${identifier}`,
   }
   ```
2. **Consistent Protocol and Host**:
   - Always enforce `https://`.
   - Never mix `www` and non-`www` (Veya standard: `https://veya.app`).
3. **Trailing Slash Consistency**:
   - Veya standard: No trailing slashes on sub-paths (`https://veya.app/features`, not `https://veya.app/features/`).
4. **Clean Query Parameters**:
   - Strip tracking parameters (`?utm_source=...`, `?ref=...`) from canonical tags.
5. **Slug Normalization for Public Cards**:
   - If a card has a vanity slug (`/card/jevan-veya`), the canonical must point to the slug route, even if accessed via raw UUID (`/card/123e4567-e89b-12d3-a456-426614174000`).

---

## 11. Robots Directives & Search Bot Directives

Control bot access with granular directives via `generateMetadata()`:

### Published Public Card:
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
}
```

### Unpublished / Private Card / Non-Existent:
```typescript
robots: {
  index: false,
  follow: false,
  noimageindex: true,
  nocache: true,
}
```

---

## 12. XML Sitemap Architecture (Static & Dynamic)

Use Next.js 15 native Route file `frontend/app/sitemap.ts`:

```typescript
// frontend/app/sitemap.ts
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://veya.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Marketing Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Public Card Routes (Only published public cards)
  // Fetch from backend public endpoint or read-only public view
  let cardRoutes: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/v1/public/cards/sitemap-indices`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (res.ok) {
      const slugs: { slug: string; updatedAt: string }[] = await res.json();
      cardRoutes = slugs.map((card) => ({
        url: `${BASE_URL}/card/${encodeURIComponent(card.slug)}`,
        lastModified: new Date(card.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
  } catch {
    // Graceful fallback if backend index endpoint is not yet configured
  }

  return [...staticRoutes, ...cardRoutes];
}
```

### Sitemap Inclusion Rules:
- **Include**: 200 OK canonical public marketing pages and actively published public profile cards.
- **Exclude**:
  - Redirects (301/302).
  - Dead / missing pages (404/410).
  - Authenticated user dashboards or settings.
  - Cards where `isPublished === false`.
  - Non-canonical duplicate URLs or raw query strings.

---

## 13. robots.txt Configuration & Crawl Governance

Use Next.js 15 native Route file `frontend/app/robots.ts`:

```typescript
// frontend/app/robots.ts
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://veya.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/settings/',
          '/auth/',
          '/_next/',
          '/card/*?*', // Prevent crawl of query parameters on card routes
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Critical Security Reminder:
`robots.txt` is an advisory crawling guide, **NOT an access control mechanism**. Never place confidential URLs or tokens inside `robots.txt` expecting them to remain hidden. Sensitive endpoints must always require server-side authentication (`JwtAuthGuard`).

---

## 14. URL Architecture & Slug Design

URL structures should be clean, readable, intuitive, and permanent.

### URL Standards for Veya:
- **Root**: `https://veya.app/`
- **Marketing**: `https://veya.app/features`, `https://veya.app/download`, `https://veya.app/faq`
- **Public Card**: `https://veya.app/card/[slug]` (e.g., `https://veya.app/card/jevan-campillos`)
- **Use Hyphens, Not Underscores**: `digital-business-card`, never `digital_business_card`.
- **Lowercase Only**: Always enforce lowercase paths.
- **Avoid Deep Nesting**: Limit URL depth to 2–3 segments max.
- **URL Stability**: Never alter production URLs without implementing permanent (301/308) redirects to prevent breaking external backlinks and search indexes.

---

## 15. Semantic HTML & Document Hierarchy

Search engines build content models using HTML5 semantic elements. Do not construct pages purely out of `<div>` and `<span>` tags.

### Semantic Elements Checklist:
- `<header>`: Page or section branding, navigation, and top-level identity.
- `<nav>`: Primary navigation links (must include `aria-label` if multiple navs exist).
- `<main>`: Primary unique content container for the document (only one per page).
- `<article>`: Self-contained composition (e.g., the digital business card component itself, a blog post, a review item).
- `<section>`: Thematic grouping of content, typically with a heading (`<h2>`–`<h6>`).
- `<aside>`: Tangential or related content (e.g., quick download links, related cards).
- `<footer>`: Copyright, auxiliary links, contact details, legal badges.

### Link & Action Semantics:
- **Navigation**: Use `<Link href="...">` or `<a href="...">` for navigation to any URL or anchor. Search crawlers **cannot** follow button clicks or `onClick={() => router.push(...)}`.
- **Actions**: Use `<button>` exclusively for state changes, modal triggers, or form submissions that do not navigate to a unique URL.

---

## 16. Heading Structure

A logical heading tree enables search engines to map content hierarchy:

```text
<h1> Veya Business Cards (One per page, describes primary topic)
 ├── <h2> Instant Contactless Sharing
 │    ├── <h3> QR Code Exchange
 │    └── <h3> NFC One-Tap Connection
 ├── <h2> Enterprise-Grade Card Customization
 │    ├── <h3> Curated Themes & Typography
 │    └── <h3> Dynamic vCard Generation
 └── <h2> Frequently Asked Questions
```

### Heading Invariants:
1. **Exactly One Primary `<h1>`**: Every public page must contain one prominent `<h1>` that states the page's core subject.
2. **Never Skip Levels**: Do not jump from `<h1>` directly to `<h3>` for visual sizing. Use CSS styling classes to adjust font size while maintaining the semantic DOM tag.
3. **Descriptive Text**: Headings must contain descriptive keywords naturally representing the sub-topic. Avoid vague headings like "More Info" or "Features."

---

## 17. Internal Linking & Information Architecture

Internal links distribute link equity (PageRank) and establish topical relationships.

### Internal Linking Guidelines:
- **Descriptive Anchor Text**: Always write contextual, descriptive anchor text:
  - Good: `<Link href="/features">Explore Veya's digital card customization features</Link>`
  - Anti-pattern: `<Link href="/features">Click here</Link>` or `<Link href="/features">Learn more</Link>`
- **Hierarchical Breadcrumbs**: For nested routes, provide breadcrumb navigation and annotate it with `BreadcrumbList` schema.
- **Footer Navigation**: Maintain crawl paths to all critical marketing, legal (Terms, Privacy), and informational pages in the global footer.

---

## 18. Image SEO & Media Optimization

Images contribute directly to user experience and Core Web Vitals (LCP/CLS) and appear in image search results.

### Rules for Next.js 15:
1. **Use `next/image`**: Always utilize the Next.js `<Image />` component over plain `<img>` tags for automatic WebP/AVIF conversion and responsive `srcset`.
2. **Descriptive Alt Text**:
   - Alt text primarily serves **accessibility** for visually impaired users.
   - For user avatars: `alt="Jevan Campillos, Product Designer at Veya"`
   - For icons/decorative graphics: `alt=""` and `aria-hidden="true"`.
   - **Never** stuff keywords into alt tags (e.g., `alt="digital business card free vcard qr code"` is prohibited).
3. **Explicit Dimensions**: Always supply `width` and `height` or `fill` with `sizes` to eliminate Cumulative Layout Shift (CLS).
4. **Priority Loading**: Mark hero images or primary card avatars above-the-fold with `priority` to improve Largest Contentful Paint (LCP). Mark all below-the-fold images with lazy loading (default in `next/image`).

---

## 19. Structured Data (Schema.org / JSON-LD)

Structured data translates visual content into machine-readable knowledge graphs. Veya uses JSON-LD embedded via `<script type="application/ld+json">` in Server Components.

### Approved Schemas for Veya:

#### 1. SoftwareApplication / WebApplication (Homepage & Features)
```typescript
export function WebApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Veya',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    url: 'https://veya.app',
    description: 'Instant, contactless digital business cards designed for modern networking.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

#### 2. ProfilePage & Person (Public Business Card at `/card/[identifier]`)
```typescript
import { PublicCardDto } from '@veya/shared';

export function CardJsonLd({ card, url }: { card: PublicCardDto; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: card.name,
      jobTitle: card.role || undefined,
      worksFor: card.company
        ? {
            '@type': 'Organization',
            name: card.company,
          }
        : undefined,
      description: card.slogan || undefined,
      image: card.avatarUrl || undefined,
      url: url,
      telephone: card.phoneNumber || undefined,
      email: card.email || undefined,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

#### 3. Organization (Brand Identity)
```typescript
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Veya',
    url: 'https://veya.app',
    logo: 'https://veya.app/logo.png',
    sameAs: [
      'https://twitter.com/veyaapp',
      'https://linkedin.com/company/veyaapp',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Strict Non-Negotiable Rules for Structured Data:
- **No Fabricated Information**: Never add `aggregateRating`, `reviewCount`, or `Review` unless verified, real customer reviews exist.
- **Match Visible DOM Content**: Every attribute declared in JSON-LD must be visible or verifiable on the rendered page.
- **Valid JSON-LD Syntax**: Never output unescaped characters or broken JSON.

---

## 20. Open Graph Protocol

Open Graph (OG) metadata governs how links preview when shared on Facebook, LinkedIn, Slack, WhatsApp, and iMessage.

### Standard Open Graph Configuration:
- `og:site_name`: Always `Veya`.
- `og:title`: Crisp headline (50–60 characters).
- `og:description`: Contextual summary matching search intent.
- `og:url`: Absolute canonical URL.
- `og:type`: `website` for marketing pages, `profile` for public digital cards.
- `og:image`: High-resolution 1200x630px image (1.91:1 ratio) with explicit `width`, `height`, and `alt`.
- `og:locale`: `en_US` (or dynamic locale when multilingual is enabled).

---

## 21. Twitter / X Cards Metadata

Provides rich visual cards on Twitter/X:
- `twitter:card`: `summary_large_image` for landing/marketing pages with prominent artwork; `summary` for compact personal card cards.
- `twitter:title`: Concise, brand-aligned title.
- `twitter:description`: Value proposition snippet.
- `twitter:image`: Absolute image URL.

---

## 22. Social Sharing & Rich Previews

When a Veya digital card URL is shared in SMS or WhatsApp, the recipient should immediately see the professional's photo, name, role, and company.
- Verify that `generateMetadata` in `frontend/app/card/[identifier]/page.tsx` supplies `card.avatarUrl` as `openGraph.images` and `twitter.images`.
- Fall back gracefully to a high-quality brand card image when no custom avatar is uploaded.

---

## 23. Mobile SEO & Viewport Architecture

Over 80% of Veya card views occur on mobile devices via QR code scan or NFC tap. Mobile usability is a primary Google indexing criterion (Mobile-First Indexing).

### Invariants:
1. **Correct Viewport Tag**:
   ```typescript
   export const viewport: Viewport = {
     width: 'device-width',
     initialScale: 1,
     maximumScale: 5, // Never disable user pinch-to-zoom (accessibility violation)
     themeColor: '#0B0F19',
   };
   ```
2. **Touch Targets**: All interactive elements (buttons, phone links, vCard download) must have minimum touch targets of 44x44 CSS pixels with adequate padding.
3. **Responsive Typography & Breakpoints**: Fluid typography ensuring no horizontal overflow or text clipping on screens down to 320px width.

---

## 24. Performance & Core Web Vitals (LCP, INP, CLS)

Search engines penalize sluggish websites. Next.js 15 provides server rendering and asset optimization, which must be carefully maintained:

### Metric Thresholds:
- **Largest Contentful Paint (LCP)**: < 2.5 seconds.
  - Optimize: Preload hero fonts via `next/font/google`, mark primary card avatar with `priority={true}` in `next/image`, cache API responses.
- **Interaction to Next Paint (INP)**: < 200 milliseconds.
  - Optimize: Minimize main-thread JavaScript execution, keep Server Components lean, avoid heavy client-side libraries.
- **Cumulative Layout Shift (CLS)**: < 0.1.
  - Optimize: Reserve space for images, skeletons (`CardSkeleton.tsx`), and dynamic banners before assets load. Use font `display: 'swap'` with font variables.

---

## 25. Accessibility & SEO Synergy

Search engine bots navigate HTML much like screen readers. What aids screen readers directly improves crawler comprehension.

### Synergistic Practices:
- **Color Contrast**: Ensure text satisfies WCAG 2.1 AA contrast ratio (4.5:1 for body text, 3:1 for large text).
- **Aria Labels**: Use `aria-label` on icon-only buttons (e.g., social links, QR trigger, copy button).
- **Accessible Form Elements**: Any future input or contact field must feature explicit `<label for="...">` associations.

---

## 26. JavaScript Rendering & Bot Discoverability

Search engines execute JavaScript, but client-side rendering introduces crawl delays and rendering queue bottlenecks.

### Rules:
- **Render SEO Content on the Server**: All critical marketing copy, card profile details, headings, and internal links must be delivered in the initial Server-Rendered HTML response.
- **Client Components (`'use client'`) Boundary Discipline**:
  - Restrict `'use client'` to interactive leaf components (e.g., `SaveContactButton.tsx`, `CardActionButtons.tsx`, copy-to-clipboard handlers).
  - Page shells (`page.tsx`) and layout shells (`layout.tsx`) must remain Server Components.
- **No Invisible Critical Data**: Do not fetch initial card profile data inside a client-side `useEffect()`. Always fetch on the server in `PublicCardPage({ params })`.

---

## 27. SPA / SSR / SSG & Hybrid Rendering Considerations

Next.js 15 supports multiple rendering modes. Choose the appropriate model:
- **Static Pages (`SSG`)**: Pure marketing pages (`/`, `/features`, `/faq`) can be statically prerendered at build time for instant CDN delivery.
- **Incremental Static Regeneration (`ISR`)**: Public digital cards (`/card/[identifier]`) should utilize cached server fetches with time-based revalidation:
  ```typescript
  fetch(url, { next: { revalidate: 60 } }); // Cache at edge, revalidate every 60s
  ```
- **Dynamic (`SSR`)**: Reserved for pages requiring per-request data (e.g., real-time geo-personalization).

---

## 28. Duplicate Content Prevention

Duplicate content splits search signals and degrades rankings.

### Defenses:
1. Canonical tags on every public page.
2. Parameter handling: Disallow parameter variations in `robots.txt` (`/card/*?*`).
3. Lowercase redirects: Ensure URLs are matched case-insensitively or 301-redirected to lowercase.
4. Slug priority: Always canonicalize UUID-based URLs to clean vanity slugs if a vanity slug exists.

---

## 29. Indexing and Crawlability Management

Manage bot crawl budgets and indexing prioritization:
- Disallow non-indexable utilities, internal API routes, and build artifacts in `robots.txt`.
- Set `max-image-preview: large` in robots metadata to enable rich Google Discover and search card features.
- Avoid infinite crawl traps caused by dynamic faceted navigation or infinite query params.

---

## 30. Redirects Strategy (301, 302, 307, 308)

When modifying URLs, preserve inbound link equity:
- **301 / 308 Permanent Redirect**: Use when a page or slug has permanently moved. In Next.js `next.config.mjs`:
  ```javascript
  async redirects() {
    return [
      {
        source: '/old-card/:slug',
        destination: '/card/:slug',
        permanent: true, // Emits 308
      },
    ];
  }
  ```
- **302 / 307 Temporary Redirect**: Use only for maintenance, geo-routing, or temporary testing.
- **Prevent Chains**: Never redirect `A -> B -> C`. Always redirect directly `A -> C`.

---

## 31. 404 / 410 Error Pages & Soft 404 Avoidance

### The Soft 404 Hazard:
A "Soft 404" occurs when a missing resource displays an error message ("Card Not Found") but returns an `HTTP 200 OK` status code. Search engines will treat this as a thin, low-quality page and may index it.

### Correct Pattern for Veya:
In `frontend/app/card/[identifier]/page.tsx`:
```typescript
import { notFound } from 'next/navigation';

export default async function PublicCardPage({ params }: PageProps) {
  const { identifier } = await params;
  const card = await fetchPublicCard(identifier);

  if (!card) {
    // Triggers Next.js not-found.tsx and sets HTTP 404 status code
    notFound();
  }

  return (/* ... card render ... */);
}
```
Provide a dedicated `frontend/app/not-found.tsx` that presents helpful navigation back to `https://veya.app` with a true 404 status.

---

## 32. International SEO & Multilingual Architecture (hreflang)

If Veya expands to localized versions (e.g., `es`, `fr`, `de`):
- Implement `alternates.languages` in Next.js metadata:
  ```typescript
  alternates: {
    canonical: 'https://veya.app/features',
    languages: {
      'en-US': 'https://veya.app/features',
      'es-ES': 'https://veya.app/es/features',
    },
  }
  ```
- Match each localized URL with reciprocal hreflang links.
- **Rule**: Do not implement hreflang tags until localized routes and translated content actually exist.

---

## 33. Local SEO Considerations

If Veya registers physical office locations or local merchant operations in the future:
- Implement `LocalBusiness` schema with Name, Address, Phone (NAP), opening hours, and geo-coordinates.
- **Rule**: Never add `LocalBusiness` schema for a pure SaaS product without a physical, public commercial premises.

---

## 34. Content Strategy & Quality Standards

Content must demonstrate genuine value, authority, and clarity.

### Content Quality Pillars:
1. **Originality**: Every page must communicate unique Veya benefits (e.g., NFC instant exchange, dynamic vCard download, privacy-first infrastructure).
2. **Clarity**: Use active voice, clear value propositions, and professional terminology.
3. **No AI Slop / Thin Content**: Avoid generic, auto-generated paragraphs that rephrase the same concept five times without adding actionable information.
4. **Visual Hierarchy**: Break long text into scannable chunks with subheadings, feature cards, bullet points, and high-quality graphics.

---

## 35. Keyword Research & Semantic Repertoire

Keywords should reflect natural user search behavior across the digital networking domain.

### Core Keyword Clusters for Veya:
- **Primary Domain Terms**: `digital business card`, `contactless business card`, `virtual business card`, `electronic business card`.
- **Feature & Hardware Terms**: `NFC business card`, `QR code business card`, `vCard export`, `contact sharing app`.
- **Use-Case & Audience Terms**: `digital business card for teams`, `realtor digital business card`, `executive virtual card`, `modern professional networking`.
- **Intent Mapping**:
  - Informational: "How does an NFC digital business card work?" -> Blog / Guide
  - Commercial Investigation: "Best digital business card apps 2026" -> Feature comparison / Homepage
  - Transactional: "Create digital business card" -> Landing page signup / App download

---

## 36. Search Intent Classification & Alignment

Every URL must serve a singular, unambiguous search intent:

| Search Intent | User Goal | Veya Surface | Target UX |
| :--- | :--- | :--- | :--- |
| **Informational** | Understand how digital cards work | `/faq`, `/about` | Clear answers, diagrams, step-by-step guides |
| **Commercial** | Compare features, pricing, security | `/features`, `/` | Feature grids, security badges, style showcases |
| **Transactional** | Download app, create a card | `/download`, CTA | Frictionless app store buttons, instant signup |
| **Navigational** | View a specific person's profile | `/card/[identifier]` | Direct card display, 1-tap "Save Contact" vCard |

---

## 37. On-Page Optimization Standards

When authoring or auditing a public page, verify this on-page checklist:
- [ ] URL slug is lowercase, hyphenated, and descriptive.
- [ ] `<title>` is under 60 characters and front-loads primary keyword.
- [ ] Meta description is 140–160 characters with clear call-to-action.
- [ ] Exactly one semantic `<h1>` matching page theme.
- [ ] Logical `<h2>` and `<h3>` hierarchy without skipped heading levels.
- [ ] Canonical URL is absolute and configured in metadata.
- [ ] Open Graph and Twitter card tags are fully populated with image.
- [ ] All images use `next/image` with width, height, and meaningful `alt` text.
- [ ] Primary CTA is clearly distinguishable and accessible.
- [ ] JSON-LD structured data is present and validated.

---

## 38. Content Quality & Thin Content Prevention

Search engines actively de-index or down-rank thin pages.
- **Minimum Viable Depth**: Landing pages must contain substantive explanations of product features, use cases, FAQs, and security guarantees.
- **No Doorway Pages**: Never create multiple pages targeting nearly identical queries (e.g., `/digital-business-card-nyc`, `/digital-business-card-chicago`) without unique, localized, value-additive content.

---

## 39. E-E-A-T Principles for SaaS & Digital Business Cards

Google's Search Quality Evaluator Guidelines emphasize Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T).

### Implementing E-E-A-T for Veya:
1. **Trust & Security Transparency**: Display verified security badges ("End-to-End Encryption," "Cloudflare R2 Storage," "SOC2 Compliant Cloud").
2. **Contact & Company Information**: Provide a dedicated company contact path (`support@veya.app` or `/contact`).
3. **Legal Compliance**: Prominently link Privacy Policy (`/privacy`) and Terms of Service (`/terms`) in the global footer.
4. **Authentic Social Proof**: Display real, verifiable testimonials or partner endorsements only. Never fabricate quotes or avatars.

---

## 40. Landing Page SEO & Conversion Rate Optimization (CRO)

SEO drives traffic; CRO converts traffic into active users. Neither should compromise the other.

### The Balanced Formula:
- **Hero Section**: Strong H1, supporting subhead, prominent App Store / Google Play CTA buttons, and an interactive or visually stunning card preview.
- **Proof Section**: Feature cards (Instant Save, Custom Styles, NFC/QR, Cloud Sync).
- **Interactive Preview**: Live demonstration of digital business card rendering.
- **FAQ Section**: Resolves pre-signup friction and provides rich snippet opportunities.
- **Footer CTA**: Secondary conversion trigger for users who scroll to the end of the page.

---

## 41. SaaS & Product SEO Architecture

Organize public web surfaces systematically:
```text
frontend/app/
├── layout.tsx              # Global layout, fonts, root metadataBase, viewport
├── page.tsx                # Homepage (Primary SaaS Landing)
├── not-found.tsx           # Custom 404 page (sets HTTP 404 status)
├── sitemap.ts              # Dynamic sitemap generator
├── robots.ts               # Dynamic robots.txt generator
├── features/
│   └── page.tsx            # Deep-dive product capabilities
├── download/
│   └── page.tsx            # App Store / Play Store download portal
├── faq/
│   └── page.tsx            # Comprehensive FAQ with FAQPage schema
└── card/
    └── [identifier]/
        └── page.tsx        # Dynamic public digital business card profile
```

---

## 42. FAQ SEO & Interactive Disclosures

Frequently Asked Questions (FAQ) address user hesitation while qualifying for Google SERP FAQ rich snippets.

### Implementation Checklist:
1. Structure FAQ questions as `<h3>` tags or accessible `<details><summary>` components.
2. Provide direct, helpful answers without marketing fluff.
3. Annotate with `FAQPage` schema:
   ```typescript
   export function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
     const schema = {
       '@context': 'https://schema.org',
       '@type': 'FAQPage',
       mainEntity: faqs.map((faq) => ({
         '@type': 'Question',
         name: faq.question,
         acceptedAnswer: {
           '@type': 'Answer',
           text: faq.answer,
         },
       })),
     };

     return (
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
       />
     );
   }
   ```

---

## 43. Structured Data Validation Protocol

Before shipping structured data:
1. **Schema.org Conformance**: Confirm all properties belong to the specified `@type`.
2. **Google Rich Results Compatibility**: Ensure required fields are populated (e.g., `name` on `Person`, `acceptedAnswer` on `Question`).
3. **Validation Tools**: Validate JSON-LD markup against:
   - Google Rich Results Test (`https://search.google.com/test/rich-results`)
   - Schema Markup Validator (`https://validator.schema.org`)
4. **Syntax Hygiene**: Verify no `undefined` values serialize into the JSON string. Filter out optional fields cleanly.

---

## 44. Public vs. Private Boundary & Security Invariants

The boundary between public SEO surfaces and private user data is absolute:

### Invariants:
1. **Data Isolation in DTOs**: Public card pages must only consume `PublicCardDto` from `@veya/shared`. Internal fields (`userId`, private notes, analytics tokens, billing status) must never be transmitted or rendered.
2. **Publication State Verification**: If `card.isPublished === false`, the page must return `notFound()` or set robots `noindex, nofollow`.
3. **No Unauthenticated User Scraping**: Never expose bulk listing directories of users without authentication. Sitemaps should only include cards whose owners have explicitly published them.
4. **No Indexing of Authenticated Dashboards**: All routes under `/dashboard`, `/admin`, or `/settings` must be strictly disallowed in `robots.ts` and tagged with `noindex, nofollow`.

---

## 45. SEO Testing & Automated Verification

Incorporate SEO verification into the engineering workflow:

### Automated Checks to Implement:
- **Metadata Tests**: Jest / Vitest tests asserting that `generateMetadata()` returns non-null title, description, canonical, and openGraph properties.
- **Sitemap Route Test**: Verify that `/sitemap.xml` returns valid XML with `Content-Type: application/xml` or `text/xml` and lists expected routes.
- **Robots Route Test**: Verify that `/robots.txt` returns valid text with `User-agent` and `Sitemap` declarations.
- **404 Status Test**: Verify that non-existent card identifiers return a true 404 HTTP status rather than a 200 OK soft 404.
- **Build Verification**: Run `pnpm --filter @veya/frontend build` to ensure all metadata generation executes cleanly without SSR/SSG errors.

---

## 46. The 7-Phase SEO Audit Workflow

When auditing existing pages or building new public surfaces, follow this sequential 7-phase protocol:

```text
Phase 1 — Inspect
  Trace the target route, server components, data sources, and metadata configs.
Phase 2 — Identify
  Detect indexing blockers, soft 404s, missing tags, CLS risks, or duplicate content.
Phase 3 — Prioritize
  Classify findings by severity (Critical, High, Medium, Low).
Phase 4 — Plan
  Create a concise implementation plan documenting planned changes.
Phase 5 — Implement
  Author clean, framework-native SEO enhancements.
Phase 6 — Validate
  Run typecheck, lint, build, metadata verification, and structured data validation.
Phase 7 — Report
  Summarize changes, before/after metrics, and future recommendations.
```

### Prioritization Severity Rubric:
- **CRITICAL**: Search engine indexing blocked (e.g., accidental global `noindex`), soft 404s on dead pages, or private user data exposed in public metadata.
- **HIGH**: Missing canonical URLs, broken or duplicate `<title>` tags, missing Open Graph images, or massive layout shifts (CLS > 0.25).
- **MEDIUM**: Suboptimal meta descriptions, missing JSON-LD structured data, unoptimized image formats, or heading hierarchy jumps.
- **LOW**: Minor keyword refinements, anchor text tweaks, or optional social metadata tags.

---

## 47. SEO Anti-Patterns & Common Mistakes

Never introduce the following anti-patterns:
- **Keyword Stuffing**: Cramming repetitive keywords into titles, descriptions, or alt tags.
- **Hidden Text / Cloaking**: Presenting different content to search engine crawlers than human visitors.
- **Soft 404 Errors**: Rendering an error page with HTTP status 200 OK instead of triggering `notFound()`.
- **Duplicate Metadata**: Copy-pasting identical `<title>` and descriptions across all pages.
- **Unchecked Third-Party Libraries**: Installing heavy SEO npm packages when Next.js handles it natively.
- **Fabricated Schema**: Claiming 5-star ratings or thousands of reviews that do not exist.
- **Overwriting Production URLs**: Changing URL structures without permanent 301/308 redirects.
- **Blocking Assets in robots.txt**: Disallowing CSS or JS necessary for Googlebot to render the page layout.
- **Client-Only SEO**: Fetching critical page copy inside a client-side `useEffect()` so bots see empty HTML.

---

## 48. Veya-Specific SEO Surfaces & Domain Blueprint

### Current Live Surfaces:
1. **Homepage (`/`)**:
   - Primary Intent: Commercial / Brand discovery.
   - Target Terms: Digital business cards, contactless networking, NFC business card.
   - Structured Data: `WebApplication`, `Organization`.
2. **Public Card Profile (`/card/[identifier]`)**:
   - Primary Intent: Navigational / Contact exchange.
   - Target Terms: `[Person Name] [Role] [Company] Digital Business Card`.
   - Structured Data: `ProfilePage`, `Person`.
   - Actions: Direct vCard download, social links, save to phone.

### Recommended Future Surfaces:
1. **Features (`/features`)**: Deep dive into NFC technology, QR dynamics, custom themes, and team management.
2. **App Download (`/download`)**: Dedicated landing page for iOS and Android app installs.
3. **FAQ (`/faq`)**: Resolves questions regarding NFC compatibility, security, vCard imports, and team plans.

---

## 49. AI Agent Behavioral Rules

Whenever an AI agent is tasked with SEO work in Veya, it must strictly observe these behavioral rules:
1. **Inspect before changing**: Always examine the target route, layout, and data fetching first.
2. **Use framework-native primitives**: Prioritize Next.js 15 App Router built-in SEO capabilities.
3. **Never fabricate product claims**: Only state features and metrics that exist in Veya.
4. **Never leak private data**: Never index unlisted cards or expose private user identifiers.
5. **Preserve existing functionality**: Ensure visual design and client interactions remain intact.
6. **Prioritize user intent**: Write copy that humans find compelling, not just search bots.
7. **Validate builds**: Always run `pnpm --filter @veya/frontend build` (or equivalent) to ensure zero SSR/hydration breakage.
8. **Document rationale**: Explain why metadata or architectural adjustments were made.

---

## 50. Definition of Done

An SEO task in Veya is considered complete **only** when all of the following criteria are satisfied:
- [ ] Unique, intent-aligned `<title>` and meta description are configured.
- [ ] Absolute canonical URL is set via `alternates.canonical`.
- [ ] Open Graph and Twitter cards are configured with valid image URLs.
- [ ] Robots directives correctly index public content and protect private/draft content.
- [ ] Semantic HTML is employed (`<header>`, `<main>`, `<footer>`, `<article>`, etc.).
- [ ] Single `<h1>` is present and heading hierarchy (`<h2>`, `<h3>`) is valid.
- [ ] Images utilize `next/image` with dimensions and accessibility alt text.
- [ ] JSON-LD structured data is implemented and validates against Schema.org standards.
- [ ] Error conditions return a true 404 HTTP status code via `notFound()`.
- [ ] `robots.ts` and `sitemap.ts` are present or updated where appropriate.
- [ ] Zero unnecessary external dependencies were installed.
- [ ] TypeScript compilation (`pnpm --filter @veya/frontend typecheck` or `next build`) passes without errors.
