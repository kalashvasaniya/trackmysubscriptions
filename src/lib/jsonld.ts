import { siteConfig } from "@/app/siteConfig"

// ── Breadcrumb List ──────────────────────────────────────────────────

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
  return JSON.stringify(schema)
}

// ── Item List (for browse / directory pages) ─────────────────────────

export function itemListJsonLd(
  name: string,
  description: string,
  items: { name: string; url: string; description?: string; image?: string }[]
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${siteConfig.url}${item.url}`,
      ...(item.description ? { description: item.description } : {}),
    })),
  }
  return JSON.stringify(schema)
}

// ── Product (for comparison / service pages) ─────────────────────────

export function productJsonLd(service: {
  name: string
  description: string
  url: string
  category: string
  price?: number | null
  currency?: string
}): string {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: service.name,
    description: service.description,
    category: service.category,
    url: service.url,
  }
  if (service.price != null && service.price > 0) {
    schema.offers = {
      "@type": "Offer",
      price: service.price,
      priceCurrency: service.currency || "USD",
      availability: "https://schema.org/InStock",
    }
  }
  return JSON.stringify(schema)
}

// ── Defined Term (for glossary pages) ────────────────────────────────

export function definedTermJsonLd(term: {
  name: string
  description: string
  url: string
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.name,
    description: term.description,
    url: `${siteConfig.url}${term.url}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Subscription & SaaS Glossary",
      url: `${siteConfig.url}/glossary`,
    },
  }
  return JSON.stringify(schema)
}

// ── Defined Term Set (for glossary hub) ──────────────────────────────

export function definedTermSetJsonLd(
  terms: { name: string; url: string }[]
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Subscription & SaaS Glossary",
    description:
      "Comprehensive glossary of subscription, SaaS, and recurring billing terminology.",
    url: `${siteConfig.url}/glossary`,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.name,
      url: `${siteConfig.url}${t.url}`,
    })),
  }
  return JSON.stringify(schema)
}

// ── Web Application (for tools pages) ────────────────────────────────

export function webApplicationJsonLd(tool: {
  name: string
  description: string
  url: string
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${siteConfig.url}${tool.url}`,
    applicationCategory: "FinanceApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
  }
  return JSON.stringify(schema)
}

// ── FAQ Page ─────────────────────────────────────────────────────────

export function faqPageJsonLd(
  questions: { question: string; answer: string }[]
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }
  return JSON.stringify(schema)
}
