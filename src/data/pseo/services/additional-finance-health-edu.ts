import { svc, type SubscriptionService } from "./types"

// ── Additional Finance Services ──────────────────────────────────────

export const additionalFinanceServices: SubscriptionService[] = [
  svc("Melio", "melio", "finance", "Business payments platform for paying vendors and managing accounts payable",
    "https://meliopayments.com", [["Free", 0, null], ["Pro", 19.99, null]], ["Vendor payments", "ACH transfers", "Check payments", "Sync with accounting", "Approval workflows"], ["payments", "accounts-payable", "vendor", "business"], 2018, "New York, New York"),
  svc("Pilot Bookkeeping", "pilot", "finance", "Bookkeeping, tax, and CFO services for startups and growing businesses",
    "https://pilot.com", [["Starter", 499, null], ["Core", 799, null], ["CFO", 2500, null]], ["Bookkeeping", "Tax filing", "CFO services", "R&D tax credits", "Financial reporting"], ["bookkeeping", "tax", "cfo", "startups"], 2017, "San Francisco, California"),
  svc("Carta", "carta", "finance", "Equity management platform for companies and investors",
    "https://carta.com", [["Starter", 0, null], ["Growth", 999, null], ["Scale", null, null]], ["Cap table management", "409A valuations", "Equity plans", "Fund admin", "Investor portal"], ["equity", "cap-table", "valuations", "investors"], 2012, "San Francisco, California"),
  svc("Deel", "deel", "finance", "Global payroll and compliance platform for hiring international teams",
    "https://deel.com", [["Contractors", 49, null], ["EOR", 599, null], ["Payroll", 29, null]], ["Global payroll", "Contractor payments", "Employer of record", "Compliance", "150+ countries"], ["payroll", "global-hiring", "compliance", "contractors"], 2019, "San Francisco, California"),
  svc("Empower Finance", "empower-finance", "finance", "Personal finance app for budgeting, investing, and retirement planning",
    "https://empower.com", [["Free", 0, null], ["Wealth Management", null, null]], ["Budgeting", "Net worth tracking", "Investment analysis", "Retirement planner", "Spending tracker"], ["budgeting", "investing", "retirement", "net-worth"], 2009, "Redwood City, California"),
  svc("Mercury", "mercury", "finance", "Banking for startups with powerful financial tools and integrations",
    "https://mercury.com", [["Free", 0, null], ["Plus", 35, null]], ["Startup banking", "Treasury", "Corporate cards", "Accounting sync", "API access"], ["banking", "startups", "corporate-cards", "treasury"], 2019, "San Francisco, California"),
  svc("Relay", "relay", "finance", "Business banking with collaborative tools and automatic categorization",
    "https://relayfi.com", [["Free", 0, null], ["Pro", 30, null]], ["Business checking", "Profit first", "Automatic routing", "Team access", "Accounting sync"], ["banking", "business", "profit-first", "categorization"], 2018, "Toronto, Canada"),
  svc("Lili", "lili", "finance", "Banking and accounting designed specifically for freelancers and self-employed",
    "https://lili.co", [["Free", 0, null], ["Pro", 9, null], ["Premium", 39, null]], ["Tax savings", "Invoicing", "Expense tracking", "Business banking", "Schedule C prep"], ["freelance-banking", "tax", "invoicing", "self-employed"], 2019, "New York, New York"),
  svc("Novo", "novo", "finance", "Small business banking with integrated invoicing and cash flow tools",
    "https://novo.co", [["Free", 0, null], ["Plus", 9, null]], ["Business banking", "Invoicing", "Reserves", "Integrations", "No minimum balance"], ["small-business", "banking", "invoicing", "cash-flow"], 2018, "Miami, Florida"),
  svc("Pleo", "pleo", "finance", "Smart company cards with automated expense management for European businesses",
    "https://pleo.io", [["Starter", 0, null], ["Essential", 39, null], ["Advanced", 89, null]], ["Company cards", "Expense automation", "Receipt capture", "Budgets", "Reimbursements"], ["expense-management", "corporate-cards", "automation", "european"], 2015, "Copenhagen, Denmark"),
]

// ── Additional Health Services ───────────────────────────────────────

export const additionalHealthServices: SubscriptionService[] = [
  svc("Eight Sleep", "eight-sleep", "health", "Smart mattress cover with temperature regulation and sleep tracking",
    "https://eightsleep.com", [["Membership", 15, 149]], ["Temperature control", "Sleep tracking", "GentleRise alarm", "Health reports", "Dual zone"], ["sleep", "smart-home", "health-tracking", "temperature"], 2014, "New York, New York"),
  svc("Tonal Fitness", "tonal-fitness", "health", "Digital weight machine with personalized strength training programs",
    "https://tonal.com", [["Membership", 49, null]], ["Strength training", "AI coaching", "Personalized programs", "Form feedback", "Progress tracking"], ["strength", "fitness", "ai-coaching", "home-gym"], 2015, "San Francisco, California"),
  svc("Future Fitness", "future-fitness", "health", "Personal training app with real human coaches for customized workout plans",
    "https://future.co", [["Monthly", 149, null]], ["Personal trainer", "Custom workouts", "Apple Watch integration", "Accountability", "Adapt to schedule"], ["personal-training", "coaching", "workouts", "accountability"], 2017, "San Francisco, California"),
  svc("Huel Nutrition", "huel-nutrition", "health", "Nutritionally complete meal subscription delivering balanced shakes and food",
    "https://huel.com", [["Subscribe & Save", 45, null]], ["Meal shakes", "Hot & savory", "Protein bars", "Nutritionally complete", "Subscribe & save"], ["nutrition", "meal-replacement", "health", "subscription-box"], 2015, "Aylesbury, UK"),
  svc("Athletic Greens", "athletic-greens", "health", "Daily nutritional supplement with 75 vitamins, minerals, and whole-food ingredients",
    "https://athleticgreens.com", [["Subscribe", 79, null]], ["75 ingredients", "Gut health", "Energy support", "Immune support", "Travel packs"], ["supplements", "nutrition", "vitamins", "greens"], 2010, "Carson City, Nevada"),
  svc("Levels Health", "levels-health", "health", "Continuous glucose monitoring for metabolic health optimization",
    "https://levelshealth.com", [["Monthly", 199, null], ["Annual", null, 1788]], ["Glucose monitoring", "Metabolic insights", "Food scoring", "Zone tracking", "Health reports"], ["glucose", "metabolic", "biohacking", "nutrition"], 2019, "New York, New York"),
  svc("InsideTracker", "insidetracker", "health", "Blood biomarker testing and personalized nutrition and fitness recommendations",
    "https://insidetracker.com", [["InnerAge", 249, null], ["Ultimate", 589, null]], ["Blood testing", "Biomarker tracking", "Personalized recs", "DNA analysis", "InnerAge score"], ["biomarkers", "blood-test", "personalized", "aging"], 2009, "Cambridge, Massachusetts"),
  svc("Openfit", "openfit", "health", "Live and on-demand fitness classes with celebrity trainers and nutrition plans",
    "https://openfit.com", [["Monthly", 9.99, null], ["Annual", null, 59.99]], ["Live classes", "Strength training", "Yoga", "Nutrition plans", "Celebrity trainers"], ["fitness", "classes", "nutrition", "strength"], 2018, "Santa Monica, California"),
  svc("Obe Fitness", "obe-fitness", "health", "Live and on-demand fitness classes spanning 20 class types",
    "https://obefitness.com", [["Monthly", 24.99, null], ["Annual", null, 199]], ["Live classes", "On-demand", "20+ class types", "Calendar scheduling", "Community"], ["fitness", "live-classes", "variety", "community"], 2018, "New York, New York"),
  svc("Caliber", "caliber", "health", "Strength training app with expert coaching and progressive programs",
    "https://caliber.app", [["Free", 0, null], ["Coaching", 200, null]], ["Strength training", "Expert coaching", "Progressive overload", "Exercise library", "Tracking"], ["strength", "coaching", "progressive", "tracking"], 2020, "New York, New York"),
]

// ── Additional Education Services ────────────────────────────────────

export const additionalEducationServices: SubscriptionService[] = [
  svc("Educative.io", "educative-io", "education", "Text-based interactive courses for software developers with in-browser coding",
    "https://educative.io", [["Monthly", 39, null], ["Annual", null, 149]], ["Interactive courses", "In-browser coding", "System design", "Coding interviews", "Learning paths"], ["coding", "system-design", "interviews", "text-based"], 2015, "Bellevue, Washington"),
  svc("LeetCode", "leetcode", "education", "Platform for practicing coding interview questions and competitive programming",
    "https://leetcode.com", [["Free", 0, null], ["Premium", 13.25, 159]], ["Coding problems", "Contest", "Discussion forum", "Company questions", "Solution articles"], ["coding", "interviews", "competitive-programming", "algorithms"], 2015, "San Jose, California"),
  svc("Coursera Plus", "coursera-plus", "education", "Unlimited access to guided projects, courses, specializations, and certificates",
    "https://coursera.org", [["Monthly", 59, null], ["Annual", null, 399]], ["7000+ courses", "University certificates", "Professional certificates", "Guided projects", "Specializations"], ["courses", "certificates", "university", "professional"], 2012, "Mountain View, California"),
  svc("Scrimba", "scrimba", "education", "Interactive coding bootcamp with screencasts you can pause and edit",
    "https://scrimba.com", [["Free", 0, null], ["Pro", 18, null], ["Bootcamp", 75, null]], ["Interactive screencasts", "Frontend bootcamp", "Code challenges", "Community", "Career support"], ["coding", "frontend", "interactive", "bootcamp"], 2017, "Oslo, Norway"),
  svc("Exercism", "exercism", "education", "Free open-source coding exercises in 67 programming languages with mentorship",
    "https://exercism.org", [["Free", 0, null], ["Insiders", 9.99, null]], ["67 languages", "Mentorship", "Code exercises", "Open source", "Community"], ["coding", "mentorship", "open-source", "languages"], 2013, "London, UK"),
  svc("Egghead", "egghead", "education", "Concise screencast tutorials for modern web developers",
    "https://egghead.io", [["Free", 0, null], ["Pro", 25, 250]], ["Screencast lessons", "React & TypeScript", "Full-stack", "Workshops", "Curated paths"], ["web-dev", "screencasts", "react", "typescript"], 2013, "Portland, Oregon"),
  svc("Frontend Masters", "frontend-masters", "education", "Expert-led video courses for advanced web development skills",
    "https://frontendmasters.com", [["Monthly", 39, null], ["Annual", null, 390]], ["Expert instructors", "Full-stack courses", "Learning paths", "Live workshops", "Offline access"], ["frontend", "web-dev", "expert", "workshops"], 2012, "Minneapolis, Minnesota"),
  svc("Treehouse", "treehouse", "education", "Online technology school with courses in coding, design, and business",
    "https://teamtreehouse.com", [["Basic", 25, null], ["Pro", 50, null], ["Techdegree", 199, null]], ["Coding courses", "Design courses", "Techdegree", "Practice sessions", "Slack community"], ["coding", "design", "tech-school", "career"], 2011, "Portland, Oregon"),
  svc("Pluralsight Flow", "pluralsight-flow", "education", "Engineering intelligence platform with code analytics and developer metrics",
    "https://pluralsight.com", [["Standard", 29, null], ["Premium", 45, null]], ["Skills assessment", "Learning paths", "Hands-on labs", "Code analytics", "Team reporting"], ["tech-skills", "assessment", "analytics", "labs"], 2004, "Draper, Utah"),
  svc("O'Reilly Learning", "oreilly-learning", "education", "Tech learning platform with books, courses, live events, and practice environments",
    "https://oreilly.com", [["Individual", 49, null], ["Team", 499, null]], ["Tech books", "Live events", "Sandboxes", "Playlists", "Certifications"], ["tech-books", "live-events", "sandboxes", "certifications"], 1978, "Sebastopol, California"),
]
