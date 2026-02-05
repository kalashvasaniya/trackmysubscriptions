import type { MetadataRoute } from "next"
import { getAllCategorySlugs, getAllServiceSlugs } from "@/data/pseo/services"
import { getAllTermSlugs } from "@/data/pseo/glossary"
import { getAllPersonaSlugs } from "@/data/pseo/personas"

const BASE_URL = "https://trackmysubscriptions.com"

// ── Single sitemap covering all non-comparison pages ─────────────────
// Comparison pages (~103k) are served via /api/sitemaps/[id] route.
// This file serves /sitemap.xml with ~1,500 core URLs.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // static / marketing
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]

  // hub / index pages
  const hubPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/browse`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/subscription-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ]

  // /browse/[category]
  const categoryPages: MetadataRoute.Sitemap = getAllCategorySlugs().map((slug) => ({
    url: `${BASE_URL}/browse/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const serviceSlugs = getAllServiceSlugs()

  // /services/[slug]
  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // /alternatives/[slug]
  const alternativesPages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/alternatives/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // /pricing/[slug]
  const pricingPages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/pricing/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // /glossary/[term]
  const termPages: MetadataRoute.Sitemap = getAllTermSlugs().map((slug) => ({
    url: `${BASE_URL}/glossary/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // /for/[persona]
  const personaPages: MetadataRoute.Sitemap = getAllPersonaSlugs().map((slug) => ({
    url: `${BASE_URL}/for/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...hubPages,
    ...categoryPages,
    ...servicePages,
    ...alternativesPages,
    ...pricingPages,
    ...termPages,
    ...personaPages,
  ]
}
