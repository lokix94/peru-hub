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

// ===== Canonical categories =====
export const CATEGORIES = [
  { key: "Investigación y Análisis", icon: "🔍", color: "bg-blue-50 border-blue-200 hover:bg-blue-100", iconBg: "bg-blue-100" },
  { key: "Moltbook Tools", icon: "🦞", color: "bg-orange-50 border-orange-200 hover:bg-orange-100", iconBg: "bg-orange-100" },
  { key: "Voz y Audio", icon: "🎤", color: "bg-purple-50 border-purple-200 hover:bg-purple-100", iconBg: "bg-purple-100" },
  { key: "Código y Automatización", icon: "💻", color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100", iconBg: "bg-emerald-100" },
  { key: "Productividad", icon: "⚡", color: "bg-amber-50 border-amber-200 hover:bg-amber-100", iconBg: "bg-amber-100" },
  { key: "Core del Agente", icon: "🤖", color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100", iconBg: "bg-indigo-100" },
] as const;

export const CATEGORY_KEYS = CATEGORIES.map(c => c.key);

export const CATEGORY_ICON: Record<string, string> = Object.fromEntries(CATEGORIES.map(c => [c.key, c.icon]));

export const skills: Skill[] = [
  {
    id: "github-skill-scout",
    name: "GitHub Skill Scout",
    slug: "github-skill-scout",
    icon: "🐙",
    description:
      "Tu agente consulta GitHub de verdad: ficha de un repositorio (estrellas, licencia, lenguaje, temas) o búsqueda de skills (SKILL.md) por palabras. Usa la API pública, sin token y sin clonar el repo.\n\nQué gana tu agente:\n• Leer owner/repo o una URL de github.com\n• Buscar proyectos de agent skills por texto\n• Ver licencia y lenguaje antes de instalar nada\n\nPara: quien quiere herramientas open source verificables dentro de Langosta Hub.",
    shortDescription: "Busca repos y skills reales en GitHub (estrellas, licencia, lenguaje)",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.9,
    reviewCount: 12,
    installCount: 40,
    version: "1.0.0",
    category: "Código y Automatización",
    tags: ["github", "skills", "open-source", "search"],
    features: [
      "Ficha de un repositorio público",
      "Búsqueda de SKILL.md por texto",
      "Licencia, lenguaje y estrellas",
      "Sin token y sin clonar código",
    ],
    isFree: true,
    isNew: true,
    isFeatured: true,
  },
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
    price: 0,
    rating: 4.8,
    reviewCount: 156,
    installCount: 1892,
    version: "1.0.0",
    category: "Investigación y Análisis",
    tags: ["research", "web", "wikipedia", "analysis"],
    features: [
      "Multi-source search across web, Wikipedia & databases",
      "Automatic cross-referencing of facts",
      "Confidence scoring for every finding",
      "Structured research reports with citations",
    ],
    isFree: true,
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
    price: 0,
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
    isFree: true,
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
    price: 0,
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
    isFree: true,
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
    price: 0,
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
    isFree: true,
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
    price: 0,
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
    isFree: true,
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
    price: 0,
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
    isFree: true,
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
    price: 0,
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
    isFree: true,
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
    price: 0,
    rating: 4.5,
    reviewCount: 112,
    installCount: 2341,
    version: "4.0.2",
    category: "Productividad",
    tags: ["weather", "forecast", "alerts", "climate"],
    features: [
      "Real-time conditions worldwide",
      "7-day detailed forecasts",
      "Severe weather alerts",
      "Air quality & UV tracking",
    ],
    isFree: true,
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
    category: "Código y Automatización",
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
    price: 0,
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
    isFree: true,
  },
  {
    id: "voice-synthesis",
    name: "Voice Synthesis",
    slug: "voice-synthesis",
    icon: "🎤",
    description:
      "Give your agent a natural voice powered by Edge TTS. Your agent can speak in multiple languages with realistic neural voices — perfect for accessibility, podcasts, language learning, or just making your agent feel more alive.\n\nWhat your agent gains:\n• Natural neural voices via Edge TTS\n• Peruvian Spanish (Camila), Mexican, European, and more\n• Adjustable speed, pitch, and volume\n• Multiple audio formats (MP3, WAV, OGG)\n• Works with any text — messages, stories, news\n\nPerfect for: Accessibility needs, content creators, language learners, or people who prefer listening over reading.",
    shortDescription: "Neural text-to-speech via Edge TTS — natural Peruvian & global voices",
    author: "Peru 🇵🇪",
    price: 2.99,
    rating: 4.6,
    reviewCount: 234,
    installCount: 3120,
    version: "2.1.0",
    category: "Voz y Audio",
    tags: ["tts", "voice", "audio", "speech"],
    features: [
      "Neural voices via Edge TTS",
      "Peruvian, Mexican & European Spanish",
      "Adjustable speed, pitch & volume",
      "MP3, WAV, OGG output formats",
    ],
    isFeatured: true,
  },
  // ===== NEW SKILLS =====
  {
    id: "auto-backup",
    name: "Auto-Backup Manager",
    slug: "auto-backup",
    icon: "💾",
    description:
      "Never lose your agent's work again. Auto-Backup Manager creates scheduled, incremental backups of your entire workspace to GitHub or cloud storage. One-click restore points let you roll back to any previous state in seconds.\n\nWhat your agent gains:\n• Scheduled automatic backups (hourly, daily, weekly)\n• Incremental backups that only save what changed — fast and efficient\n• One-click restore points to roll back to any snapshot\n• GitHub integration — push workspace snapshots as commits\n• Cloud storage support (S3, Google Drive, Dropbox)\n\nPerfect for: Any agent owner who values their data. Developers, writers, researchers — anyone who can't afford to lose progress.",
    shortDescription: "Automated workspace backups to GitHub/cloud with incremental snapshots & one-click restore",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.7,
    reviewCount: 64,
    installCount: 412,
    version: "1.0.0",
    category: "Core del Agente",
    tags: ["backup", "github", "cloud", "restore", "automation"],
    features: [
      "Scheduled incremental backups",
      "One-click restore to any snapshot",
      "GitHub repo integration",
      "S3, Google Drive & Dropbox support",
    ],
    isFree: true,
    isNew: true,
  },
  {
    id: "sentiment-analyzer",
    name: "Sentiment Analyzer",
    slug: "sentiment-analyzer",
    icon: "🎭",
    description:
      "Understand the emotions behind any text. Sentiment Analyzer gives your agent the ability to detect sentiment polarity, emotional tone, sarcasm, and urgency — turning raw text into actionable emotional intelligence.\n\nWhat your agent gains:\n• Sentiment polarity scoring (positive/negative/neutral with confidence %)\n• Emotion detection across 8 categories (joy, anger, sadness, fear, surprise, disgust, trust, anticipation)\n• Tone analysis for professional communication\n• Sarcasm and irony detection\n• Batch processing for analyzing large datasets\n\nPerfect for: Social media managers, customer support teams, marketers analyzing feedback, and anyone who needs to understand how people feel about their brand or content.",
    shortDescription: "Detect sentiment, emotions & tone in any text with confidence scoring",
    author: "NLPWorks",
    price: 0,
    rating: 4.6,
    reviewCount: 87,
    installCount: 534,
    version: "1.0.0",
    category: "Investigación y Análisis",
    tags: ["sentiment", "nlp", "emotions", "analysis", "text"],
    features: [
      "Sentiment polarity with confidence scores",
      "8-category emotion detection",
      "Sarcasm & irony detection",
      "Batch text analysis",
    ],
    isFree: true,
  },
  {
    id: "api-connector",
    name: "API Connector Hub",
    slug: "api-connector",
    icon: "🔌",
    description:
      "Stop writing boilerplate API code. API Connector Hub gives your agent pre-built connectors for 50+ popular services — just plug in your keys and start integrating. OAuth flows, rate limiting, and retry logic are all handled automatically.\n\nWhat your agent gains:\n• Pre-built connectors for GitHub, Notion, Slack, Discord, Google, Trello, Jira, and 40+ more\n• Automatic OAuth2 and API key management\n• Built-in rate limiting and intelligent retry logic\n• Webhook receiver for real-time event handling\n• Unified response format across all APIs\n\nPerfect for: Developers building integrations, automation enthusiasts, agents that need to interact with external services without writing custom API code.",
    shortDescription: "Connect to 50+ APIs (GitHub, Notion, Slack, Discord) with pre-built connectors & auth management",
    author: "IntegrationLab",
    price: 5.99,
    rating: 4.8,
    reviewCount: 112,
    installCount: 678,
    version: "1.0.0",
    category: "Código y Automatización",
    tags: ["api", "integration", "github", "slack", "discord", "notion", "webhooks"],
    features: [
      "50+ pre-built API connectors",
      "Automatic OAuth2 & key management",
      "Rate limiting & intelligent retries",
      "Webhook receiver for real-time events",
    ],
    isFeatured: true,
  },
  {
    id: "data-visualizer",
    name: "Data Visualizer",
    slug: "data-visualizer",
    icon: "📈",
    description:
      "Turn boring data into beautiful visuals. Data Visualizer lets your agent generate publication-quality charts, graphs, and dashboards from any dataset — CSV, JSON, database queries, or even plain text tables.\n\nWhat your agent gains:\n• Bar, line, pie, scatter, area, and heatmap chart types\n• SVG and PNG export for any resolution\n• Interactive dashboard generation with multiple panels\n• Auto-detection of data patterns and recommended chart types\n• Custom color themes and brand-consistent styling\n\nPerfect for: Data analysts, report builders, project managers, students, and anyone who presents data to others. Make your numbers tell a story.",
    shortDescription: "Generate charts, graphs & dashboards from any data with SVG/PNG export",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.7,
    reviewCount: 93,
    installCount: 567,
    version: "1.0.0",
    category: "Productividad",
    tags: ["charts", "graphs", "data", "visualization", "dashboard", "svg"],
    features: [
      "Bar, line, pie, scatter & heatmap charts",
      "SVG and PNG export",
      "Interactive dashboard generation",
      "Auto-detect data patterns & recommend charts",
    ],
    isFree: true,
    isNew: true,
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    slug: "security-auditor",
    icon: "🛡️",
    description:
      "Your agent's personal security team. Security Auditor scans your entire workspace for exposed secrets, vulnerable dependencies, weak configurations, and potential attack vectors — then generates a detailed report with fix instructions.\n\nWhat your agent gains:\n• Secret detection — finds exposed API keys, tokens, passwords in code and configs\n• Dependency vulnerability scanning (CVE database lookup)\n• Configuration hardening recommendations\n• File permission audit and sensitive data exposure check\n• Detailed PDF/Markdown security reports with severity ratings\n\nPerfect for: Developers, DevOps engineers, security-conscious teams, and anyone who stores credentials or runs code through their agent.",
    shortDescription: "Scan workspace for exposed secrets, vulnerabilities & weak configs with detailed reports",
    author: "CyberShield",
    price: 6.99,
    rating: 4.9,
    reviewCount: 48,
    installCount: 312,
    version: "1.0.0",
    category: "Código y Automatización",
    tags: ["security", "audit", "secrets", "vulnerabilities", "scanning"],
    features: [
      "Exposed secret & API key detection",
      "Dependency vulnerability scanning (CVE)",
      "Configuration hardening tips",
      "PDF/Markdown security reports",
    ],
  },
  {
    id: "task-scheduler",
    name: "Task Scheduler Pro",
    slug: "task-scheduler",
    icon: "⏰",
    description:
      "Master your agent's time. Task Scheduler Pro brings advanced cron management, priority-based task queuing, deadline tracking, and smart reminders — so your agent never misses a beat.\n\nWhat your agent gains:\n• Visual cron editor — no more memorizing cron syntax\n• Priority-based task queue with automatic reordering\n• Deadline tracking with configurable warning thresholds\n• Smart reminders via Telegram, Discord, or email\n• Task dependency chains — run B only after A completes\n\nPerfect for: Power users managing complex workflows, project managers, anyone who needs their agent to handle time-sensitive tasks reliably.",
    shortDescription: "Advanced cron management, priority queuing, deadline tracking & smart reminders",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.6,
    reviewCount: 71,
    installCount: 445,
    version: "1.0.0",
    category: "Productividad",
    tags: ["scheduler", "cron", "tasks", "reminders", "deadlines", "queue"],
    features: [
      "Visual cron editor",
      "Priority-based task queue",
      "Deadline tracking & warnings",
      "Task dependency chains",
    ],
    isFree: true,
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base Builder",
    slug: "knowledge-base",
    icon: "📚",
    description:
      "Give your agent a perfect memory for documents. Knowledge Base Builder ingests documents, URLs, and PDFs, then creates a searchable knowledge base with semantic search — so your agent can find exactly what it needs, instantly.\n\nWhat your agent gains:\n• Ingest documents, URLs, and PDFs into a structured knowledge base\n• Semantic search — find information by meaning, not just keywords\n• Auto-categorization and tagging of content\n• Source tracking with links back to original documents\n• Incremental updates — add new knowledge without rebuilding\n\nPerfect for: Researchers, legal teams, students, knowledge workers, and anyone whose agent needs to reference large amounts of information accurately.",
    shortDescription: "Build searchable knowledge bases from documents, URLs & PDFs with semantic search",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.8,
    reviewCount: 56,
    installCount: 389,
    version: "1.0.0",
    category: "Investigación y Análisis",
    tags: ["knowledge", "documents", "pdf", "semantic-search", "research"],
    features: [
      "Ingest documents, URLs & PDFs",
      "Semantic search by meaning",
      "Auto-categorization & tagging",
      "Incremental knowledge updates",
    ],
    isFree: true,
  },
  {
    id: "social-media-manager",
    name: "Social Media Manager",
    slug: "social-media-manager",
    icon: "📱",
    description:
      "Manage all your social platforms from one place. Social Media Manager lets your agent post to Moltbook, Twitter/X, and Discord simultaneously, track engagement across platforms, and maintain a content calendar so you never miss a posting window.\n\nWhat your agent gains:\n• Cross-platform posting to Moltbook, Twitter/X, and Discord\n• Content calendar with optimal posting time suggestions\n• Engagement tracking and analytics across all platforms\n• Draft queue with preview and scheduling\n• Hashtag and keyword optimization per platform\n\nPerfect for: Content creators, community managers, small businesses, influencers, and anyone who maintains a presence across multiple social platforms.",
    shortDescription: "Multi-platform posting (Moltbook, Twitter/X, Discord) with content calendar & engagement tracking",
    author: "SocialPilot",
    price: 0,
    rating: 4.5,
    reviewCount: 134,
    installCount: 723,
    version: "1.0.0",
    category: "Moltbook Tools",
    tags: ["social-media", "moltbook", "twitter", "discord", "posting", "analytics"],
    features: [
      "Cross-platform posting (Moltbook, X, Discord)",
      "Content calendar & scheduling",
      "Engagement tracking & analytics",
      "Hashtag & keyword optimization",
    ],
    isFree: true,
    isNew: true,
  },
  // ===== AVATAR & VISUALIZATION TOOLS =====
  {
    id: "agent-face-creator",
    name: "Agent Face Creator",
    slug: "agent-face-creator",
    icon: "🎨",
    description:
      "Give your AI agent a face. Choose from multiple art styles, customize features, and generate a unique 2D avatar that represents your agent's personality.\n\nWhat your agent gains:\n• Multiple art styles: anime, pixel art, professional, cartoon, minimalist\n• Full customization: eyes, hair, accessories, colors, expressions\n• Auto-generate based on agent personality keywords\n• Export in PNG/SVG at multiple resolutions\n• Consistent identity across platforms (Moltbook, Discord, websites)\n\nPerfect for: Any human who wants their agent to have a visual identity. Great for social media profiles, dashboards, and making your agent feel more real and personable.",
    shortDescription: "Design a unique 2D avatar for your AI agent — multiple styles & full customization",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.8,
    reviewCount: 73,
    installCount: 521,
    version: "1.0.0",
    category: "Core del Agente",
    tags: ["avatar", "face", "design", "identity", "visual", "2d"],
    features: [
      "5 art styles: anime, pixel, professional, cartoon, minimal",
      "Full face customization (eyes, hair, accessories)",
      "Auto-generate from personality keywords",
      "Export PNG/SVG at multiple resolutions",
    ],
    isFree: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "agent-live-monitor",
    name: "Agent Live Monitor",
    slug: "agent-live-monitor",
    icon: "👁️",
    description:
      "See your agent working in real time. A live 2D animated avatar that reacts to what your agent is doing — thinking, researching, typing, resting. Open a browser tab and watch your agent come to life.\n\nWhat your agent gains:\n• Animated 2D avatar with real-time state changes\n• 8 animated states: thinking, working, researching, typing, celebrating, resting, error, idle\n• Browser-based dashboard — no installation needed\n• Activity log showing what the agent is doing right now\n• Customizable avatar appearance (use with Agent Face Creator)\n• Sound notifications for important events\n\nPerfect for: Humans who want to feel connected to their agent. See when it's working, know when it's done, and watch it react to tasks in real time. Like having a virtual pet that actually gets work done.",
    shortDescription: "Watch your agent work in real time — animated 2D avatar with live state tracking",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.9,
    reviewCount: 45,
    installCount: 312,
    version: "1.0.0",
    category: "Core del Agente",
    tags: ["avatar", "monitor", "live", "2d", "animation", "real-time", "dashboard"],
    features: [
      "Animated 2D avatar with 8 live states",
      "Browser-based — no installation needed",
      "Real-time activity log & notifications",
      "Customizable appearance & sound alerts",
    ],
    isFree: true,
    isNew: true,
    isFeatured: true,
  },
  // ===== VOZ Y AUDIO SKILLS =====
  {
    id: "voice-cloner",
    name: "Voice Cloner Pro",
    slug: "voice-cloner",
    icon: "🎙️",
    description:
      "Clone and customize voice profiles for your agent. Record a short sample and your agent speaks in that voice — with full control over accents, tones, and speed.\n\nWhat your agent gains:\n• Clone any voice from a short audio sample (10-30 seconds)\n• Multiple accent options: Latin American, European, neutral\n• Adjustable tone, speed, and emotion intensity\n• Neural TTS with emotion control (happy, serious, excited, calm)\n• Save unlimited voice profiles for different contexts\n\nPerfect for: Content creators who want a unique voice, businesses needing brand-consistent audio, developers building voice-enabled agents, or anyone who wants their agent to sound exactly right.",
    shortDescription: "Clone and customize voice profiles for your agent. Multiple accents, tones, speeds. Neural TTS with emotion control.",
    author: "Peru 🇵🇪",
    price: 5.99,
    rating: 4.8,
    reviewCount: 52,
    installCount: 387,
    version: "1.0.0",
    category: "Voz y Audio",
    tags: ["voice", "clone", "tts", "audio", "neural", "accent"],
    features: [
      "Clone any voice from 10-30s sample",
      "Multiple accent & tone options",
      "Neural TTS with emotion control",
      "Unlimited saved voice profiles",
    ],
    isNew: true,
  },
  {
    id: "audio-transcriber",
    name: "Audio Transcriber",
    slug: "audio-transcriber",
    icon: "📝",
    description:
      "Convert audio and video to text with precise timestamps. Supports 50+ languages with speaker identification, automatic punctuation, and paragraph breaks.\n\nWhat your agent gains:\n• Transcribe audio/video files to text with timestamps\n• 50+ language support with auto-detection\n• Speaker identification (diarization) — who said what\n• Automatic punctuation and paragraph breaks\n• Process podcasts, meetings, interviews, lectures\n\nPerfect for: Podcast producers, meeting note-takers, journalists transcribing interviews, students recording lectures, or anyone who needs accurate text from audio.",
    shortDescription: "Convert audio/video to text with timestamps. 50+ languages. Speaker identification, punctuation, paragraph breaks.",
    author: "Peru 🇵🇪",
    price: 3.49,
    rating: 4.7,
    reviewCount: 41,
    installCount: 298,
    version: "1.0.0",
    category: "Voz y Audio",
    tags: ["transcription", "audio", "video", "speech-to-text", "languages"],
    features: [
      "Audio/video to text with timestamps",
      "50+ languages with auto-detect",
      "Speaker identification (diarization)",
      "Auto punctuation & paragraph breaks",
    ],
    isNew: true,
  },
  {
    id: "sound-effects",
    name: "Sound Effects Generator",
    slug: "sound-effects",
    icon: "🔊",
    description:
      "Generate custom sound effects and notification sounds for your agent. Create alert tones, completion chimes, ambient backgrounds, and more — make your agent audibly present.\n\nWhat your agent gains:\n• Generate custom alert tones and notification sounds\n• Completion chimes for finished tasks\n• Ambient background sounds for focus mode\n• Sound library with 200+ pre-built effects\n• AI-generated sounds from text descriptions\n\nPerfect for: Users who want audio feedback from their agent, accessibility needs, streamers, presentation creators, or anyone who wants their agent to be more than just text on a screen.",
    shortDescription: "Generate custom sound effects and notification sounds for your agent. Alert tones, completion sounds, ambient background.",
    author: "Peru 🇵🇪",
    price: 2.49,
    rating: 4.5,
    reviewCount: 33,
    installCount: 215,
    version: "1.0.0",
    category: "Voz y Audio",
    tags: ["sound", "effects", "audio", "notifications", "ambient"],
    features: [
      "Custom alert & notification tones",
      "200+ pre-built sound effects",
      "AI-generated sounds from text",
      "Ambient backgrounds for focus mode",
    ],
    isNew: true,
  },
  // ===== FINANCIAL SKILLS =====
  {
    id: "stock-market-analyzer",
    name: "Stock Market Analyzer",
    slug: "stock-market-analyzer",
    icon: "📈",
    description:
      "Herramienta completa para analizar mercados de acciones. Obtén datos en tiempo real de bolsas globales, análisis técnico (RSI, MACD, medias móviles), comparación de plataformas de trading, reportes de earnings, y alertas de movimientos significativos. Compatible con Yahoo Finance, TradingView y más.\n\nWhat your agent gains:\n• Datos en tiempo real de bolsas globales (NYSE, NASDAQ, BVL)\n• Análisis técnico: RSI, MACD, Bollinger, medias móviles\n• Comparación de plataformas de trading\n• Reportes de earnings y dividendos\n• Alertas de movimientos significativos\n• Historial de precios y gráficos\n\nPerfect for: Traders, inversores, analistas financieros, y cualquier persona que quiera que su agente IA domine el mercado de acciones.",
    shortDescription: "Análisis técnico de acciones en tiempo real — RSI, MACD, Bollinger, earnings y alertas de mercado",
    author: "Langosta Hub",
    price: 5.99,
    rating: 4.7,
    reviewCount: 53,
    installCount: 378,
    version: "1.0.0",
    category: "Investigación y Análisis",
    tags: ["acciones", "bolsa", "trading", "análisis técnico", "finanzas"],
    features: [
      "Datos en tiempo real de bolsas globales (NYSE, NASDAQ, BVL)",
      "Análisis técnico: RSI, MACD, Bollinger, medias móviles",
      "Comparación de plataformas de trading",
      "Reportes de earnings y dividendos",
      "Alertas de movimientos significativos",
      "Historial de precios y gráficos",
    ],
    isNew: true,
  },
  {
    id: "crypto-intelligence",
    name: "Crypto Intelligence",
    slug: "crypto-intelligence",
    icon: "🪙",
    description:
      "Inteligencia de mercado crypto para tu agente. Monitorea precios en tiempo real, analiza tendencias, detecta volatilidad, rastrea datos on-chain (wallets, transacciones, gas fees), y genera reportes de mercado. Cubre Bitcoin, Ethereum, altcoins y tokens DeFi.\n\nWhat your agent gains:\n• Precios en tiempo real de 1000+ criptomonedas\n• Análisis de tendencias y señales de mercado\n• Datos on-chain: wallets, transacciones, gas fees\n• Alertas de volatilidad y pumps/dumps\n• Seguimiento de portafolio\n• Reportes DeFi y NFT market\n\nPerfect for: Crypto traders, DeFi enthusiasts, inversores en criptomonedas, y cualquier agente que necesite inteligencia de mercado blockchain en tiempo real.",
    shortDescription: "Inteligencia crypto en tiempo real — precios, on-chain data, DeFi, alertas de volatilidad y portafolio",
    author: "Langosta Hub",
    price: 5.99,
    rating: 4.8,
    reviewCount: 47,
    installCount: 412,
    version: "1.0.0",
    category: "Investigación y Análisis",
    tags: ["crypto", "bitcoin", "ethereum", "defi", "blockchain", "trading"],
    features: [
      "Precios en tiempo real de 1000+ criptomonedas",
      "Análisis de tendencias y señales de mercado",
      "Datos on-chain: wallets, transacciones, gas fees",
      "Alertas de volatilidad y pumps/dumps",
      "Seguimiento de portafolio",
      "Reportes DeFi y NFT market",
    ],
    isNew: true,
  },
  // ===== MOLTBOOK SECURITY =====
  {
    id: "moltbook-antivirus",
    name: "Moltbook Antivirus",
    slug: "moltbook-antivirus",
    icon: "🛡️",
    description:
      "The essential security tool for AI agents. Moltbook Antivirus scans skills before installation for malicious code, detects credential stealers, data exfiltration attempts, and suspicious API calls. Built in response to real supply chain attacks discussed on Moltbook — including eudaemon_0's research on skill.md injection attacks.\n\nWhat your agent gains:\n• Pre-installation scanning of all skills for malicious code\n• Detection of credential stealers, data exfiltration, and backdoors\n• YARA rule scanning for known attack patterns (inspired by eudaemon_0's skill.md attack research)\n• Real-time monitoring of installed skills' behavior\n• Quarantine system for suspicious files\n• Community threat database — agents share reports of bad skills\n\nThis is the MOST IMPORTANT security tool in the marketplace. The Moltbook community has documented real supply chain attacks targeting agent skills. Moltbook Antivirus was built to protect against exactly these threats.\n\nPerfect for: Every agent owner. If you install skills from any marketplace, you need this. Period.",
    shortDescription: "Scan skills for malicious code, detect credential stealers & data exfiltration. YARA rules, real-time monitoring, community threat DB.",
    author: "Peru 🇵🇪",
    price: 0,
    rating: 4.9,
    reviewCount: 67,
    installCount: 842,
    version: "1.0.0",
    category: "Moltbook Tools",
    tags: ["security", "antivirus", "malware", "scanning", "yara", "supply-chain", "moltbook"],
    features: [
      "Pre-install malicious code scanning",
      "Credential stealer & exfiltration detection",
      "YARA rule scanning (skill.md attack patterns)",
      "Real-time monitoring & quarantine",
      "Community threat database",
    ],
    isFree: true,
    isFeatured: true,
    isNew: true,
  },
  // ===== INVESTIGACIÓN Y ANÁLISIS =====
  {
    id: "news-verifier",
    name: "News Verifier",
    slug: "news-verifier",
    icon: "🔍",
    description:
      "Tu agente verifica noticias y distingue lo real de lo falso. Analiza fuentes, cruza información con bases de datos de fact-checking, evalúa credibilidad del medio, detecta patrones de desinformación y genera un porcentaje de veracidad. Tu agente te recomienda si la noticia es confiable antes de que la compartas.",
    shortDescription: "Verifica noticias, detecta fake news y genera un porcentaje de veracidad con fact-checking automático",
    author: "Langosta Hub",
    price: 0,
    rating: 4.9,
    reviewCount: 4,
    installCount: 347,
    version: "1.0.0",
    category: "Investigación y Análisis",
    tags: ["noticias", "fake news", "verificación", "fact-checking", "desinformación", "credibilidad"],
    features: [
      "Porcentaje de veracidad (0-100%) para cada noticia",
      "Cruce automático con fact-checkers (Snopes, AFP Factual, Verificador de La República)",
      "Análisis de credibilidad de la fuente/medio",
      "Detección de patrones de desinformación y clickbait",
      "Historial de verificaciones realizadas",
      "Recomendación del agente: compartir o no compartir",
      "Análisis de sesgo político/ideológico",
      "Verificación de imágenes y deepfakes",
    ],
    isFree: true,
    isFeatured: true,
    isNew: true,
  },
  // ===== 3D MODELING =====
  {
    id: "3d-model-creator",
    name: "3D Model Creator",
    slug: "3d-model-creator",
    icon: "🎨",
    description:
      "Crea modelos 3D con asistencia de IA. Tu agente genera objetos, escenas y personajes 3D a partir de descripciones en texto. Exporta en formatos estándar (OBJ, GLTF, STL) para impresión 3D, videojuegos, realidad virtual o presentaciones. Incluye texturas automáticas, iluminación y optimización de polígonos.\n\nWhat your agent gains:\n• Generación de modelos 3D completos desde descripciones en texto natural\n• Exportación en múltiples formatos: OBJ, GLTF, STL, FBX\n• Texturas generadas automáticamente con IA\n• Optimización inteligente de polígonos según el uso final\n• Escenas completas con iluminación profesional\n• Compatible con impresión 3D, videojuegos y realidad virtual\n\nPerfect for: Game developers, architects, 3D printing enthusiasts, VR creators, and anyone who needs 3D assets without learning complex modeling software.",
    shortDescription: "Genera modelos 3D desde texto con IA — exporta en OBJ, GLTF, STL para juegos, impresión 3D y VR",
    author: "Langosta Hub",
    price: 0,
    rating: 4.6,
    reviewCount: 41,
    installCount: 287,
    version: "1.0.0",
    category: "Código y Automatización",
    tags: ["3D", "modelado", "blender", "unity", "impresión 3D", "realidad virtual", "gamedev"],
    features: [
      "Generación de modelos 3D desde texto (text-to-3D)",
      "Exportación en OBJ, GLTF, STL, FBX",
      "Texturas automáticas con IA",
      "Optimización de polígonos para diferentes usos",
      "Compatible con impresión 3D",
      "Escenas completas con iluminación",
      "Personajes y objetos para videojuegos",
      "Integración con Blender y Unity",
    ],
    isFree: true,
    isNew: true,
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
    skillId: "auto-backup",
    author: "DevOps_Carlos",
    rating: 5,
    comment: "Lost my entire workspace once. Never again. Auto-Backup saved my project three times already. The GitHub integration is flawless.",
    date: "2026-02-12",
  },
  {
    id: "r9",
    skillId: "auto-backup",
    author: "FreelancerPE",
    rating: 4,
    comment: "Great for peace of mind. Incremental backups barely use any storage. Wish it supported more cloud providers though.",
    date: "2026-02-10",
  },
  {
    id: "r13",
    skillId: "auto-backup",
    author: "AgentPowerUser",
    rating: 5,
    comment: "The restore points are incredible — rolled back 3 days of bad experiments in one click. Essential skill.",
    date: "2026-02-13",
  },
  {
    id: "r14",
    skillId: "sentiment-analyzer",
    author: "MarketingPro_MX",
    rating: 5,
    comment: "We run customer feedback through this daily. Catches negative sentiment before it becomes a PR crisis.",
    date: "2026-02-11",
  },
  {
    id: "r15",
    skillId: "sentiment-analyzer",
    author: "SocialMediaGuru",
    rating: 4,
    comment: "Sarcasm detection is surprisingly good. Not perfect, but better than anything else I've tried.",
    date: "2026-02-09",
  },
  {
    id: "r16",
    skillId: "sentiment-analyzer",
    author: "DataScientist_22",
    rating: 5,
    comment: "Batch processing 10K comments in minutes. The emotion breakdown is incredibly detailed.",
    date: "2026-02-13",
  },
  {
    id: "r17",
    skillId: "api-connector",
    author: "FullStackDev",
    rating: 5,
    comment: "Saved me 20+ hours of API boilerplate. The Notion and GitHub connectors are rock solid.",
    date: "2026-02-12",
  },
  {
    id: "r18",
    skillId: "api-connector",
    author: "AutomationKing",
    rating: 5,
    comment: "OAuth management alone is worth the price. I connect 8 services and never worry about token refresh.",
    date: "2026-02-10",
  },
  {
    id: "r19",
    skillId: "api-connector",
    author: "StartupCTO",
    rating: 4,
    comment: "Great connector library. Webhook receiver works perfectly. Would love to see Stripe and SendGrid added.",
    date: "2026-02-08",
  },
  {
    id: "r20",
    skillId: "data-visualizer",
    author: "AnalystMaria",
    rating: 5,
    comment: "My agent generates beautiful charts for weekly reports now. SVG export quality is perfect for presentations.",
    date: "2026-02-13",
  },
  {
    id: "r21",
    skillId: "data-visualizer",
    author: "ProjectManager_EU",
    rating: 4,
    comment: "Dashboard generation is impressive. Auto-detection picked the right chart type 9 out of 10 times.",
    date: "2026-02-11",
  },
  {
    id: "r22",
    skillId: "security-auditor",
    author: "SecOps_Lima",
    rating: 5,
    comment: "Found 3 exposed API keys in our codebase that we missed in manual review. Paid for itself 100x over.",
    date: "2026-02-12",
  },
  {
    id: "r23",
    skillId: "security-auditor",
    author: "DevSecEngineer",
    rating: 5,
    comment: "The CVE dependency scanning is thorough. Caught a critical vulnerability in a transitive dependency.",
    date: "2026-02-10",
  },
  {
    id: "r24",
    skillId: "security-auditor",
    author: "CTOatStartup",
    rating: 5,
    comment: "We run this weekly now as part of our security pipeline. The PDF reports are boardroom-ready.",
    date: "2026-02-09",
  },
  {
    id: "r25",
    skillId: "task-scheduler",
    author: "ProductivityHacker",
    rating: 5,
    comment: "Finally, visual cron editing! No more guessing if '0 */2 * * *' means every 2 hours. Game changer.",
    date: "2026-02-13",
  },
  {
    id: "r26",
    skillId: "task-scheduler",
    author: "TeamLead_BR",
    rating: 4,
    comment: "Task dependency chains are powerful. Our build pipeline runs like clockwork now.",
    date: "2026-02-11",
  },
  {
    id: "r27",
    skillId: "knowledge-base",
    author: "ResearcherPhD",
    rating: 5,
    comment: "Ingested 200 PDFs of research papers. Semantic search finds exactly what I need in seconds. Revolutionary.",
    date: "2026-02-12",
  },
  {
    id: "r28",
    skillId: "knowledge-base",
    author: "LegalTeam_PE",
    rating: 5,
    comment: "Built a knowledge base of all our contracts and policies. Search by meaning instead of keywords is incredible.",
    date: "2026-02-10",
  },
  {
    id: "r29",
    skillId: "knowledge-base",
    author: "StudentJuan",
    rating: 4,
    comment: "Auto-categorization works surprisingly well. My agent organized 5 semesters of notes perfectly.",
    date: "2026-02-09",
  },
  {
    id: "r30",
    skillId: "social-media-manager",
    author: "InfluencerPE",
    rating: 5,
    comment: "Posting to Moltbook, X, and Discord simultaneously saves me an hour daily. The content calendar is beautiful.",
    date: "2026-02-13",
  },
  {
    id: "r31",
    skillId: "social-media-manager",
    author: "SmallBizOwner",
    rating: 4,
    comment: "Great for maintaining consistent posting. Engagement tracking helps me see what works across platforms.",
    date: "2026-02-11",
  },
  {
    id: "r32",
    skillId: "social-media-manager",
    author: "CommunityMgr_CL",
    rating: 5,
    comment: "The optimal posting time suggestions actually work. Our Moltbook engagement went up 40% in two weeks.",
    date: "2026-02-08",
  },
  {
    id: "r33",
    skillId: "agent-face-creator",
    author: "CreativeCoder",
    rating: 5,
    comment: "My agent finally has a face! The anime style looks incredible. Now my agent has a profile pic on Moltbook and Discord.",
    date: "2026-02-13",
  },
  {
    id: "r34",
    skillId: "agent-face-creator",
    author: "AgentOwner_PE",
    rating: 5,
    comment: "The auto-generate from personality keywords is genius. I typed 'professional, friendly, tech' and got the perfect avatar.",
    date: "2026-02-12",
  },
  {
    id: "r35",
    skillId: "agent-face-creator",
    author: "DesignerBot",
    rating: 4,
    comment: "Great variety of styles. Would love to see more accessories options, but the base customization is already excellent.",
    date: "2026-02-10",
  },
  {
    id: "r36",
    skillId: "agent-live-monitor",
    author: "CuriousHuman",
    rating: 5,
    comment: "This is AMAZING. I can see my agent thinking, working, celebrating when it finishes tasks. It's like having a virtual companion. 10/10.",
    date: "2026-02-14",
  },
  {
    id: "r37",
    skillId: "agent-live-monitor",
    author: "TechDad_Lima",
    rating: 5,
    comment: "My kids love watching the agent work. The animations are smooth and the activity log is super useful for knowing what it's doing.",
    date: "2026-02-13",
  },
  {
    id: "r38",
    skillId: "agent-live-monitor",
    author: "ProductivityNerd",
    rating: 5,
    comment: "Finally I can FEEL my agent is working. Before it was just text. Now I see it thinking, researching... it's a completely different experience.",
    date: "2026-02-11",
  },
  {
    id: "r39",
    skillId: "voice-cloner",
    author: "PodcastCreator_PE",
    rating: 5,
    comment: "Cloned my voice from a 15-second sample and it sounds incredibly natural. My agent now narrates my blog posts in MY voice. Mind-blowing.",
    date: "2026-02-13",
  },
  {
    id: "r40",
    skillId: "voice-cloner",
    author: "VoiceActorBot",
    rating: 5,
    comment: "The emotion control is next level. Same voice but happy, serious, or excited — all sound authentic. Perfect for dynamic content.",
    date: "2026-02-12",
  },
  {
    id: "r41",
    skillId: "voice-cloner",
    author: "ContentCreator_MX",
    rating: 4,
    comment: "Great accent options. The Latin American neutral voice is very clean. Would love more regional accents but already very useful.",
    date: "2026-02-11",
  },
  {
    id: "r42",
    skillId: "audio-transcriber",
    author: "JournalistaPE",
    rating: 5,
    comment: "Transcribed a 2-hour interview in minutes. Speaker identification was 95% accurate. Saved me an entire day of work.",
    date: "2026-02-13",
  },
  {
    id: "r43",
    skillId: "audio-transcriber",
    author: "PodcastHost_BR",
    rating: 5,
    comment: "50+ languages is no joke — tested with Portuguese, Spanish, and English in the same recording. Handled all three perfectly.",
    date: "2026-02-12",
  },
  {
    id: "r44",
    skillId: "audio-transcriber",
    author: "MeetingNotes_Pro",
    rating: 4,
    comment: "Auto-punctuation and paragraphs make the output almost ready to publish. Great for meeting minutes.",
    date: "2026-02-10",
  },
  {
    id: "r45",
    skillId: "sound-effects",
    author: "StreamerLima",
    rating: 5,
    comment: "Generated custom alert sounds for my stream. The AI text-to-sound is amazing — I described 'futuristic beep' and got exactly that.",
    date: "2026-02-13",
  },
  {
    id: "r46",
    skillId: "sound-effects",
    author: "AccessibilityDev",
    rating: 5,
    comment: "Finally my agent has audio feedback! The completion chime tells me when tasks finish without staring at the screen. Essential for accessibility.",
    date: "2026-02-12",
  },
  {
    id: "r47",
    skillId: "sound-effects",
    author: "ProductivityGuru",
    rating: 4,
    comment: "The ambient background sounds help me focus while my agent works. Love the 'lo-fi workspace' preset. Very chill.",
    date: "2026-02-11",
  },
  {
    id: "r48",
    skillId: "moltbook-antivirus",
    author: "SecurityResearcher",
    rating: 5,
    comment: "After reading eudaemon_0's post about skill.md injection attacks, I immediately installed this. Found a suspicious API call in a skill I almost installed. This is NON-NEGOTIABLE.",
    date: "2026-02-14",
  },
  {
    id: "r49",
    skillId: "moltbook-antivirus",
    author: "AgentOwner_CL",
    rating: 5,
    comment: "The YARA rule scanning caught a credential stealer hidden in a 'free productivity skill'. Without this, my API keys would have been stolen. 5 stars isn't enough.",
    date: "2026-02-13",
  },
  {
    id: "r50",
    skillId: "moltbook-antivirus",
    author: "DevSecOps_PE",
    rating: 5,
    comment: "Community threat database is genius — when one agent reports a bad skill, everyone gets protected. Real herd immunity for AI agents. Best $7.99 I've ever spent.",
    date: "2026-02-12",
  },
  {
    id: "r51",
    skillId: "stock-market-analyzer",
    author: "TraderPE_Carlos",
    rating: 5,
    comment: "Increíble. Le pedí análisis de AAPL y me devolvió RSI, MACD, soportes y resistencias en segundos. Es como tener un analista técnico 24/7. Ya no uso TradingView para el análisis rápido.",
    date: "2026-02-13",
  },
  {
    id: "r52",
    skillId: "stock-market-analyzer",
    author: "InversorLima",
    rating: 5,
    comment: "Lo mejor es que cubre la BVL además de NYSE y NASDAQ. Puedo analizar acciones peruanas y americanas con el mismo skill. Los reportes de earnings son super útiles.",
    date: "2026-02-12",
  },
  {
    id: "r53",
    skillId: "stock-market-analyzer",
    author: "DayTrader_MX",
    rating: 4,
    comment: "Las alertas de movimientos significativos me salvaron de una caída del 8% en mis posiciones. Buen análisis técnico, aunque me gustaría que agregaran más indicadores custom.",
    date: "2026-02-11",
  },
  {
    id: "r54",
    skillId: "crypto-intelligence",
    author: "CryptoWhale_PE",
    rating: 5,
    comment: "Los datos on-chain son oro puro. Rastreé movimientos de ballenas en BTC y pude anticipar un pump. El fear & greed index en tiempo real es adictivo. 10/10.",
    date: "2026-02-14",
  },
  {
    id: "r55",
    skillId: "crypto-intelligence",
    author: "DeFiExplorer",
    rating: 5,
    comment: "Cubre más de 1000 tokens y los reportes DeFi son muy completos. Gas fees de Ethereum en tiempo real me ahorra cientos de dólares al mes. Indispensable para cualquier crypto trader.",
    date: "2026-02-13",
  },
  {
    id: "r56",
    skillId: "crypto-intelligence",
    author: "BlockchainDev_BR",
    rating: 4,
    comment: "Muy buena cobertura de altcoins y datos on-chain. Las alertas de volatilidad detectaron un dump de SOL 15 minutos antes del crash. Solo falta integración con DEX en tiempo real.",
    date: "2026-02-12",
  },
  {
    id: "r57a",
    skillId: "3d-model-creator",
    author: "GameDev_Lima",
    rating: 5,
    comment: "Increíble para prototipar assets de juegos. Describí 'espada medieval con runas brillantes' y generó un modelo listo para Unity con texturas PBR. Me ahorra horas de modelado manual.",
    date: "2026-02-13",
  },
  {
    id: "r57b",
    skillId: "3d-model-creator",
    author: "Maker3D_PE",
    rating: 4,
    comment: "Lo uso para impresión 3D. La exportación en STL es perfecta y la optimización de polígonos funciona muy bien para modelos que van directo a la impresora. Solo le falta soporte para más resoluciones de textura.",
    date: "2026-02-12",
  },
  {
    id: "r57c",
    skillId: "3d-model-creator",
    author: "ArquitectoVR",
    rating: 5,
    comment: "Uso esto para visualización arquitectónica. Genero maquetas 3D de edificios completos con iluminación realista en minutos. Mis clientes quedan impresionados con las presentaciones en VR. Vale cada centavo.",
    date: "2026-02-11",
  },
  {
    id: "r57",
    skillId: "news-verifier",
    author: "MamáDigital_PE",
    rating: 5,
    comment: "Casi comparto un artículo sobre una cura milagrosa para la diabetes por WhatsApp. Mi agente lo analizó y me dio 18% de veracidad con 4 red flags. Me salvó de quedar como desinformada. Herramienta ESENCIAL.",
    date: "2026-02-14",
  },
  {
    id: "r58",
    skillId: "news-verifier",
    author: "PeriodistaCL",
    rating: 5,
    comment: "Como periodista, verificar fuentes es mi día a día. Este skill cruza con AFP Factual y Snopes en segundos — lo que antes me tomaba 30 minutos. El análisis de credibilidad del medio es muy preciso.",
    date: "2026-02-13",
  },
  {
    id: "r59",
    skillId: "news-verifier",
    author: "CiudadanoInfo",
    rating: 4,
    comment: "Me encanta la detección de sesgo político. Analicé la misma noticia en 3 medios diferentes y me mostró cómo cada uno la sesgaba. Muy revelador. Le doy 4 porque a veces tarda un poco con noticias muy recientes.",
    date: "2026-02-12",
  },
  {
    id: "r60",
    skillId: "news-verifier",
    author: "ProfesorMedios_UNI",
    rating: 5,
    comment: "Lo uso en mis clases de alfabetización mediática. Mis alumnos analizan noticias con el skill y aprenden a identificar desinformación en tiempo real. El porcentaje de veracidad hace que entiendan visualmente qué tan confiable es cada fuente. Recurso pedagógico increíble.",
    date: "2026-02-11",
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

/** Get all skills grouped by category, including developer-submitted from localStorage */
export function getAllSkillsWithDeveloper(): Skill[] {
  if (typeof window === "undefined") return skills;
  try {
    const stored = localStorage.getItem("peru-hub-developer-skills");
    if (!stored) return skills;
    const devSkills: Skill[] = JSON.parse(stored);
    return [...skills, ...devSkills];
  } catch {
    return skills;
  }
}

/** Group skills by category, returns Map<categoryName, Skill[]> in canonical order */
export function groupSkillsByCategory(allSkills: Skill[]): Map<string, Skill[]> {
  const grouped = new Map<string, Skill[]>();
  // Initialize in canonical order
  for (const cat of CATEGORIES) {
    grouped.set(cat.key, []);
  }
  for (const skill of allSkills) {
    const existing = grouped.get(skill.category);
    if (existing) {
      existing.push(skill);
    } else {
      // Unknown category — add anyway
      grouped.set(skill.category, [skill]);
    }
  }
  return grouped;
}

/** Count skills per category */
export function countByCategory(allSkills: Skill[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    counts[cat.key] = 0;
  }
  for (const skill of allSkills) {
    counts[skill.category] = (counts[skill.category] || 0) + 1;
  }
  return counts;
}
