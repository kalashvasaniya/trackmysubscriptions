import type { MetadataRoute } from "next"
import { getAllCategorySlugs, getAllServiceSlugs } from "@/data/pseo/services"
import { getAllComparisonSlugs } from "@/data/pseo/comparisons"
import { getAllTermSlugs } from "@/data/pseo/glossary"
import { getAllPersonaSlugs } from "@/data/pseo/personas"

const BASE_URL = "https://trackmysubscriptions.com"
const URLS_PER_SITEMAP = 45000 // Stay under 50k limit

// ── Generate multiple sitemaps for 100k+ URLs ───────────────────────

export async function generateSitemaps() {
  const comparisonSlugs = getAllComparisonSlugs()
  const totalComparisons = comparisonSlugs.length
  const comparisonChunks = Math.ceil(totalComparisons / URLS_PER_SITEMAP)

  // id 0 = static + hub + category + glossary + persona + service + alternatives + pricing pages
  // id 1..N = comparison page chunks
  const ids = [{ id: 0 }]
  for (let i = 0; i < comparisonChunks; i++) {
    ids.push({ id: i + 1 })
  }
  return ids
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Sitemap 0: all non-comparison pages ───────────────────────────
  if (id === 0) {
    const staticPages: MetadataRoute.Sitemap = [
      { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
      { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
      { url: `${BASE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
      { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ]

    const hubPages: MetadataRoute.Sitemap = [
      { url: `${BASE_URL}/browse`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/tools/subscription-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ]

    const categoryPages: MetadataRoute.Sitemap = getAllCategorySlugs().map(
      (slug) => ({
        url: `${BASE_URL}/browse/${slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    )

    const serviceSlugs = getAllServiceSlugs()

    const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
      url: `${BASE_URL}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    const alternativesPages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
      url: `${BASE_URL}/alternatives/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    const pricingPages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
      url: `${BASE_URL}/pricing/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    const termPages: MetadataRoute.Sitemap = getAllTermSlugs().map((slug) => ({
      url: `${BASE_URL}/glossary/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    const personaPages: MetadataRoute.Sitemap = getAllPersonaSlugs().map(
      (slug) => ({
        url: `${BASE_URL}/for/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    )

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

  // ── Sitemaps 1+: comparison pages in chunks ───────────────────────
  const comparisonSlugs = getAllComparisonSlugs()
  const chunkIndex = id - 1
  const start = chunkIndex * URLS_PER_SITEMAP
  const end = Math.min(start + URLS_PER_SITEMAP, comparisonSlugs.length)
  const chunk = comparisonSlugs.slice(start, end)

  return chunk.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))
}
