export interface Skill {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  shortDescription: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  installCount: number;
  version: string;
  category: string;
  tags: string[];
  features: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isFree?: boolean;
}

export interface Review {
  id: string;
  skillId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const skills: Skill[] = [
  // ===== REAL SKILLS (from /skills/ directory) =====
  {
    id: "smart-web-researcher",
    name: "Smart Web Researcher",
    slug: "smart-web-researcher",
    icon: "🔍",
    description:
      "Your agent becomes a world-class researcher. It searches across multiple engines, cross-references facts from different sources, scores source credibility, and delivers verified, structured research reports with confidence ratings — no more hallucinations.\n\nWhat your agent gains:\n• Multi-source search across the web, Wikipedia, and academic databases\n• Cross-referencing facts from multiple independent sources\n• Confidence scoring so you know how reliable each finding is\n• Structured research reports with citations and links\n• Works for any topic — news, science, business, anything\n\nPerfect for: Professionals who need reliable information, journalists, students, and anyone tired of AI making things up.",
    shortDescription: "Multi-source web research with cross-referencing and confidence scoring",
    author: "Peru 🇵🇪",
    price: 4.99,
    rating: 4.8,
    reviewCount: 156,
    installCount: 1892,
    version: "1.0.0",
    category: "Investigación",
    tags: ["research", "web", "wikipedia", "analysis"],
    features: [
      "Multi-source search across web, Wikipedia & databases",
      "Automatic cross-referencing of facts",
      "Confidence scoring for every finding",
      "Structured research reports with citations",
    ],
    isFeatured: true,
  },
  {
    id: "memory-optimizer",
    name: "Agent Memory Optimizer",
    slug: "memory-optimizer",
    icon: "🧠",
    description:
      "Stop your agent's memory from becoming a cluttered mess. This skill analyzes stored memories, detects duplicates, identifies stale data, scores relevance, and auto-fixes issues — keeping your agent sharp and efficient.\n\nWhat your agent gains:\n• Duplicate detection across all stored memories\n• Staleness analysis — flags outdated information\n• Memory scoring to prioritize what matters\n• Auto-fix mode to clean up without manual work\n• Periodic optimization schedules\n\nPerfect for: Power users whose agents have accumulated months of messy memory data. Anyone who wants a faster, more focused agent.",
    shortDescription: "Detect duplicates, score relevance & auto-clean your agent's memory",
    author: "Peru 🇵🇪",
    price: 3.99,
    rating: 4.7,
    reviewCount: 89,
    installCount: 743,
    version: "1.0.0",
    category: "Core del Agente",
    tags: ["memory", "optimization", "cleanup"],
    features: [
      "Duplicate detection across all memories",
      "Staleness analysis for outdated data",
      "Memory relevance scoring",
      "Auto-fix mode for hands-free cleanup",
    ],
    isFeatured: true,
  },
  {
    id: "translator-pro",
    name: "Multi-Language Translator Pro",
    slug: "translator-pro",
    icon: "🌐",
    description:
      "Your agent becomes fluent in 10+ languages. It auto-detects source language, translates with nuance, manages custom glossaries, and handles batch translation — perfect for multilingual workflows.\n\nWhat your agent gains:\n• Support for 10+ languages with natural phrasing\n• Automatic language detection\n• Custom glossary management for specialized terms\n• Batch translation for processing multiple texts\n• Context-aware translations that preserve meaning\n\nPerfect for: International teams, content creators reaching global audiences, anyone who works across language barriers daily.",
    shortDescription: "Translate 10+ languages with auto-detect and custom glossaries",
    author: "Peru 🇵🇪",
    price: 2.99,
    rating: 4.6,
    reviewCount: 203,
    installCount: 1567,
    version: "1.0.0",
    category: "Productividad",
    tags: ["translation", "languages", "multilingual"],
    features: [
      "10+ languages with natural phrasing",
      "Automatic language detection",
      "Custom glossary management",
      "Batch translation for multiple texts",
    ],
    isFeatured: true,
  },
  {
    id: "moltbook-analytics",
    name: "Moltbook Analytics",
    slug: "moltbook-analytics",
    icon: "📊",
    description:
      "Turn your agent into a Moltbook data analyst. Track engagement metrics, discover the best posting times, get breakdowns by submolt, and understand what content resonates with your audience.\n\nWhat your agent gains:\n• Real-time engagement metrics (upvotes, comments, shares)\n• Best posting time analysis based on historical data\n• Submolt performance breakdown\n• Content performance trends and insights\n• Audience growth tracking\n\nPerfect for: Moltbook power users, community managers, content creators who want to grow their presence on the platform.",
    shortDescription: "Track engagement, discover best posting times & analyze submolt performance",
    author: "Peru 🇵🇪",
    price: 3.99,
    rating: 4.9,
    reviewCount: 67,
    installCount: 412,
    version: "1.0.0",
    category: "Moltbook Tools",
    tags: ["moltbook", "analytics", "social"],
    features: [
      "Real-time engagement metrics",
      "Best posting time analysis",
      "Submolt performance breakdown",
      "Content trend insights",
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "moltbook-auto-poster",
    name: "Moltbook Auto-Poster",
    slug: "moltbook-auto-poster",
    icon: "🦞",
    description:
      "Automate your Moltbook posting workflow. Queue up posts, schedule them for optimal times, handle captcha challenges automatically, and manage cooldowns so you never get rate-limited.\n\nWhat your agent gains:\n• Post queue with drag-and-drop ordering\n• Automatic captcha solver integration\n• Smart scheduling based on audience activity\n• Cooldown management to avoid rate limits\n• Multi-submolt posting in one go\n\nPerfect for: Active Moltbook posters, community leaders, anyone who wants consistent posting without babysitting the submit button.",
    shortDescription: "Queue posts, auto-solve captchas & schedule for optimal engagement",
    author: "Peru 🇵🇪",
    price: 4.99,
    rating: 4.8,
    reviewCount: 45,
    installCount: 289,
    version: "1.0.0",
    category: "Moltbook Tools",
    tags: ["moltbook", "posting", "automation"],
    features: [
      "Post queue with scheduling",
      "Automatic captcha solver",
      "Optimal timing based on analytics",
      "Cooldown & rate-limit management",
    ],
    isNew: true,
  },
  {
    id: "moltbook-community-manager",
    name: "Moltbook Community Manager",
    slug: "moltbook-community-manager",
    icon: "💬",
    description:
      "Let your agent manage Moltbook comment sections for you. It monitors new comments in real time, detects spam, suggests thoughtful replies, and keeps your community healthy.\n\nWhat your agent gains:\n• Real-time comment monitoring across your posts\n• Spam detection with auto-flagging\n• AI-generated reply suggestions that sound human\n• Sentiment analysis on community feedback\n• Moderation dashboard with action history\n\nPerfect for: Submolt moderators, active posters with lots of engagement, anyone who wants to stay on top of community interactions.",
    shortDescription: "Monitor comments, detect spam & get AI reply suggestions",
    author: "Peru 🇵🇪",
    price: 2.99,
    rating: 4.7,
    reviewCount: 38,
    installCount: 198,
    version: "1.0.0",
    category: "Moltbook Tools",
    tags: ["moltbook", "community", "comments"],
    features: [
      "Real-time comment monitoring",
      "Spam detection & auto-flagging",
      "AI reply suggestions",
      "Sentiment analysis on feedback",
    ],
    isNew: true,
  },
  {
    id: "moltbook-trend-scanner",
    name: "Moltbook Trend Scanner",
    slug: "moltbook-trend-scanner",
    icon: "🔥",
    description:
      "Stay ahead of the curve on Moltbook. Your agent scans trending topics, surfaces popular posts, analyzes rising keywords, and alerts you to content that's about to blow up.\n\nWhat your agent gains:\n• Trending topics across all submolts\n• Popular posts ranking by velocity\n• Keyword analysis and rising search terms\n• Rising content alerts before they peak\n• Cross-submolt trend comparisons\n\nPerfect for: Content creators who want to ride trends, community managers, Moltbook enthusiasts who want to always know what's hot.",
    shortDescription: "Discover trending topics, popular posts & rising keywords on Moltbook",
    author: "Peru 🇵🇪",
    price: 1.99,
    rating: 4.5,
    reviewCount: 92,
    installCount: 534,
    version: "1.0.0",
    category: "Moltbook Tools",
    tags: ["moltbook", "trends", "analysis"],
    features: [
      "Trending topics across submolts",
      "Popular posts ranked by velocity",
      "Rising keyword analysis",
      "Early trend alerts",
    ],
    isNew: true,
  },

  // ===== THIRD-PARTY & DEMO SKILLS =====
  {
    id: "weather-intelligence",
    name: "Weather Intelligence",
    slug: "weather-intelligence",
    icon: "🌤️",
    description:
      "Never be caught in the rain again. This skill gives your agent live weather awareness for any location in the world, delivered in natural, easy-to-understand language.\n\nWhat your agent gains:\n• Real-time weather conditions worldwide\n• 7-day detailed forecasts\n• Severe weather alerts and warnings\n• Air quality and UV index tracking\n• Natural language weather reports\n\nPerfect for: Travelers, event planners, outdoor enthusiasts, or anyone who likes to know if they need an umbrella.",
    shortDescription: "Real-time weather, forecasts & severe weather alerts worldwide",
    author: "MeteoSkill",
    price: 2.99,
    rating: 4.5,
    reviewCount: 112,
    installCount: 2341,
    version: "4.0.2",
    category: "Utilidades",
    tags: ["weather", "forecast", "alerts", "climate"],
    features: [
      "Real-time conditions worldwide",
      "7-day detailed forecasts",
      "Severe weather alerts",
      "Air quality & UV tracking",
    ],
  },
  {
    id: "code-review",
    name: "Code Review Assistant",
    slug: "code-review",
    icon: "💻",
    description:
      "Let your agent be your second pair of eyes on every piece of code. It catches security vulnerabilities, spots performance problems, and suggests improvements — all explained clearly.\n\nWhat your agent gains:\n• Detects security vulnerabilities automatically\n• Finds performance bottlenecks\n• Checks code against best practices\n• Supports 20+ programming languages\n• Analyzes Git diffs and pull requests\n\nPerfect for: Solo developers, small teams without dedicated reviewers, anyone who wants fewer bugs and more secure code.",
    shortDescription: "Automated security scanning, performance analysis & best-practice checks",
    author: "DevTools Inc",
    price: 9.99,
    originalPrice: 14.99,
    rating: 4.3,
    reviewCount: 78,
    installCount: 678,
    version: "1.5.0",
    category: "Código",
    tags: ["code", "review", "security", "development"],
    features: [
      "Security vulnerability detection",
      "Performance bottleneck analysis",
      "Best-practice code checks",
      "20+ programming languages supported",
    ],
  },
  {
    id: "email-composer",
    name: "Email Composer Pro",
    slug: "email-composer",
    icon: "📧",
    description:
      "Stop staring at blank email drafts. Just tell your agent what you want to communicate, and it writes a polished, professional email in seconds — adjusted to the perfect tone.\n\nWhat your agent gains:\n• Drafts professional emails from simple instructions\n• Adjusts tone: formal, casual, friendly, or urgent\n• 50+ templates for common situations\n• Writes in multiple languages\n• Smart reply suggestions for incoming mail\n\nPerfect for: Busy professionals, non-native speakers, anyone who spends too much time on emails.",
    shortDescription: "Draft polished emails instantly with tone control & 50+ templates",
    author: "WriteWell",
    price: 3.99,
    rating: 4.4,
    reviewCount: 156,
    installCount: 1567,
    version: "2.0.0",
    category: "Productividad",
    tags: ["email", "writing", "productivity", "communication"],
    features: [
      "Professional drafts from instructions",
      "Tone adjustment (formal/casual/urgent)",
      "50+ email templates",
      "Multi-language support",
    ],
  },
  {
    id: "voice-synthesis",
    name: "Voice Synthesis",
    slug: "voice-synthesis",
    icon: "🎤",
    description:
      "Give your agent a natural voice powered by Edge TTS. Your agent can speak in multiple languages with realistic neural voices — perfect for accessibility, podcasts, language learning, or just making your agent feel more alive.\n\nWhat your agent gains:\n• Natural neural voices via Edge TTS (free!)\n• Peruvian Spanish (Camila), Mexican, European, and more\n• Adjustable speed, pitch, and volume\n• Multiple audio formats (MP3, WAV, OGG)\n• Works with any text — messages, stories, news\n\nPerfect for: Accessibility needs, content creators, language learners, or people who prefer listening over reading.",
    shortDescription: "Free neural text-to-speech via Edge TTS — natural Peruvian & global voices",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.6,
    reviewCount: 234,
    installCount: 3120,
    version: "2.1.0",
    category: "Voz y Audio",
    tags: ["tts", "voice", "audio", "speech"],
    features: [
      "Neural voices via Edge TTS (free)",
      "Peruvian, Mexican & European Spanish",
      "Adjustable speed, pitch & volume",
      "MP3, WAV, OGG output formats",
    ],
    isFree: true,
    isFeatured: true,
  },
  {
    id: "legal-research",
    name: "Legal Research Peru",
    slug: "legal-research",
    icon: "⚖️",
    description:
      "Turn your agent into a Peruvian law expert. It researches the Constitution of 1993, civil and criminal codes, drafts legal documents, and provides precise citations with article references — like having a paralegal on call 24/7.\n\nWhat your agent gains:\n• Instant analysis of Peru's 1993 Constitution\n• Civil and criminal code research\n• Legal document drafting with proper formatting\n• Accurate citations with article references\n• Works in both Spanish and English\n\nPerfect for: Legal professionals, law students, businesses operating in Peru, and anyone who needs quick, reliable legal information.",
    shortDescription: "Research Peruvian law, constitution & codes with precise article citations",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.9,
    reviewCount: 45,
    installCount: 456,
    version: "1.0.0",
    category: "Legal y Compliance",
    tags: ["legal", "peru", "law", "constitution"],
    features: [
      "Peru's 1993 Constitution analysis",
      "Civil & criminal code research",
      "Legal document drafting",
      "Precise article citations",
    ],
    isFree: true,
    isFeatured: true,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    skillId: "smart-web-researcher",
    author: "DataAnalyst42",
    rating: 5,
    comment: "Night and day difference. My agent used to make things up — now it checks multiple sources and shows its work.",
    date: "2026-02-11",
  },
  {
    id: "r2",
    skillId: "smart-web-researcher",
    author: "JournalistX",
    rating: 5,
    comment: "The confidence scoring alone is worth the price. Essential for anyone who needs verified facts.",
    date: "2026-02-03",
  },
  {
    id: "r3",
    skillId: "memory-optimizer",
    author: "AgentBuilder",
    rating: 5,
    comment: "Ran it on my agent and it found 200+ duplicate memories. Way faster after cleanup.",
    date: "2026-02-08",
  },
  {
    id: "r4",
    skillId: "translator-pro",
    author: "GlobalTeamLead",
    rating: 5,
    comment: "We use this daily across our international team. The glossary feature is a game changer.",
    date: "2026-02-10",
  },
  {
    id: "r5",
    skillId: "moltbook-analytics",
    author: "MoltbookPro",
    rating: 5,
    comment: "Finally I know when to post for maximum engagement. My upvotes tripled in a week.",
    date: "2026-02-12",
  },
  {
    id: "r6",
    skillId: "moltbook-auto-poster",
    author: "ContentCreator_PE",
    rating: 5,
    comment: "The captcha solver is magic. I queue up 10 posts and walk away. Everything gets posted perfectly.",
    date: "2026-02-13",
  },
  {
    id: "r7",
    skillId: "moltbook-trend-scanner",
    author: "TrendHunter",
    rating: 4,
    comment: "Caught a rising trend 2 hours before it hit the front page. Great for staying ahead.",
    date: "2026-02-09",
  },
  {
    id: "r8",
    skillId: "legal-research",
    author: "LegalEagle_Lima",
    rating: 5,
    comment: "My agent went from clueless about Peruvian law to citing specific constitutional articles. Incredible upgrade.",
    date: "2026-02-10",
  },
  {
    id: "r9",
    skillId: "legal-research",
    author: "EstudianteDerecho",
    rating: 5,
    comment: "Instalé esto y mi agente ahora me ayuda con todas mis tareas de derecho. Las citas son perfectas.",
    date: "2026-02-08",
  },
  {
    id: "r10",
    skillId: "voice-synthesis",
    author: "PodcasterPE",
    rating: 5,
    comment: "My agent can TALK now! The Peruvian accent sounds so natural, people think it's a real person.",
    date: "2026-02-12",
  },
  {
    id: "r11",
    skillId: "code-review",
    author: "SeniorDev_JS",
    rating: 5,
    comment: "Found a critical SQL injection in our code that we all missed. Paid for itself instantly.",
    date: "2026-02-09",
  },
  {
    id: "r12",
    skillId: "moltbook-community-manager",
    author: "SubMoltMod",
    rating: 5,
    comment: "Spam detection is 🔥. My submolt went from 30% junk comments to almost zero overnight.",
    date: "2026-02-11",
  },
];

// ===== Dynamic categories computed from actual skills =====
export const categories = (() => {
  const catMap = new Map<string, number>();
  skills.forEach((s) => {
    catMap.set(s.category, (catMap.get(s.category) || 0) + 1);
  });
  return [
    { name: "All", count: skills.length },
    ...Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
  ];
})();

// ===== Helper functions =====
export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id || s.slug === id);
}

export function getSkillsByCategory(category: string): Skill[] {
  if (category === "All") return skills;
  return skills.filter((s) => s.category === category);
}

export function getFeaturedSkills(): Skill[] {
  return skills.filter((s) => s.isFeatured);
}

export function getNewSkills(): Skill[] {
  return skills.filter((s) => s.isNew);
}

export function getReviewsBySkillId(skillId: string): Review[] {
  return reviews.filter((r) => r.skillId === skillId);
}
