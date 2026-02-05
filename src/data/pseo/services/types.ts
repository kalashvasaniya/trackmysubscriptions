export interface ServicePricing {
  plan: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  currency: string
}

export interface SubscriptionService {
  name: string
  slug: string
  category: string
  description: string
  shortDescription: string
  website: string
  pricing: ServicePricing[]
  features: string[]
  tags: string[]
  yearFounded: number
  headquarters: string
}

// ── Expanded Categories (13 total) ───────────────────────────────────

export const categories = [
  { slug: "entertainment", name: "Entertainment", description: "Streaming platforms for movies, TV shows, anime, and live sports. Compare pricing, content libraries, and features to find the best value.", icon: "tv" },
  { slug: "music", name: "Music", description: "Music streaming services offering millions of tracks, podcasts, and personalized playlists. Find the right plan for your listening habits.", icon: "music" },
  { slug: "development", name: "Development", description: "Developer tools, hosting platforms, CI/CD services, and code collaboration tools essential for modern software development.", icon: "code" },
  { slug: "design", name: "Design", description: "Design tools for UI/UX, graphic design, prototyping, and creative work. Compare features across leading design platforms.", icon: "palette" },
  { slug: "cloud", name: "Cloud", description: "Cloud storage, computing, and infrastructure services. Compare storage limits, pricing tiers, and enterprise features.", icon: "cloud" },
  { slug: "productivity", name: "Productivity", description: "Productivity suites, project management tools, and collaboration platforms to streamline your workflow.", icon: "zap" },
  { slug: "finance", name: "Finance", description: "Financial tools including accounting software, invoicing platforms, and budgeting apps for individuals and businesses.", icon: "dollar-sign" },
  { slug: "health", name: "Health", description: "Health and fitness subscriptions including workout apps, meditation platforms, and wellness services.", icon: "heart" },
  { slug: "education", name: "Education", description: "Online learning platforms, course subscriptions, and educational tools for skill development and professional growth.", icon: "graduation-cap" },
  { slug: "ai", name: "AI & Machine Learning", description: "AI-powered tools for writing, coding, image generation, data analysis, and automation. Compare the latest AI subscription services.", icon: "robot" },
  { slug: "security", name: "Security & Privacy", description: "VPNs, password managers, antivirus software, and privacy tools to keep your digital life secure.", icon: "shield" },
  { slug: "gaming", name: "Gaming", description: "Gaming subscriptions for consoles, PC, cloud gaming, and game development tools. Compare gaming services and find the best deals.", icon: "gamepad" },
  { slug: "news", name: "News & Media", description: "Digital newspaper subscriptions, magazine apps, newsletter platforms, and media aggregators for staying informed.", icon: "newspaper" },
] as const

export type CategorySlug = (typeof categories)[number]["slug"]

// ── Compact service builder ──────────────────────────────────────────

const categoryAdjectives: Record<string, string> = {
  entertainment: "streaming and entertainment",
  music: "music and audio streaming",
  development: "developer tools and infrastructure",
  design: "design and creative",
  cloud: "cloud storage and infrastructure",
  productivity: "productivity and collaboration",
  finance: "financial and accounting",
  health: "health and wellness",
  education: "online learning and education",
  ai: "AI-powered",
  security: "security and privacy",
  gaming: "gaming",
  news: "news and media",
}

export function svc(
  name: string,
  slug: string,
  category: string,
  sd: string,
  web: string,
  p: [string, number | null, number | null][],
  f: string[],
  t: string[],
  y: number,
  hq: string,
): SubscriptionService {
  const adj = categoryAdjectives[category] || category
  const startPrice = p.find(([, m]) => m && m > 0)?.[1]
  const hasFree = p.some(([, m]) => m === 0)
  const priceText = hasFree
    ? `It offers a free tier as well as paid plans starting from $${startPrice}/month.`
    : startPrice
      ? `Plans start from $${startPrice}/month.`
      : `Contact ${name} for pricing details.`

  return {
    name,
    slug,
    category,
    shortDescription: sd,
    description: `${name} is a ${adj} service that provides ${sd.toLowerCase().replace(/\.$/, "")}. Founded in ${y} and headquartered in ${hq}, ${name} offers ${p.length} pricing plan${p.length > 1 ? "s" : ""}. ${priceText} Key features include ${f.slice(0, 4).join(", ")}. ${name} is a popular choice for users looking for quality ${category} subscriptions.`,
    website: web,
    pricing: p.map(([plan, m, yr]) => ({ plan, monthlyPrice: m, yearlyPrice: yr, currency: "USD" })),
    features: f,
    tags: t,
    yearFounded: y,
    headquarters: hq,
  }
}
