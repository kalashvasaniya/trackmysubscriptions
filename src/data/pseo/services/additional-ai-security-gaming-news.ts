import { svc, type SubscriptionService } from "./types"

// ── Additional AI Services ───────────────────────────────────────────

export const additionalAiServices: SubscriptionService[] = [
  svc("Character AI", "character-ai", "ai", "Platform for creating and chatting with AI characters for entertainment and learning",
    "https://character.ai", [["Free", 0, null], ["Plus", 9.99, null]], ["AI characters", "Voice chat", "Character creation", "Group chats", "Persona modes"], ["chatbot", "entertainment", "characters", "creative"], 2021, "Palo Alto, California"),
  svc("Gamma App", "gamma-app", "ai", "AI-powered tool for creating beautiful presentations, documents, and webpages",
    "https://gamma.app", [["Free", 0, null], ["Plus", 10, null], ["Pro", 20, null]], ["AI presentations", "Documents", "Webpages", "Templates", "Analytics"], ["presentations", "documents", "webpages", "ai-design"], 2022, "San Francisco, California"),
  svc("Fireflies AI", "fireflies-ai", "ai", "AI meeting assistant that records, transcribes, and summarizes meetings",
    "https://fireflies.ai", [["Free", 0, null], ["Pro", 10, null], ["Business", 19, null]], ["Meeting transcription", "AI summaries", "Action items", "CRM integration", "Sentiment analysis"], ["meetings", "transcription", "summaries", "crm"], 2016, "San Francisco, California"),
  svc("Notion AI", "notion-ai-standalone", "ai", "AI writing and knowledge assistant built into the Notion workspace",
    "https://notion.so", [["Add-on", 10, null]], ["AI writing", "Q&A on docs", "Summarization", "Translation", "Autofill tables"], ["writing", "knowledge", "workspace", "productivity"], 2016, "San Francisco, California"),
  svc("Warp Terminal", "warp-terminal", "ai", "AI-powered terminal for developers with modern editing and collaboration features",
    "https://warp.dev", [["Free", 0, null], ["Team", 15, null], ["Enterprise", null, null]], ["AI command search", "Blocks interface", "Workflows", "Collaboration", "Modern editing"], ["terminal", "developer-tools", "ai", "collaboration"], 2020, "San Francisco, California"),
  svc("Superhuman AI", "superhuman-ai", "ai", "AI-powered email client with instant replies and smart prioritization",
    "https://superhuman.com", [["Monthly", 30, null]], ["AI compose", "Smart triage", "Instant replies", "Split inbox", "Read statuses"], ["email", "ai", "productivity", "prioritization"], 2015, "San Francisco, California"),
  svc("Krisp", "krisp", "ai", "AI-powered noise cancellation and meeting assistant for clear audio in calls",
    "https://krisp.ai", [["Free", 0, null], ["Pro", 8, null], ["Business", 10, null]], ["Noise cancellation", "Meeting notes", "Recording", "Call summary", "Action items"], ["noise-cancellation", "meetings", "audio", "transcription"], 2017, "Yerevan, Armenia"),
  svc("Phind", "phind", "ai", "AI search engine for developers with code-aware responses and IDE integration",
    "https://phind.com", [["Free", 0, null], ["Pro", 15, null]], ["Code search", "IDE integration", "Pair programming", "Web search", "Context awareness"], ["developer", "search", "coding", "ide"], 2022, "San Francisco, California"),
  svc("V0 by Vercel", "v0-vercel", "ai", "AI-powered UI generation tool that creates React components from text descriptions",
    "https://v0.dev", [["Free", 0, null], ["Premium", 20, null]], ["UI generation", "React components", "Shadcn/ui", "Code export", "Iteration"], ["ui-generation", "react", "frontend", "code-gen"], 2023, "San Francisco, California"),
  svc("Lovable", "lovable", "ai", "AI full-stack app builder that generates complete web applications from descriptions",
    "https://lovable.dev", [["Free", 0, null], ["Starter", 20, null], ["Pro", 50, null]], ["Full-stack generation", "React apps", "Database setup", "Authentication", "Deployment"], ["app-builder", "full-stack", "no-code", "generation"], 2024, "Stockholm, Sweden"),
]

// ── Additional Security Services ─────────────────────────────────────

export const additionalSecurityServices: SubscriptionService[] = [
  svc("Proton Pass", "proton-pass", "security", "Encrypted password manager from the makers of ProtonMail",
    "https://proton.me/pass", [["Free", 0, null], ["Plus", 3.99, null], ["Unlimited", 7.99, null]], ["Password vault", "2FA codes", "Encrypted notes", "Email aliases", "Cross-platform"], ["password-manager", "encryption", "2fa", "privacy"], 2022, "Geneva, Switzerland"),
  svc("IVPN", "ivpn", "security", "Privacy VPN service with transparent no-log policy and open-source apps",
    "https://ivpn.net", [["Standard", 6, null], ["Pro", 10, null]], ["No-log policy", "Open source", "WireGuard", "Multi-hop", "AntiTracker"], ["vpn", "privacy", "open-source", "no-logs"], 2009, "Gibraltar"),
  svc("GlassWire", "glasswire", "security", "Network monitoring and security tool to visualize network activity and threats",
    "https://glasswire.com", [["Free", 0, null], ["Pro", 2.99, null], ["Elite", 4.99, null]], ["Network monitor", "Firewall", "Bandwidth usage", "App tracking", "Security alerts"], ["network", "firewall", "monitoring", "bandwidth"], 2014, "Austin, Texas"),
  svc("Prey Project", "prey-project", "security", "Device tracking and management platform for lost and stolen device recovery",
    "https://preyproject.com", [["Free", 0, null], ["Personal", 5, null], ["Enterprise", null, null]], ["Device tracking", "Remote wipe", "Geofencing", "Webcam capture", "Multi-platform"], ["device-tracking", "anti-theft", "recovery", "management"], 2009, "Santiago, Chile"),
  svc("AdGuard", "adguard", "security", "Ad blocking and privacy protection across all devices and browsers",
    "https://adguard.com", [["Personal", 2.49, 29.88], ["Family", 5.49, 65.88]], ["Ad blocking", "Tracker blocking", "DNS filtering", "Parental controls", "Cross-platform"], ["ad-blocking", "privacy", "dns", "parental-controls"], 2009, "Limassol, Cyprus"),
  svc("Surfshark One", "surfshark-one", "security", "All-in-one cybersecurity bundle with VPN, antivirus, and data breach alerts",
    "https://surfshark.com", [["One Monthly", 15.45, null], ["One 2-Year", 3.49, null]], ["VPN", "Antivirus", "Data breach alerts", "Webcam protection", "Ad blocker"], ["vpn", "antivirus", "bundle", "data-breach"], 2018, "Vilnius, Lithuania"),
  svc("CyberGhost", "cyberghost", "security", "User-friendly VPN with optimized servers for streaming and torrenting",
    "https://cyberghostvpn.com", [["Monthly", 12.99, null], ["2-Year", 2.19, null]], ["9100+ servers", "Streaming optimized", "NoSpy servers", "Split tunneling", "45-day guarantee"], ["vpn", "streaming", "torrenting", "servers"], 2011, "Bucharest, Romania"),
  svc("Windscribe", "windscribe", "security", "VPN and ad blocker with generous free tier and flexible pricing",
    "https://windscribe.com", [["Free", 0, null], ["Pro", 5.75, 69]], ["VPN", "Ad blocker", "Firewall", "Split tunneling", "Port forwarding"], ["vpn", "ad-blocking", "free-tier", "privacy"], 2016, "Toronto, Canada"),
  svc("Standard Notes", "standard-notes", "security", "End-to-end encrypted note-taking app with long-term sustainability focus",
    "https://standardnotes.com", [["Free", 0, null], ["Productivity", 7.49, 90], ["Professional", 12.49, 150]], ["E2E encryption", "Markdown", "Extensions", "Cross-platform", "100-year commitment"], ["encrypted-notes", "privacy", "markdown", "long-term"], 2016, "Chicago, Illinois"),
  svc("Ente Photos", "ente-photos", "security", "End-to-end encrypted photo storage and sharing as a Google Photos alternative",
    "https://ente.io", [["Free", 0, null], ["Individual", 2.99, null], ["Family", 7.49, null]], ["E2E encrypted photos", "Photo sharing", "Albums", "Memories", "Cross-platform"], ["photo-storage", "encrypted", "privacy", "google-photos-alt"], 2020, "Bangalore, India"),
]

// ── Additional Gaming Services ───────────────────────────────────────

export const additionalGamingServices: SubscriptionService[] = [
  svc("Boosteroid", "boosteroid", "gaming", "Cloud gaming service with instant play on any device without downloads",
    "https://boosteroid.com", [["Monthly", 7.49, null], ["Annual", null, 74.99]], ["Cloud gaming", "1080p streaming", "No downloads", "Multi-device", "Game library"], ["cloud-gaming", "streaming", "no-download", "cross-platform"], 2017, "Kyiv, Ukraine"),
  svc("Shadow PC", "shadow-pc", "gaming", "Full Windows PC in the cloud for gaming and creative work",
    "https://shadow.tech", [["Monthly", 29.99, null]], ["Cloud PC", "Full Windows", "4K support", "Personal storage", "Gaming capable"], ["cloud-pc", "gaming", "windows", "cloud-computing"], 2015, "Paris, France"),
  svc("Utomik", "utomik", "gaming", "PC gaming subscription with instant play from an expanding game library",
    "https://utomik.com", [["Personal", 6.99, null], ["Family", 9.99, null]], ["Instant play", "Growing library", "Family sharing", "Indie games", "Classic games"], ["pc-gaming", "subscription", "indie", "game-library"], 2014, "Eindhoven, Netherlands"),
  svc("Antstream Arcade", "antstream-arcade", "gaming", "Retro game streaming with thousands of classic arcade and console titles",
    "https://antstream.com", [["Monthly", 3.99, null], ["Annual", null, 29.99]], ["Retro games", "Cloud streaming", "Challenges", "Tournaments", "1000+ classics"], ["retro", "arcade", "classic-games", "cloud-gaming"], 2019, "London, UK"),
  svc("Parsec Gaming", "parsec-gaming", "gaming", "Low-latency remote desktop and game streaming for co-op and remote play",
    "https://parsec.app", [["Free", 0, null], ["Warp", 8, null], ["Teams", 30, null]], ["Remote play", "Low latency", "Co-op gaming", "4K streaming", "Multi-monitor"], ["remote-play", "streaming", "co-op", "low-latency"], 2016, "New York, New York"),
  svc("Roll20 VTT", "roll20-vtt", "gaming", "Virtual tabletop platform for playing tabletop RPGs online",
    "https://roll20.net", [["Free", 0, null], ["Plus", 5.99, null], ["Pro", 9.99, null]], ["Virtual tabletop", "Character sheets", "Maps", "Video chat", "Marketplace"], ["tabletop", "rpg", "virtual", "d-and-d"], 2012, "Wichita, Kansas"),
  svc("Foundry VTT", "foundry-vtt", "gaming", "Self-hosted virtual tabletop with unlimited customization for tabletop gaming",
    "https://foundryvtt.com", [["One-time", 50, null]], ["Self-hosted VTT", "Module ecosystem", "Audio/video chat", "Dynamic lighting", "Unlimited players"], ["tabletop", "self-hosted", "rpg", "customizable"], 2020, "Remote"),
  svc("D&D Beyond", "dnd-beyond", "gaming", "Official digital toolset for Dungeons & Dragons with character builder and rules",
    "https://dndbeyond.com", [["Free", 0, null], ["Hero", 2.99, null], ["Master", 5.99, null]], ["Character builder", "Digital rulebooks", "Campaign tools", "Combat tracker", "Homebrew"], ["dnd", "rpg", "character-builder", "digital-tools"], 2017, "Renton, Washington"),
  svc("Tabletop Simulator", "tabletop-simulator", "gaming", "Physics-based sandbox for playing tabletop games digitally",
    "https://tabletopsimulator.com", [["One-time", 19.99, null]], ["Physics sandbox", "Workshop mods", "Online multiplayer", "VR support", "Custom games"], ["tabletop", "simulator", "physics", "multiplayer"], 2015, "Austin, Texas"),
  svc("Paidia", "paidia", "gaming", "Curated indie game subscription delivering handpicked indie titles monthly",
    "https://paidia.com", [["Monthly", 9.99, null]], ["Indie games", "Curated picks", "DRM-free", "Developer spotlight", "Monthly delivery"], ["indie", "curated", "drm-free", "monthly"], 2022, "Berlin, Germany"),
]

// ── Additional News & Media Services ─────────────────────────────────

export const additionalNewsServices: SubscriptionService[] = [
  svc("Stratechery", "stratechery", "news", "Premium tech and business analysis by Ben Thompson",
    "https://stratechery.com", [["Monthly", 15, 150]], ["Tech analysis", "Daily updates", "Podcast", "Strategy insights", "Business analysis"], ["tech-analysis", "strategy", "business", "newsletter"], 2013, "Taipei, Taiwan"),
  svc("The Dispatch", "the-dispatch", "news", "Fact-based conservative news and commentary with in-depth analysis",
    "https://thedispatch.com", [["Monthly", 10, 100]], ["News analysis", "Fact-checking", "Podcasts", "Commentary", "Newsletters"], ["news", "politics", "conservative", "analysis"], 2019, "Washington, DC"),
  svc("Puck News", "puck-news", "news", "Premium insider intel on Hollywood, Wall Street, Silicon Valley, and Washington",
    "https://puck.news", [["Monthly", 14, null], ["Annual", null, 100]], ["Insider reporting", "Hollywood", "Wall Street", "Silicon Valley", "Newsletters"], ["insider-news", "business", "entertainment", "politics"], 2021, "New York, New York"),
  svc("Semafor", "semafor", "news", "Global news platform with transparent, unbundled journalism",
    "https://semafor.com", [["Free", 0, null], ["Flagship", 10, null]], ["Global news", "Transparent journalism", "Newsletters", "Events", "Signals"], ["global-news", "journalism", "newsletters", "events"], 2022, "New York, New York"),
  svc("Ground News", "ground-news", "news", "News comparison platform showing media bias and coverage blindspots",
    "https://ground.news", [["Free", 0, null], ["Pro", 9.99, null], ["Premium", 14.99, null]], ["Bias comparison", "Blindspot detection", "Fact checks", "News from all sides", "Media literacy"], ["media-bias", "news-comparison", "fact-check", "media-literacy"], 2018, "Kitchener, Canada"),
  svc("Tortoise Media", "tortoise-media", "news", "Slow news platform focused on in-depth investigative journalism",
    "https://tortoisemedia.com", [["Monthly", 8, null], ["Annual", null, 60]], ["Slow journalism", "Think-ins", "Investigations", "Podcasts", "Community"], ["slow-news", "investigative", "community", "journalism"], 2019, "London, UK"),
  svc("The Daily Wire", "daily-wire", "news", "Conservative media platform with news, opinion, podcasts, and original entertainment",
    "https://dailywire.com", [["Reader", 4, null], ["Insider", 12, null], ["All Access", 17, null]], ["Conservative news", "Podcasts", "Opinion", "Entertainment", "Early access"], ["conservative", "podcasts", "opinion", "entertainment"], 2015, "Nashville, Tennessee"),
  svc("Axios Pro", "axios-pro", "news", "Premium business journalism with industry-specific intelligence newsletters",
    "https://axios.com/pro", [["Monthly", 599, null], ["Annual", null, 5999]], ["Industry intelligence", "Deal tracking", "Policy analysis", "Newsletters", "Expert analysis"], ["business-intel", "policy", "deals", "professional"], 2017, "Arlington, Virginia"),
]
