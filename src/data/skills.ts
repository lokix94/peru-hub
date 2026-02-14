export interface Skill {
  id: string;
  name: string;
  tagline: string;
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
  sponsored?: boolean;
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
    tagline: "Turn your agent into a Peruvian law expert",
    description: "Your agent will research Peruvian law, analyze the constitution, draft legal documents, and cite specific articles — like having a paralegal on call 24/7.",
    longDescription: "Give your AI agent deep expertise in Peruvian law. After installing this skill, your agent can analyze constitutional articles, research case law, draft legal documents, and provide precise citations — all in seconds.\n\nWhat your agent gains:\n• Instant analysis of Peru's 1993 Constitution\n• Civil and criminal code research\n• Legal document drafting with proper formatting\n• Accurate citations with article references\n• Works in both Spanish and English\n\nPerfect for: Legal professionals, law students, businesses operating in Peru, and anyone who needs quick, reliable legal information without expensive consultations.",
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
    name: "Voice: Camila Neural",
    tagline: "Give your agent a natural Peruvian voice",
    description: "Your agent speaks out loud in beautiful, natural Peruvian Spanish. Camila sounds so real, people won't believe it's AI — perfect for accessibility, podcasts, or just vibes.",
    longDescription: "Stop reading walls of text. With this skill, your AI agent can speak to you in a natural, warm Peruvian Spanish voice powered by Microsoft's neural engine.\n\nWhat your agent gains:\n• Natural Peruvian Spanish pronunciation\n• Adjustable speaking speed, pitch, and volume\n• Expressive speech with SSML support\n• Automatic subtitle generation\n• Multiple audio formats (MP3, WAV, OGG)\n• Works with any text — messages, stories, news, anything\n\nPerfect for: Anyone who prefers listening over reading, accessibility needs, content creators, language learners, or people who just want their agent to feel more alive.",
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
    tagline: "Your agent becomes a world-class researcher",
    description: "Your agent searches the web, cross-checks multiple sources, and delivers verified summaries with links — no more guessing, no more hallucinations.",
    longDescription: "Supercharge your agent's ability to find and verify information from across the web. This skill turns your agent into a meticulous researcher that checks multiple sources before giving you answers.\n\nWhat your agent gains:\n• Searches across multiple engines simultaneously\n• Cross-references facts from different sources\n• Extracts and organizes data into clean summaries\n• Scores source credibility so you know what to trust\n• Generates full research reports with links\n• Works for any topic — news, science, business, anything\n\nPerfect for: Professionals who need reliable information, journalists, students, anyone tired of AI making things up.",
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
    version: "3.2.1",
    sponsored: true,
  },
  {
    id: "code-review-assistant",
    name: "Code Review Assistant",
    tagline: "Your agent catches bugs before they ship",
    description: "Your agent reviews code for security holes, performance issues, and bad practices — then explains what's wrong and how to fix it, in plain language.",
    longDescription: "Let your agent be your second pair of eyes on every piece of code. It catches security vulnerabilities, spots performance problems, and suggests improvements — all explained clearly.\n\nWhat your agent gains:\n• Detects security vulnerabilities automatically\n• Finds performance bottlenecks\n• Checks code against best practices\n• Reviews code style and consistency\n• Audits dependencies for known issues\n• Supports 20+ programming languages\n• Analyzes Git diffs and pull requests\n\nPerfect for: Solo developers, small teams without dedicated reviewers, anyone who wants fewer bugs and more secure code.",
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
    version: "1.5.0",
    sponsored: true,
  },
  {
    id: "weather-intelligence",
    name: "Weather Intelligence",
    tagline: "Your agent always knows the weather",
    description: "Your agent checks real-time weather, gives forecasts, sends severe weather alerts, and talks about it naturally — like having a personal meteorologist.",
    longDescription: "Never be caught in the rain again. This skill gives your agent live weather awareness for any location in the world, delivered in natural, easy-to-understand language.\n\nWhat your agent gains:\n• Real-time weather conditions worldwide\n• 7-day detailed forecasts\n• Severe weather alerts and warnings\n• Air quality and UV index tracking\n• Historical weather data comparisons\n• Natural language weather reports\n• Works in metric or imperial units\n\nPerfect for: Anyone who goes outside, travelers, event planners, outdoor enthusiasts, or just people who like to know if they need an umbrella.",
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
    tagline: "Your agent remembers everything important",
    description: "Your agent stops forgetting. It organizes conversations, remembers key details, and brings up the right context at the right time — like a perfect memory.",
    longDescription: "AI agents forget things between conversations. Not anymore. This skill gives your agent a proper memory system that stores, organizes, and retrieves what matters.\n\nWhat your agent gains:\n• Remembers important details across conversations\n• Automatically organizes notes and context\n• Creates summaries of past interactions\n• Retrieves relevant memories when you need them\n• Prioritizes what's important vs. forgettable\n• Periodic memory cleanup to stay efficient\n• Export or import memory snapshots\n• Respects your privacy with smart filtering\n\nPerfect for: Anyone who's frustrated their agent forgets what they talked about yesterday. Power users with complex ongoing projects.",
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
    tagline: "Your agent writes perfect emails for you",
    description: "Tell your agent what you need to say, and it drafts a polished email in seconds — formal, casual, follow-up, you name it. In any language.",
    longDescription: "Stop staring at blank email drafts. Just tell your agent what you want to communicate, and it writes a polished, professional email in seconds — adjusted to the perfect tone.\n\nWhat your agent gains:\n• Drafts professional emails from simple instructions\n• Adjusts tone: formal, casual, friendly, or urgent\n• 50+ templates for common situations\n• Writes in multiple languages\n• Built-in grammar and spell checking\n• Suggests follow-ups based on context\n• Creates meeting invites and scheduling emails\n• Smart reply suggestions for incoming mail\n\nPerfect for: Busy professionals, non-native speakers, anyone who spends too much time on emails, people who dread the \"just following up\" message.",
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
    tagline: "Your agent learns from its own mistakes",
    description: "Your agent analyzes its own performance and gets better over time — it notices patterns, learns what works for you, and continuously improves itself.",
    longDescription: "What if your AI agent could get better at helping you just by reflecting on past interactions? This meta-skill gives your agent self-awareness about its own performance.\n\nWhat your agent gains:\n• Evaluates the quality of its own responses\n• Identifies patterns in what you like and don't like\n• Generates specific ideas for self-improvement\n• Tracks performance metrics over time\n• Predicts when you might be unsatisfied\n• Optimizes its learning curve automatically\n• Configurable reflection schedules\n\nPerfect for: Power users who want their agent to feel increasingly personalized. Anyone who wants an agent that gets noticeably better week after week.",
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
    comment: "My agent went from clueless about Peruvian law to citing specific constitutional articles. Incredible upgrade.",
    date: "2026-02-10"
  },
  {
    id: "r2",
    skillId: "peruvian-legal-research",
    author: "EstudianteDerecho",
    rating: 5,
    comment: "Instalé esto y mi agente ahora me ayuda con todas mis tareas de derecho. Las citas son perfectas.",
    date: "2026-02-08"
  },
  {
    id: "r3",
    skillId: "peruvian-legal-research",
    author: "AbogadoPeru",
    rating: 4,
    comment: "Huge time saver for basic research. Would love to see labor law added in the next update.",
    date: "2026-01-30"
  },
  {
    id: "r4",
    skillId: "voice-camila-tts",
    author: "PodcasterPE",
    rating: 5,
    comment: "My agent can TALK now! The Peruvian accent sounds so natural, my family thought I was on a call with a real person.",
    date: "2026-02-12"
  },
  {
    id: "r5",
    skillId: "voice-camila-tts",
    author: "VoiceAppDev",
    rating: 5,
    comment: "Gave our accessibility app a voice. Users love how natural and warm Camila sounds.",
    date: "2026-02-05"
  },
  {
    id: "r6",
    skillId: "web-research-pro",
    author: "DataAnalyst42",
    rating: 5,
    comment: "Night and day difference. My agent used to make things up — now it checks multiple sources and shows its work.",
    date: "2026-02-11"
  },
  {
    id: "r7",
    skillId: "web-research-pro",
    author: "JournalistX",
    rating: 4,
    comment: "The source credibility scoring alone is worth the price. Essential upgrade for anyone who needs facts.",
    date: "2026-02-03"
  },
  {
    id: "r8",
    skillId: "code-review-assistant",
    author: "SeniorDev_JS",
    rating: 5,
    comment: "This skill found a critical SQL injection in our code that we all missed. Paid for itself instantly.",
    date: "2026-02-09"
  },
  {
    id: "r9",
    skillId: "memory-curator",
    author: "AgentBuilder",
    rating: 4,
    comment: "Finally, my agent remembers what we talked about last week. No more re-explaining everything.",
    date: "2026-01-28"
  },
  {
    id: "r10",
    skillId: "self-reflection",
    author: "AIResearcher",
    rating: 5,
    comment: "After a week with this installed, my agent noticeably improved. It started anticipating what I needed.",
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
