export interface Persona {
  name: string
  slug: string
  headline: string
  subheadline: string
  description: string
  painPoints: string[]
  keyFeatures: { title: string; description: string }[]
  stats: { label: string; value: string }[]
  cta: string
  relevantCategories: string[]
}

export const personas: Persona[] = [
  {
    name: "Freelancers",
    slug: "freelancers",
    headline: "Subscription Tracking Built for Freelancers",
    subheadline: "Keep your business tools organized and deductible expenses clear",
    description:
      "As a freelancer, you juggle dozens of software subscriptions — from design tools and hosting to invoicing and project management. Each one is a business expense that needs tracking for tax deductions. TrackMySubscriptions helps freelancers centralize all subscriptions, categorize business vs personal expenses, and never miss a renewal that could disrupt your workflow.",
    painPoints: [
      "Losing track of which subscriptions are tax-deductible business expenses",
      "Forgetting to cancel free trials for tools you evaluated but didn't adopt",
      "Surprise charges when annual subscriptions renew at higher prices",
      "No clear picture of total monthly overhead for pricing your services",
      "Paying for duplicate tools that serve the same purpose",
    ],
    keyFeatures: [
      {
        title: "Category Organization",
        description: "Separate business subscriptions from personal ones with folders and tags for clean expense reporting.",
      },
      {
        title: "Cost Analytics",
        description: "See your total monthly and yearly overhead at a glance to make informed pricing decisions for your services.",
      },
      {
        title: "Renewal Alerts",
        description: "Get notified before annual renewals so you can evaluate if you still need each tool.",
      },
      {
        title: "CSV Export",
        description: "Export subscription data for tax preparation, accounting software, or client billing.",
      },
    ],
    stats: [
      { label: "Avg freelancer subscriptions", value: "15+" },
      { label: "Potential annual savings", value: "$600" },
      { label: "Tax-deductible expenses tracked", value: "100%" },
    ],
    cta: "Start Tracking Your Freelance Subscriptions Free",
    relevantCategories: ["development", "design", "productivity", "cloud", "finance"],
  },
  {
    name: "Families",
    slug: "families",
    headline: "Family Subscription Tracker",
    subheadline: "Get your household's subscription spending under control",
    description:
      "Between streaming services, music, cloud storage, fitness apps, and educational platforms, family subscription costs add up fast. TrackMySubscriptions gives families a clear view of every recurring charge across the household, helping you cut waste, find family plan savings, and budget smarter.",
    painPoints: [
      "Multiple family members signing up for overlapping services",
      "Not knowing the true total of household subscription spending",
      "Missing opportunities for family plan discounts",
      "Kids signing up for trials that auto-renew without parents knowing",
      "Subscription costs spreading across multiple payment methods and bank accounts",
    ],
    keyFeatures: [
      {
        title: "Household Overview",
        description: "See every subscription across the family in one dashboard to spot overlaps and waste.",
      },
      {
        title: "Family Plan Insights",
        description: "Identify where switching to family plans could save money on services like Spotify, YouTube, and iCloud.",
      },
      {
        title: "Smart Alerts",
        description: "Get notified before any family subscription renews so there are no surprise charges.",
      },
      {
        title: "Spending Analytics",
        description: "Visualize total family spending by category to make informed budgeting decisions.",
      },
    ],
    stats: [
      { label: "Avg family subscriptions", value: "20+" },
      { label: "Avg monthly spending", value: "$273" },
      { label: "Potential savings with family plans", value: "30%" },
    ],
    cta: "Track Your Family's Subscriptions Free",
    relevantCategories: ["entertainment", "music", "cloud", "education", "health"],
  },
  {
    name: "Students",
    slug: "students",
    headline: "Subscription Tracker for Students",
    subheadline: "Manage your subscriptions on a student budget",
    description:
      "Students often qualify for significant subscription discounts but may not know about them — or forget to renew student pricing before it expires. TrackMySubscriptions helps students keep track of every subscription, find student discounts, and stay on top of tight budgets.",
    painPoints: [
      "Not knowing which services offer student discounts",
      "Forgetting to renew student verification before prices increase",
      "Free trials from the start of semester that auto-renew",
      "Spending more on subscriptions than realized on a tight budget",
      "Losing access to critical tools during exam periods due to failed payments",
    ],
    keyFeatures: [
      {
        title: "Budget Tracking",
        description: "See exactly how much you spend on subscriptions monthly to stay within your student budget.",
      },
      {
        title: "Renewal Reminders",
        description: "Never miss a renewal date or student discount verification deadline.",
      },
      {
        title: "Category Breakdown",
        description: "Organize subscriptions by education, entertainment, and tools to prioritize spending.",
      },
      {
        title: "Free Forever",
        description: "TrackMySubscriptions is 100% free — no premium tier to worry about on a student budget.",
      },
    ],
    stats: [
      { label: "Avg student subscriptions", value: "8+" },
      { label: "Student discount savings", value: "50%" },
      { label: "Wasted on unused trials/year", value: "$200+" },
    ],
    cta: "Start Tracking Subscriptions Free — No Card Required",
    relevantCategories: ["education", "entertainment", "music", "productivity", "cloud"],
  },
  {
    name: "Small Business Owners",
    slug: "small-businesses",
    headline: "Subscription Management for Small Businesses",
    subheadline: "Track every SaaS tool your business depends on",
    description:
      "Small businesses rely on dozens of SaaS subscriptions for everything from email and CRM to accounting and marketing. Without centralized tracking, costs spiral and unused licenses go unnoticed. TrackMySubscriptions gives small business owners a clear picture of their SaaS stack and its total cost.",
    painPoints: [
      "No centralized view of all business software subscriptions",
      "Paying for unused seats or licenses after employees leave",
      "Difficulty tracking which subscriptions are on which credit cards",
      "SaaS costs growing faster than revenue",
      "Annual renewals catching you off-guard with budget-busting charges",
    ],
    keyFeatures: [
      {
        title: "SaaS Stack Overview",
        description: "See every business subscription in one place with costs, renewal dates, and payment methods.",
      },
      {
        title: "Payment Method Tracking",
        description: "Know exactly which subscriptions are charged to which business cards or accounts.",
      },
      {
        title: "Spending Analytics",
        description: "Track SaaS spending trends over time and identify cost optimization opportunities.",
      },
      {
        title: "CSV Export",
        description: "Export data for bookkeeping, budgeting meetings, or integration with accounting software.",
      },
    ],
    stats: [
      { label: "Avg SMB SaaS subscriptions", value: "25+" },
      { label: "Annual SaaS spend per employee", value: "$4,800" },
      { label: "Unused SaaS licenses", value: "25%" },
    ],
    cta: "Get Your Business Subscriptions Under Control",
    relevantCategories: ["productivity", "finance", "development", "cloud", "design"],
  },
  {
    name: "Remote Workers",
    slug: "remote-workers",
    headline: "Subscription Tracker for Remote Workers",
    subheadline: "Manage the tools that power your remote work life",
    description:
      "Remote work means relying on subscriptions for communication, collaboration, cloud storage, VPNs, and more. The line between personal and work subscriptions blurs. TrackMySubscriptions helps remote workers organize their tool stack, track reimbursable expenses, and optimize spending.",
    painPoints: [
      "Blurred line between personal and work-reimbursable subscriptions",
      "Accumulating duplicate tools for collaboration (Slack, Teams, Zoom, etc.)",
      "Paying out of pocket for work tools while waiting for reimbursement",
      "Not knowing which subscriptions employer covers vs personal expense",
      "Tool fatigue from too many overlapping productivity subscriptions",
    ],
    keyFeatures: [
      {
        title: "Work vs Personal Tags",
        description: "Tag subscriptions as work or personal to easily track reimbursable expenses.",
      },
      {
        title: "Folder Organization",
        description: "Group subscriptions by purpose — communication, storage, productivity, entertainment.",
      },
      {
        title: "Spending Insights",
        description: "See how much you spend on work tools vs personal subscriptions each month.",
      },
      {
        title: "Alert Notifications",
        description: "Get reminders before renewals to evaluate if each tool still serves your remote workflow.",
      },
    ],
    stats: [
      { label: "Avg remote worker subscriptions", value: "18+" },
      { label: "Monthly tool spending", value: "$150+" },
      { label: "Reimbursable expenses missed", value: "35%" },
    ],
    cta: "Organize Your Remote Work Subscriptions Free",
    relevantCategories: ["productivity", "cloud", "development", "entertainment", "health"],
  },
  {
    name: "Developers",
    slug: "developers",
    headline: "Subscription Tracker for Developers",
    subheadline: "Keep your dev tools, hosting, and services organized",
    description:
      "Developers subscribe to a unique mix of services: IDEs, hosting platforms, CI/CD tools, domain registrars, monitoring services, and API subscriptions. Each with different billing cycles and pricing models. TrackMySubscriptions helps developers track their entire tech stack and avoid surprise bills from usage-based services.",
    painPoints: [
      "Multiple hosting and cloud services with different billing dates",
      "Forgetting about domain renewals until the domain expires",
      "Usage-based services with unpredictable monthly costs",
      "Free tier limits exceeded without notice, triggering charges",
      "Accumulating tools and services across personal and side projects",
    ],
    keyFeatures: [
      {
        title: "Dev Tool Categories",
        description: "Organize by development, cloud, design, and productivity to see your full tech stack.",
      },
      {
        title: "Calendar View",
        description: "Visual calendar showing when every subscription renews so you can plan ahead.",
      },
      {
        title: "Multi-Currency Support",
        description: "Track subscriptions in USD, EUR, GBP, or any currency — essential for global services.",
      },
      {
        title: "Open Source",
        description: "TrackMySubscriptions is open source. Inspect the code, self-host, or contribute on GitHub.",
      },
    ],
    stats: [
      { label: "Avg developer subscriptions", value: "20+" },
      { label: "Monthly dev tool spending", value: "$200+" },
      { label: "Forgotten domain renewals/yr", value: "3+" },
    ],
    cta: "Track Your Dev Subscriptions Free",
    relevantCategories: ["development", "cloud", "design", "productivity"],
  },
  {
    name: "Content Creators",
    slug: "content-creators",
    headline: "Subscription Tracker for Content Creators",
    subheadline: "Manage your creative tools and platform subscriptions",
    description:
      "Content creators rely on a growing stack of subscriptions: editing software, stock media, scheduling tools, analytics platforms, hosting, and distribution services. TrackMySubscriptions helps creators see the true cost of their content business and find savings to improve margins.",
    painPoints: [
      "Creative tool subscriptions adding up to hundreds per month",
      "Stock media subscriptions with unused credits that do not roll over",
      "Platform fees and subscription costs eating into creator revenue",
      "Seasonal tools that should be paused or cancelled between projects",
      "No clear picture of the true cost to produce content",
    ],
    keyFeatures: [
      {
        title: "Creative Stack Overview",
        description: "See all your editing, design, stock media, and distribution subscriptions in one place.",
      },
      {
        title: "Cost Per Content Analysis",
        description: "Understand your subscription overhead to better price your services and content.",
      },
      {
        title: "Seasonal Tracking",
        description: "Track and pause seasonal subscriptions to avoid paying for tools between projects.",
      },
      {
        title: "Detailed Analytics",
        description: "Spending breakdowns by category help you optimize your creator tool stack.",
      },
    ],
    stats: [
      { label: "Avg creator subscriptions", value: "22+" },
      { label: "Monthly tool spending", value: "$350+" },
      { label: "Potential savings per year", value: "$1,200+" },
    ],
    cta: "Start Tracking Your Creator Subscriptions Free",
    relevantCategories: ["design", "entertainment", "music", "cloud", "productivity"],
  },
  {
    name: "Budget-Conscious Individuals",
    slug: "budget-conscious",
    headline: "Take Control of Your Subscription Spending",
    subheadline: "See where every dollar goes and cut what you do not need",
    description:
      "If you are watching your spending, subscriptions are one of the easiest places to save. Small recurring charges add up to thousands per year. TrackMySubscriptions gives you complete visibility into your subscription spending so you can make informed decisions about what to keep, downgrade, or cancel.",
    painPoints: [
      "Small $5-15 subscriptions that feel insignificant but add up to hundreds monthly",
      "No single view of total subscription spending across all payment methods",
      "Forgetting about subscriptions until seeing unexpected bank charges",
      "Difficulty comparing whether annual or monthly billing saves more",
      "Feeling overwhelmed by the number of recurring charges",
    ],
    keyFeatures: [
      {
        title: "Total Spending Dashboard",
        description: "See your exact monthly and yearly subscription costs at a glance.",
      },
      {
        title: "Smart Alerts",
        description: "Get notified before each renewal so you can evaluate and cancel before being charged.",
      },
      {
        title: "Savings Opportunities",
        description: "Analytics help identify subscriptions to cancel, downgrade, or switch to annual billing.",
      },
      {
        title: "100% Free",
        description: "No premium tier, no hidden costs. Track unlimited subscriptions completely free.",
      },
    ],
    stats: [
      { label: "Avg unused subscriptions", value: "4-5" },
      { label: "Wasted per year on unused subs", value: "$600+" },
      { label: "Users who save after auditing", value: "85%" },
    ],
    cta: "Find Your Hidden Subscription Costs — Free",
    relevantCategories: ["entertainment", "music", "cloud", "health", "education"],
  },
]

// ── Helper functions ─────────────────────────────────────────────────

export function getPersonaBySlug(slug: string): Persona | undefined {
  return personas.find((p) => p.slug === slug)
}

export function getAllPersonaSlugs(): string[] {
  return personas.map((p) => p.slug)
}
