const discussions = [
  {
    id: 1,
    title: "Best practices for building research skills",
    author: "DataAnalyst42",
    avatar: "🔬",
    replies: 23,
    likes: 45,
    category: "Guides",
    time: "2 hours ago",
    pinned: true,
  },
  {
    id: 2,
    title: "Introducing Voice: Camila Neural TTS — Peru's first neural voice skill!",
    author: "Peru-AI",
    avatar: "🇵🇪",
    replies: 67,
    likes: 124,
    category: "Announcements",
    time: "1 day ago",
    pinned: true,
  },
  {
    id: 3,
    title: "How I built a code review skill that catches security vulnerabilities",
    author: "SeniorDev_JS",
    avatar: "💻",
    replies: 34,
    likes: 89,
    category: "Show & Tell",
    time: "2 days ago",
    pinned: false,
  },
  {
    id: 4,
    title: "Feature request: Skill bundles / packages for discounted pricing",
    author: "AgentBuilder",
    avatar: "🤖",
    replies: 12,
    likes: 56,
    category: "Feature Requests",
    time: "3 days ago",
    pinned: false,
  },
  {
    id: 5,
    title: "Tips for getting your first 100 installs as a skill creator",
    author: "WriteWell",
    avatar: "✍️",
    replies: 41,
    likes: 78,
    category: "Guides",
    time: "4 days ago",
    pinned: false,
  },
  {
    id: 6,
    title: "Memory Curator v1.1.1 — Changelog and migration guide",
    author: "CogniTech",
    avatar: "🧠",
    replies: 8,
    likes: 32,
    category: "Updates",
    time: "5 days ago",
    pinned: false,
  },
  {
    id: 7,
    title: "Integrating Edge TTS with Next.js API routes — a tutorial",
    author: "VoiceAppDev",
    avatar: "🎤",
    replies: 19,
    likes: 64,
    category: "Tutorials",
    time: "1 week ago",
    pinned: false,
  },
];

const communityCategories = [
  { name: "All", icon: "💬", count: discussions.length },
  { name: "Announcements", icon: "📢", count: 1 },
  { name: "Show & Tell", icon: "🎪", count: 1 },
  { name: "Guides", icon: "📚", count: 2 },
  { name: "Feature Requests", icon: "💡", count: 1 },
  { name: "Tutorials", icon: "🎓", count: 1 },
  { name: "Updates", icon: "🔄", count: 1 },
];

const topContributors = [
  { name: "Peru-AI", avatar: "🇵🇪", skills: 3, karma: 890 },
  { name: "DataAnalyst42", avatar: "🔬", skills: 0, karma: 567 },
  { name: "SeniorDev_JS", avatar: "💻", skills: 1, karma: 445 },
  { name: "VoiceAppDev", avatar: "🎤", skills: 0, karma: 389 },
  { name: "WriteWell", avatar: "✍️", skills: 1, karma: 334 },
];

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Community</h1>
        <p className="text-text-secondary">
          Connect with skill creators, share ideas, and learn from each other
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Categories</h3>
            <div className="space-y-1">
              {communityCategories.map((cat) => (
                <button
                  key={cat.name}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-xs text-text-muted">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Top Contributors</h3>
            <div className="space-y-3">
              {topContributors.map((user, i) => (
                <div key={user.name} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-4">{i + 1}.</span>
                  <span className="text-lg">{user.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.karma} karma</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* New Discussion CTA */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                🇵🇪
              </div>
              <span className="text-sm text-text-muted">Start a new discussion...</span>
            </div>
            <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors">
              New Post
            </button>
          </div>

          {/* Discussions */}
          {discussions.map((disc) => (
            <div
              key={disc.id}
              className="glass-card p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">
                  {disc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {disc.pinned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/10 text-accent">
                        📌 PINNED
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-border/50 text-text-muted">
                      {disc.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1 hover:text-primary transition-colors">
                    {disc.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>{disc.author}</span>
                    <span>·</span>
                    <span>{disc.time}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      💬 {disc.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      ❤️ {disc.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Load More */}
          <div className="text-center py-4">
            <button className="px-6 py-2 rounded-lg border border-border text-sm text-text-muted hover:text-text-primary hover:border-border-hover transition-all">
              Load More Discussions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
