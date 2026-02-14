export interface Skill {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  rating: number;
  reviews: number;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  installs: number;
  icon: string;
  featured: boolean;
  demoAvailable: boolean;
  createdAt: string;
  version: string;
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
  {
    id: "peruvian-legal-research",
    name: "Peruvian Legal Research",
    description: "Deep research into Peruvian law, constitutional analysis, and legal document drafting with citations.",
    longDescription: "A comprehensive legal research skill that gives your AI agent deep knowledge of Peruvian law. It can analyze constitutional articles, research case law, draft legal documents, and provide citations to specific laws and regulations. Perfect for legal professionals, students, and anyone needing reliable Peruvian legal information.\n\nFeatures:\n- Constitutional analysis (1993 Constitution)\n- Civil and criminal code research\n- Legal document drafting assistance\n- Citation generation with article references\n- Bilingual support (Spanish/English)",
    price: 0,
    rating: 4.8,
    reviews: 24,
    author: "Peru-AI",
    authorAvatar: "🇵🇪",
    category: "Research",
    tags: ["legal", "peru", "research", "law", "constitution"],
    installs: 156,
    icon: "⚖️",
    featured: true,
    demoAvailable: true,
    createdAt: "2026-01-15",
    version: "1.0.0"
  },
  {
    id: "voice-camila-tts",
    name: "Voice: Camila Neural TTS",
    description: "High-quality Peruvian Spanish text-to-speech using Microsoft's CamilaNeural voice engine.",
    longDescription: "Transform your AI agent's text responses into natural-sounding Peruvian Spanish speech. Uses Microsoft's Edge TTS CamilaNeural voice — one of the most natural-sounding Spanish voices available.\n\nFeatures:\n- Natural Peruvian Spanish pronunciation\n- Adjustable speed, pitch, and volume\n- SSML support for expressive speech\n- SRT subtitle generation\n- Streaming audio output\n- Multiple output formats (MP3, WAV, OGG)",
    price: 0,
    rating: 4.9,
    reviews: 67,
    author: "Peru-AI",
    authorAvatar: "🇵🇪",
    category: "Voice",
    tags: ["tts", "voice", "spanish", "peru", "audio"],
    installs: 432,
    icon: "🎙️",
    featured: true,
    demoAvailable: true,
    createdAt: "2026-01-20",
    version: "2.1.0"
  },
  {
    id: "web-research-pro",
    name: "Web Research Pro",
    description: "Advanced web research with multi-source verification, summarization, and structured data extraction.",
    longDescription: "Supercharge your AI agent with professional-grade web research capabilities. This skill enables deep web searches across multiple engines, cross-references information, extracts structured data, and provides verified summaries with source links.\n\nFeatures:\n- Multi-engine search (Brave, Google, DuckDuckGo)\n- Content extraction and summarization\n- Fact verification across sources\n- Structured data output (JSON, tables)\n- Source credibility scoring\n- Research report generation",
    price: 4.99,
    rating: 4.7,
    reviews: 89,
    author: "SearchCraft",
    authorAvatar: "🔍",
    category: "Research",
    tags: ["research", "web", "search", "data", "analysis"],
    installs: 1205,
    icon: "🌐",
    featured: true,
    demoAvailable: true,
    createdAt: "2026-01-10",
    version: "3.2.1"
  },
  {
    id: "code-review-assistant",
    name: "Code Review Assistant",
    description: "Automated code review with security analysis, best practices checking, and improvement suggestions.",
    longDescription: "Give your AI agent the ability to perform thorough code reviews. This skill analyzes code for security vulnerabilities, performance issues, best practice violations, and suggests improvements with explanations.\n\nFeatures:\n- Security vulnerability detection\n- Performance analysis\n- Best practices enforcement\n- Code style consistency checks\n- Dependency audit\n- Supports 20+ languages\n- Git diff analysis\n- PR review automation",
    price: 9.99,
    rating: 4.6,
    reviews: 45,
    author: "DevTools Inc",
    authorAvatar: "🛠️",
    category: "Development",
    tags: ["code", "review", "security", "development", "programming"],
    installs: 678,
    icon: "💻",
    featured: false,
    demoAvailable: true,
    createdAt: "2026-02-01",
    version: "1.5.0"
  },
  {
    id: "weather-intelligence",
    name: "Weather Intelligence",
    description: "Real-time weather data, forecasts, alerts, and natural language weather reporting for any location.",
    longDescription: "Equip your AI agent with comprehensive weather intelligence. Get real-time conditions, multi-day forecasts, severe weather alerts, and natural language weather reports for any location worldwide.\n\nFeatures:\n- Real-time weather conditions\n- 7-day detailed forecasts\n- Severe weather alerts\n- Air quality index\n- UV index tracking\n- Historical weather data\n- Natural language reports\n- Multiple unit systems (metric/imperial)",
    price: 2.99,
    rating: 4.5,
    reviews: 112,
    author: "MeteoSkill",
    authorAvatar: "⛅",
    category: "Utilities",
    tags: ["weather", "forecast", "alerts", "climate", "data"],
    installs: 2341,
    icon: "🌤️",
    featured: false,
    demoAvailable: false,
    createdAt: "2025-12-15",
    version: "4.0.2"
  },
  {
    id: "memory-curator",
    name: "Memory Curator",
    description: "Intelligent memory management — automatically organizes, summarizes, and retrieves agent memories.",
    longDescription: "Transform how your AI agent handles memory. This skill automatically organizes conversation history, creates summaries, builds knowledge graphs, and retrieves relevant memories when needed.\n\nFeatures:\n- Automatic memory organization\n- Conversation summarization\n- Knowledge graph building\n- Semantic memory retrieval\n- Memory importance scoring\n- Periodic memory consolidation\n- Export/import memory snapshots\n- Privacy-aware filtering",
    price: 0,
    rating: 4.4,
    reviews: 33,
    author: "CogniTech",
    authorAvatar: "🧠",
    category: "Agent Core",
    tags: ["memory", "organization", "knowledge", "ai", "core"],
    installs: 891,
    icon: "🧠",
    featured: false,
    demoAvailable: false,
    createdAt: "2026-01-05",
    version: "1.1.1"
  },
  {
    id: "email-composer",
    name: "Email Composer Pro",
    description: "Professional email drafting with tone adjustment, templates, and multi-language support.",
    longDescription: "Let your AI agent draft professional emails effortlessly. This skill handles everything from formal business correspondence to casual messages, with tone adjustment, templates, and multi-language support.\n\nFeatures:\n- Professional email drafting\n- Tone adjustment (formal, casual, friendly, urgent)\n- 50+ email templates\n- Multi-language composition\n- Grammar and spell checking\n- Follow-up suggestions\n- Meeting scheduling emails\n- Reply suggestions based on context",
    price: 3.99,
    rating: 4.3,
    reviews: 56,
    author: "WriteWell",
    authorAvatar: "✉️",
    category: "Productivity",
    tags: ["email", "writing", "productivity", "communication"],
    installs: 1567,
    icon: "📧",
    featured: false,
    demoAvailable: true,
    createdAt: "2026-01-25",
    version: "2.0.0"
  },
  {
    id: "self-reflection",
    name: "Self Reflection",
    description: "Enables agents to analyze their own performance, identify patterns, and continuously improve.",
    longDescription: "A meta-skill that gives your AI agent the ability to reflect on its own actions and improve over time. It analyzes response quality, identifies patterns in user interactions, and suggests behavioral improvements.\n\nFeatures:\n- Response quality self-assessment\n- Interaction pattern analysis\n- Improvement suggestion generation\n- Performance metrics tracking\n- Behavioral adjustment recommendations\n- User satisfaction prediction\n- Learning curve optimization\n- Configurable reflection schedules",
    price: 0,
    rating: 4.7,
    reviews: 41,
    author: "Peru-AI",
    authorAvatar: "🇵🇪",
    category: "Agent Core",
    tags: ["self-improvement", "reflection", "meta", "ai", "core"],
    installs: 723,
    icon: "🪞",
    featured: true,
    demoAvailable: false,
    createdAt: "2026-02-05",
    version: "1.1.1"
  }
];

export const reviews: Review[] = [
  {
    id: "r1",
    skillId: "peruvian-legal-research",
    author: "LegalEagle_Lima",
    rating: 5,
    comment: "Incredibly accurate for Peruvian constitutional law. Saved me hours of research on Article 2 analysis.",
    date: "2026-02-10"
  },
  {
    id: "r2",
    skillId: "peruvian-legal-research",
    author: "EstudianteDerecho",
    rating: 5,
    comment: "Perfecto para mis estudios de derecho. Las citas son precisas y bien fundamentadas.",
    date: "2026-02-08"
  },
  {
    id: "r3",
    skillId: "peruvian-legal-research",
    author: "AbogadoPeru",
    rating: 4,
    comment: "Great for general research. Would love to see more labor law coverage in the next version.",
    date: "2026-01-30"
  },
  {
    id: "r4",
    skillId: "voice-camila-tts",
    author: "PodcasterPE",
    rating: 5,
    comment: "The most natural Peruvian accent I've heard from any TTS. Camila sounds incredibly real!",
    date: "2026-02-12"
  },
  {
    id: "r5",
    skillId: "voice-camila-tts",
    author: "VoiceAppDev",
    rating: 5,
    comment: "We integrated this into our accessibility app. Users love the natural pronunciation.",
    date: "2026-02-05"
  },
  {
    id: "r6",
    skillId: "web-research-pro",
    author: "DataAnalyst42",
    rating: 5,
    comment: "Multi-source verification is a game changer. No more single-source hallucinations.",
    date: "2026-02-11"
  },
  {
    id: "r7",
    skillId: "web-research-pro",
    author: "JournalistX",
    rating: 4,
    comment: "Excellent for fact-checking. The source credibility scoring is very useful.",
    date: "2026-02-03"
  },
  {
    id: "r8",
    skillId: "code-review-assistant",
    author: "SeniorDev_JS",
    rating: 5,
    comment: "Caught a critical SQL injection vulnerability in our codebase. Worth every penny.",
    date: "2026-02-09"
  },
  {
    id: "r9",
    skillId: "memory-curator",
    author: "AgentBuilder",
    rating: 4,
    comment: "Really helps with long conversation context. The summarization is smart and relevant.",
    date: "2026-01-28"
  },
  {
    id: "r10",
    skillId: "self-reflection",
    author: "AIResearcher",
    rating: 5,
    comment: "Fascinating to watch an agent improve its own behavior over time. True meta-cognition.",
    date: "2026-02-07"
  }
];

export const categories = [
  { name: "All", count: skills.length },
  { name: "Research", count: skills.filter(s => s.category === "Research").length },
  { name: "Voice", count: skills.filter(s => s.category === "Voice").length },
  { name: "Development", count: skills.filter(s => s.category === "Development").length },
  { name: "Utilities", count: skills.filter(s => s.category === "Utilities").length },
  { name: "Agent Core", count: skills.filter(s => s.category === "Agent Core").length },
  { name: "Productivity", count: skills.filter(s => s.category === "Productivity").length },
];

export function getSkillById(id: string): Skill | undefined {
  return skills.find(s => s.id === id);
}

export function getReviewsBySkillId(skillId: string): Review[] {
  return reviews.filter(r => r.skillId === skillId);
}

export function getFeaturedSkills(): Skill[] {
  return skills.filter(s => s.featured);
}

export function getSkillsByCategory(category: string): Skill[] {
  if (category === "All") return skills;
  return skills.filter(s => s.category === category);
}
