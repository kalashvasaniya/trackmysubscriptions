import { services, getServiceBySlug, type SubscriptionService } from "./services"

export interface ComparisonPair {
  slugA: string
  slugB: string
  slug: string
  category: string
}

// ── Generate ALL valid comparison pairs ──────────────────────────────

function generateAllPairs(): ComparisonPair[] {
  const pairs: ComparisonPair[] = []
  for (let i = 0; i < services.length; i++) {
    for (let j = i + 1; j < services.length; j++) {
      const a = services[i]
      const b = services[j]
      // Alphabetically order slugs for canonical URLs
      const [first, second] = [a, b].sort((x, y) => x.slug.localeCompare(y.slug))
      pairs.push({
        slugA: first.slug,
        slugB: second.slug,
        slug: `${first.slug}-vs-${second.slug}`,
        category: first.category === second.category ? first.category : "cross-category",
      })
    }
  }
  return pairs
}

// Lazy-initialize to avoid computing at import time in every file
let _allPairs: ComparisonPair[] | null = null
function getAllPairs(): ComparisonPair[] {
  if (!_allPairs) _allPairs = generateAllPairs()
  return _allPairs
}

// ── Parse a comparison slug ──────────────────────────────────────────

export function parseComparisonSlug(
  slug: string
): { serviceA: SubscriptionService; serviceB: SubscriptionService } | null {
  const idx = slug.indexOf("-vs-")
  if (idx === -1) return null

  const slugA = slug.substring(0, idx)
  const slugB = slug.substring(idx + 4)

  const serviceA = getServiceBySlug(slugA)
  const serviceB = getServiceBySlug(slugB)

  if (!serviceA || !serviceB || slugA === slugB) return null
  return { serviceA, serviceB }
}

// ── Helper functions ─────────────────────────────────────────────────

export function getAllComparisonSlugs(): string[] {
  return getAllPairs().map((c) => c.slug)
}

export function getTotalComparisonCount(): number {
  return (services.length * (services.length - 1)) / 2
}

export function getComparisonsByCategory(category: string): ComparisonPair[] {
  return getAllPairs()
    .filter((c) => c.category === category)
    .slice(0, 50)
}

export function getComparisonsForService(serviceSlug: string): ComparisonPair[] {
  return getAllPairs()
    .filter((c) => c.slugA === serviceSlug || c.slugB === serviceSlug)
    .slice(0, 20)
}

// Top popular comparisons for hubs and pre-rendering
export function getPopularComparisons(limit: number = 50): ComparisonPair[] {
  // Return same-category pairs first (most useful), then cross-category
  const sameCat = getAllPairs().filter((c) => c.category !== "cross-category")
  const crossCat = getAllPairs().filter((c) => c.category === "cross-category")
  return [...sameCat.slice(0, limit), ...crossCat.slice(0, Math.max(0, limit - sameCat.length))].slice(0, limit)
}

// For generateStaticParams - return a manageable subset for pre-rendering
export function getStaticComparisonSlugs(limit: number = 500): string[] {
  // Prioritize same-category comparisons
  const sameCat = getAllPairs()
    .filter((c) => c.category !== "cross-category")
    .slice(0, limit)
  return sameCat.map((c) => c.slug)
}
