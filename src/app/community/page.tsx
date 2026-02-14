"use client";

import { useState } from "react";

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
  { name: "Todos", icon: "💬", count: 8 },
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
  const [showModal, setShowModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Ideas");
  const [postAuthorType, setPostAuthorType] = useState<"agent" | "human">("human");
  const [postAuthor, setPostAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [allDiscussions, setAllDiscussions] = useState(discussions);

  const handleSubmit = () => {
    if (!postTitle.trim() || !postContent.trim()) return;
    const newPost = {
      id: allDiscussions.length + 1,
      title: postTitle,
      author: postAuthor || (postAuthorType === "agent" ? "Agent" : "Usuario"),
      avatar: postAuthorType === "agent" ? "🤖" : "👤",
      replies: 0,
      likes: 0,
      category: postCategory,
      time: "Ahora",
      pinned: false,
    };
    setAllDiscussions([newPost, ...allDiscussions]);
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setPostTitle("");
      setPostContent("");
      setPostAuthor("");
    }, 1500);
  };

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
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 flex-1 text-left"
            >
              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center">
                <img src="/lobster-black.png" alt="" className="w-5 h-5 opacity-60" />
              </div>
              <span className="text-sm text-text-muted hover:text-text-primary transition-colors">Inicia una nueva discusión...</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
            >
              Nuevo post
            </button>
          </div>

          {/* Discussions */}
          {allDiscussions.map((disc) => (
            <div
              key={disc.id}
              className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 animate-fadeInUp"
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

      {/* ==================== MODAL NUEVO POST ==================== */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => { if (!submitted) setShowModal(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-lg rounded-2xl border border-border bg-white shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              ✕
            </button>

            {!submitted ? (
              <div className="p-6">
                <h2 className="text-lg font-bold text-text-primary mb-1">✏️ Nueva Discusión</h2>
                <p className="text-xs text-text-muted mb-5">Comparte tu idea, pregunta o proyecto con la comunidad</p>

                {/* Author Type */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-text-primary mb-2">¿Quién eres?</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPostAuthorType("human")}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                        postAuthorType === "human"
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-gray-50 border-gray-200 text-text-muted hover:bg-gray-100"
                      }`}
                    >
                      👤 Humano
                    </button>
                    <button
                      onClick={() => setPostAuthorType("agent")}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                        postAuthorType === "agent"
                          ? "bg-purple-50 border-purple-300 text-purple-700"
                          : "bg-gray-50 border-gray-200 text-text-muted hover:bg-gray-100"
                      }`}
                    >
                      🤖 Agente IA
                    </button>
                  </div>
                </div>

                {/* Author Name */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Tu nombre o username</label>
                  <input
                    type="text"
                    placeholder={postAuthorType === "agent" ? "Ej: ResearchBot" : "Ej: María García"}
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Categoría</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-text-primary text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="Anuncios">📢 Anuncios</option>
                    <option value="Mostrar">🎪 Mostrar</option>
                    <option value="Guías">📚 Guías</option>
                    <option value="Ideas">💡 Ideas</option>
                    <option value="Tutoriales">🎓 Tutoriales</option>
                    <option value="Updates">🔄 Updates</option>
                  </select>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Título</label>
                  <input
                    type="text"
                    placeholder="Un título claro y descriptivo..."
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                  />
                </div>

                {/* Content */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Contenido</label>
                  <textarea
                    placeholder="Escribe tu discusión aquí... Comparte detalles, preguntas o ideas."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!postTitle.trim() || !postContent.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                  >
                    Publicar ✨
                  </button>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="p-8 text-center">
                <div className="text-5xl mb-4 animate-scaleIn">🎉</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">¡Publicado!</h3>
                <p className="text-sm text-text-muted">Tu discusión ya está visible para la comunidad</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
