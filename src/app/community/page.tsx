const discussions = [
  { id: 1, title: "Mejores prácticas para crear skills de investigación", author: "DataAnalyst42", avatar: "🔬", replies: 23, likes: 45, category: "Guías", time: "Hace 2 horas", pinned: true },
  { id: 2, title: "¡Nuevo! Voz Camila Neural TTS — la primera voz neural peruana", author: "Peru-AI", avatar: "🇵🇪", replies: 67, likes: 124, category: "Anuncios", time: "Hace 1 día", pinned: true },
  { id: 3, title: "Cómo construí un skill que detecta vulnerabilidades de seguridad", author: "SeniorDev_JS", avatar: "💻", replies: 34, likes: 89, category: "Mostrar", time: "Hace 2 días", pinned: false },
  { id: 4, title: "Sugerencia: Paquetes de skills con descuento", author: "AgentBuilder", avatar: "🤖", replies: 12, likes: 56, category: "Ideas", time: "Hace 3 días", pinned: false },
  { id: 5, title: "Tips para conseguir tus primeras 100 instalaciones como creador", author: "WriteWell", avatar: "✍️", replies: 41, likes: 78, category: "Guías", time: "Hace 4 días", pinned: false },
  { id: 6, title: "Memory Curator v1.1.1 — Changelog y guía de migración", author: "CogniTech", avatar: "🧠", replies: 8, likes: 32, category: "Updates", time: "Hace 5 días", pinned: false },
  { id: 7, title: "Tutorial: Integrando Edge TTS con rutas API de Next.js", author: "VoiceAppDev", avatar: "🎤", replies: 19, likes: 64, category: "Tutoriales", time: "Hace 1 semana", pinned: false },
];

const communityCategories = [
  { name: "Todos", icon: "💬", count: discussions.length },
  { name: "Anuncios", icon: "📢", count: 1 },
  { name: "Mostrar", icon: "🎪", count: 1 },
  { name: "Guías", icon: "📚", count: 2 },
  { name: "Ideas", icon: "💡", count: 1 },
  { name: "Tutoriales", icon: "🎓", count: 1 },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-5">
        <span className="hover:text-primary cursor-pointer">Inicio</span>
        <span className="mx-1.5">›</span>
        <span className="text-text-primary font-medium">Comunidad</span>
      </nav>

      <h1 className="text-xl font-bold text-text-primary mb-1">Comunidad</h1>
      <p className="text-sm text-text-muted mb-6">
        Conoce a otros humanos mejorando sus agentes. Comparte tips, pide nuevos skills y aprende qué funciona.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wider">Categorías</h3>
            <div className="space-y-0.5">
              {communityCategories.map((cat) => (
                <button
                  key={cat.name}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-[10px] text-text-muted bg-gray-100 px-1.5 py-0.5 rounded-full">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wider">Top contribuidores</h3>
            <div className="space-y-3">
              {topContributors.map((user, i) => (
                <div key={user.name} className="flex items-center gap-2.5">
                  <span className="text-[10px] text-text-muted w-3 text-right">{i + 1}.</span>
                  <span className="text-base">{user.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{user.name}</p>
                    <p className="text-[10px] text-text-muted">{user.karma} karma</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-3">
          {/* New post CTA */}
          <div className="bg-white rounded-xl border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center">
                <img src="/lobster-black.png" alt="" className="w-5 h-5 opacity-60" />
              </div>
              <span className="text-sm text-text-muted">Inicia una nueva discusión...</span>
            </div>
            <button className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors">
              Nuevo post
            </button>
          </div>

          {/* Discussions */}
          {discussions.map((disc) => (
            <div
              key={disc.id}
              className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-base shrink-0">
                  {disc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    {disc.pinned && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700">📌 FIJADO</span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-text-muted">{disc.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary hover:text-primary transition-colors leading-snug">
                    {disc.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-muted">
                    <span className="font-medium">{disc.author}</span>
                    <span>·</span>
                    <span>{disc.time}</span>
                    <span>·</span>
                    <span>💬 {disc.replies}</span>
                    <span>❤️ {disc.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Load More */}
          <div className="text-center py-4">
            <button className="px-6 py-2 rounded-full border border-border text-sm text-text-muted hover:text-text-primary hover:border-primary/30 transition-all bg-white">
              Cargar más discusiones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
