export { type SubscriptionService, type ServicePricing, type CategorySlug, categories, svc } from "./types"
import { categories } from "./types"
import type { SubscriptionService } from "./types"
import { entertainmentServices, musicServices } from "./entertainment-music"
import { developmentServices, designServices } from "./development-design"
import { cloudServices, productivityServices } from "./cloud-productivity"
import { financeServices, healthServices, educationServices } from "./finance-health-education"
import { aiServices, securityServices, gamingServices, newsServices } from "./ai-security-gaming-news"
import { additionalEntertainmentServices, additionalMusicServices } from "./additional-entertainment"
import { additionalDevelopmentServices, additionalDesignServices } from "./additional-dev-design"
import { additionalCloudServices, additionalProductivityServices } from "./additional-cloud-productivity"
import { additionalFinanceServices, additionalHealthServices, additionalEducationServices } from "./additional-finance-health-edu"
import { additionalAiServices, additionalSecurityServices, additionalGamingServices, additionalNewsServices } from "./additional-ai-security-gaming-news"

// ── Combined services array ──────────────────────────────────────────

export const services: SubscriptionService[] = [
  ...entertainmentServices, ...additionalEntertainmentServices,
  ...musicServices, ...additionalMusicServices,
  ...developmentServices, ...additionalDevelopmentServices,
  ...designServices, ...additionalDesignServices,
  ...cloudServices, ...additionalCloudServices,
  ...productivityServices, ...additionalProductivityServices,
  ...financeServices, ...additionalFinanceServices,
  ...healthServices, ...additionalHealthServices,
  ...educationServices, ...additionalEducationServices,
  ...aiServices, ...additionalAiServices,
  ...securityServices, ...additionalSecurityServices,
  ...gamingServices, ...additionalGamingServices,
  ...newsServices, ...additionalNewsServices,
]

// ── Helper functions ─────────────────────────────────────────────────

export function getServiceBySlug(slug: string): SubscriptionService | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServicesByCategory(category: string): SubscriptionService[] {
  return services.filter((s) => s.category === category)
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getAllCategorySlugs(): string[] {
  return categories.map((c) => c.slug)
}

export function getServiceCount(category: string): number {
  return services.filter((s) => s.category === category).length
}

export function getStartingPrice(service: SubscriptionService): number | null {
  const paidPlans = service.pricing.filter((p) => p.monthlyPrice && p.monthlyPrice > 0)
  if (paidPlans.length === 0) return 0
  return Math.min(...paidPlans.map((p) => p.monthlyPrice!))
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug)
}
