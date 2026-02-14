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
    price: 2.99,
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
    price: 3.99,
    rating: 4.6,
    reviewCount: 87,
    installCount: 534,
    version: "1.0.0",
    category: "Productividad",
    tags: ["sentiment", "nlp", "emotions", "analysis", "text"],
    features: [
      "Sentiment polarity with confidence scores",
      "8-category emotion detection",
      "Sarcasm & irony detection",
      "Batch text analysis",
    ],
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
    category: "Código",
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
    price: 4.99,
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
    category: "Código",
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
    price: 3.49,
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
    price: 4.49,
    rating: 4.8,
    reviewCount: 56,
    installCount: 389,
    version: "1.0.0",
    category: "Investigación",
    tags: ["knowledge", "documents", "pdf", "semantic-search", "research"],
    features: [
      "Ingest documents, URLs & PDFs",
      "Semantic search by meaning",
      "Auto-categorization & tagging",
      "Incremental knowledge updates",
    ],
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
    price: 5.49,
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
    price: 4.99,
    rating: 4.8,
    reviewCount: 73,
    installCount: 521,
    version: "1.0.0",
    category: "Personalización",
    tags: ["avatar", "face", "design", "identity", "visual", "2d"],
    features: [
      "5 art styles: anime, pixel, professional, cartoon, minimal",
      "Full face customization (eyes, hair, accessories)",
      "Auto-generate from personality keywords",
      "Export PNG/SVG at multiple resolutions",
    ],
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
    price: 6.99,
    rating: 4.9,
    reviewCount: 45,
    installCount: 312,
    version: "1.0.0",
    category: "Personalización",
    tags: ["avatar", "monitor", "live", "2d", "animation", "real-time", "dashboard"],
    features: [
      "Animated 2D avatar with 8 live states",
      "Browser-based — no installation needed",
      "Real-time activity log & notifications",
      "Customizable appearance & sound alerts",
    ],
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
  // Auto-Backup Manager reviews
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
  // Sentiment Analyzer reviews
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
  // API Connector Hub reviews
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
  // Data Visualizer reviews
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
  // Security Auditor reviews
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
  // Task Scheduler Pro reviews
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
  // Knowledge Base Builder reviews
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
  // Social Media Manager reviews
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
  // Agent Face Creator reviews
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
  // Agent Live Monitor reviews
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
