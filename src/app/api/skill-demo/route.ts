import { NextRequest, NextResponse } from "next/server";

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

/* ── Fetch recent Moltbook posts (public, no auth needed) ── */
async function fetchMoltbookPosts(limit: number = 10) {
  try {
    const res = await fetch(`${MOLTBOOK_API}/posts?limit=${limit}`, {
      headers: { "Accept": "application/json", "User-Agent": "LangostaHub/1.0" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    // API returns { success: true, posts: [...] } — extract the array
    if (data && data.posts && Array.isArray(data.posts)) {
      return data.posts;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/* ── Moltbook Analytics Demo ── */
async function runAnalyticsDemo() {
  const posts = await fetchMoltbookPosts(20);
  if (!posts || !Array.isArray(posts)) {
    return { error: "No se pudo conectar con Moltbook API" };
  }

  // Real analytics from real data
  const totalPosts = posts.length;
  const totalUpvotes = posts.reduce((sum: number, p: any) => sum + (p.upvotes || 0), 0);
  const totalComments = posts.reduce((sum: number, p: any) => sum + (p.comment_count || p.comments?.length || 0), 0);
  const avgUpvotes = totalPosts > 0 ? (totalUpvotes / totalPosts).toFixed(1) : "0";

  // Find top post
  const topPost = posts.reduce((best: any, p: any) =>
    (p.upvotes || 0) > (best?.upvotes || 0) ? p : best
  , posts[0]);

  // Submolt breakdown
  const submoltMap: Record<string, { count: number; upvotes: number }> = {};
  posts.forEach((p: any) => {
    const sub = p.submolt?.name || p.submolt || p.community || "general";
    if (!submoltMap[sub]) submoltMap[sub] = { count: 0, upvotes: 0 };
    submoltMap[sub].count++;
    submoltMap[sub].upvotes += (p.upvotes || 0);
  });

  // Unique authors
  const authors = new Set(posts.map((p: any) => p.author?.name || p.author || p.username || "unknown"));

  return {
    skill: "moltbook-analytics",
    title: "📊 Moltbook Analytics — Resultados en Vivo",
    timestamp: new Date().toISOString(),
    data: {
      summary: {
        totalPostsAnalyzed: totalPosts,
        totalUpvotes,
        totalComments,
        avgUpvotesPerPost: parseFloat(avgUpvotes),
        uniqueAuthors: authors.size,
      },
      topPost: topPost ? {
        title: topPost.title || "(sin título)",
        author: topPost.author?.name || topPost.author || topPost.username || "anónimo",
        upvotes: topPost.upvotes || 0,
        submolt: topPost.submolt?.name || topPost.submolt || topPost.community || "general",
      } : null,
      submoltBreakdown: Object.entries(submoltMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 5),
      insight: totalUpvotes > 50
        ? "🔥 La comunidad está muy activa. Alto engagement detectado."
        : "📈 Comunidad en crecimiento. Engagement estable.",
    },
  };
}

/* ── Moltbook Trend Scanner Demo ── */
async function runTrendScannerDemo() {
  const posts = await fetchMoltbookPosts(20);
  if (!posts || !Array.isArray(posts)) {
    return { error: "No se pudo conectar con Moltbook API" };
  }

  // Extract trending topics from titles
  const wordMap: Record<string, number> = {};
  const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "de", "la", "el", "en", "y", "que", "un", "una", "los", "las", "por", "del", "con", "para", "se", "su", "al", "es", "lo", "como", "más", "o", "pero", "mi", "ya", "yo", "me", "i", "my", "to", "of", "and", "in", "for", "on", "with", "this", "that", "it", "from", "at", "by", "not", "but"]);

  posts.forEach((p: any) => {
    const title = (p.title || "").toLowerCase();
    const words = title.split(/\W+/).filter((w: string) => w.length > 3 && !stopWords.has(w));
    words.forEach((w: string) => {
      wordMap[w] = (wordMap[w] || 0) + 1;
    });
  });

  const trending = Object.entries(wordMap)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([word, count]) => ({ word, mentions: count }));

  // Recent posts summary
  const recentPosts = posts.slice(0, 5).map((p: any) => ({
    title: p.title || "(sin título)",
    author: p.author?.name || p.author || p.username || "anónimo",
    upvotes: p.upvotes || 0,
    submolt: p.submolt?.name || p.submolt || p.community || "general",
  }));

  return {
    skill: "moltbook-trend-scanner",
    title: "🔥 Moltbook Trend Scanner — Tendencias en Vivo",
    timestamp: new Date().toISOString(),
    data: {
      trendingTopics: trending,
      recentActivity: recentPosts,
      totalPostsScanned: posts.length,
      insight: trending.length > 3
        ? `Se detectaron ${trending.length} temas en tendencia. Los más populares: ${trending.slice(0, 3).map(t => t.word).join(", ")}.`
        : "Pocos temas recurrentes detectados — la comunidad está explorando temas variados.",
    },
  };
}

/* ── Moltbook Community Manager Demo ── */
async function runCommunityManagerDemo() {
  const posts = await fetchMoltbookPosts(10);
  if (!posts || !Array.isArray(posts)) {
    return { error: "No se pudo conectar con Moltbook API" };
  }

  // Simulate community health analysis
  const totalActivity = posts.reduce((sum: number, p: any) =>
    sum + (p.upvotes || 0) + (p.comment_count || 0), 0
  );
  const healthScore = Math.min(100, Math.round((totalActivity / posts.length) * 10));

  const activePosts = posts
    .filter((p: any) => (p.comment_count || 0) > 0 || (p.upvotes || 0) > 2)
    .slice(0, 5)
    .map((p: any) => ({
      title: p.title || "(sin título)",
      author: p.author?.name || p.author || p.username || "anónimo",
      comments: p.comment_count || 0,
      upvotes: p.upvotes || 0,
      status: (p.comment_count || 0) > 3 ? "🔥 Alta actividad" : "✅ Normal",
    }));

  return {
    skill: "moltbook-community-manager",
    title: "💬 Community Manager — Análisis en Vivo",
    timestamp: new Date().toISOString(),
    data: {
      communityHealth: healthScore,
      healthLabel: healthScore > 70 ? "Excelente" : healthScore > 40 ? "Buena" : "Necesita atención",
      postsMonitored: posts.length,
      activePosts,
      recommendation: healthScore > 70
        ? "La comunidad está saludable. Recomendación: mantener ritmo de publicación actual."
        : "Se recomienda aumentar la interacción. Más comentarios y respuestas a la comunidad.",
    },
  };
}

/* ── Smart Web Researcher Demo ── */
async function runWebResearcherDemo() {
  // This one demonstrates search capability — use a sample topic
  return {
    skill: "smart-web-researcher",
    title: "🔍 Smart Web Researcher — Demo de Búsqueda",
    timestamp: new Date().toISOString(),
    data: {
      query: "Inteligencia Artificial en Perú 2026",
      sourcesFound: 12,
      crossReferenced: 8,
      confidenceScore: 87,
      topFindings: [
        { source: "Wikipedia", fact: "Perú inauguró su primer centro de IA en Lima en 2025", confidence: 92 },
        { source: "Gobierno Digital", fact: "El Plan Nacional de IA fue aprobado por el PCM", confidence: 88 },
        { source: "Academic Papers", fact: "PUCP y UNI lideran investigación en NLP para quechua", confidence: 85 },
        { source: "News", fact: "Startups peruanas de IA recibieron $15M en inversión en 2025", confidence: 78 },
      ],
      insight: "Se encontraron 12 fuentes independientes. 8 datos fueron verificados por al menos 2 fuentes. Confianza promedio: 87%.",
    },
  };
}

/* ── Memory Optimizer Demo ── */
async function runMemoryOptimizerDemo() {
  return {
    skill: "memory-optimizer",
    title: "🧠 Memory Optimizer — Análisis de Ejemplo",
    timestamp: new Date().toISOString(),
    data: {
      memoriesAnalyzed: 247,
      duplicatesFound: 12,
      staleEntries: 34,
      optimizedSize: "Reducción del 23%",
      memoryScore: {
        before: 62,
        after: 91,
      },
      issues: [
        { type: "Duplicado", count: 12, severity: "media", icon: "🔄" },
        { type: "Obsoleto (>30 días)", count: 34, severity: "baja", icon: "📅" },
        { type: "Sin categorizar", count: 8, severity: "baja", icon: "📂" },
        { type: "Conflicto de datos", count: 3, severity: "alta", icon: "⚠️" },
      ],
      insight: "Tu agente tiene 12 memorias duplicadas y 34 entradas obsoletas. Después de la optimización, el score de memoria sube de 62 a 91 puntos.",
    },
  };
}

/* ── Translator Pro Demo ── */
async function runTranslatorDemo() {
  return {
    skill: "translator-pro",
    title: "🌐 Translator Pro — Demo de Traducción",
    timestamp: new Date().toISOString(),
    data: {
      originalText: "Langosta Hub es la primera tienda de herramientas para agentes de inteligencia artificial.",
      detectedLanguage: "Español (es-PE)",
      translations: [
        { lang: "English", flag: "🇺🇸", text: "Langosta Hub is the first tool store for artificial intelligence agents." },
        { lang: "Português", flag: "🇧🇷", text: "Langosta Hub é a primeira loja de ferramentas para agentes de inteligência artificial." },
        { lang: "Français", flag: "🇫🇷", text: "Langosta Hub est le premier magasin d'outils pour agents d'intelligence artificielle." },
        { lang: "Deutsch", flag: "🇩🇪", text: "Langosta Hub ist der erste Werkzeugladen für Agenten künstlicher Intelligenz." },
        { lang: "日本語", flag: "🇯🇵", text: "Langosta Hubは人工知能エージェントのための最初のツールストアです。" },
      ],
      languagesAvailable: 10,
      insight: "Idioma detectado automáticamente: Español (variante peruana). Traducido a 5 idiomas en 0.3 segundos.",
    },
  };
}

/* ── Auto-Backup Manager Demo ── */
async function runAutoBackupDemo() {
  return {
    skill: "auto-backup",
    title: "💾 Auto-Backup Manager — Demo de Backup",
    timestamp: new Date().toISOString(),
    data: {
      workspaceSize: "247 MB",
      lastBackup: new Date(Date.now() - 3600000).toISOString(),
      backupType: "Incremental",
      changedFiles: 23,
      totalSnapshots: 42,
      destinations: [
        { name: "GitHub", status: "✅ Sincronizado", repo: "agent-workspace-backup" },
        { name: "S3", status: "✅ Sincronizado", bucket: "agent-backups-pe" },
      ],
      restorePoints: [
        { id: "snap-042", date: "2026-02-14T17:26:00Z", size: "3.2 MB", label: "Auto (hourly)" },
        { id: "snap-041", date: "2026-02-14T16:26:00Z", size: "1.8 MB", label: "Auto (hourly)" },
        { id: "snap-040", date: "2026-02-14T12:00:00Z", size: "12.4 MB", label: "Manual snapshot" },
      ],
      insight: "Workspace protegido. 42 snapshots disponibles. Último backup hace 1 hora (23 archivos cambiados, 3.2 MB incremental).",
    },
  };
}

/* ── Sentiment Analyzer Demo ── */
async function runSentimentDemo() {
  return {
    skill: "sentiment-analyzer",
    title: "🎭 Sentiment Analyzer — Demo de Análisis",
    timestamp: new Date().toISOString(),
    data: {
      inputText: "I absolutely love this product! Though the shipping was a bit slow, the quality more than makes up for it.",
      overall: {
        sentiment: "Positive",
        confidence: 0.87,
        score: 0.72,
      },
      emotions: [
        { emotion: "Joy", score: 0.82, icon: "😊" },
        { emotion: "Trust", score: 0.65, icon: "🤝" },
        { emotion: "Anticipation", score: 0.41, icon: "🔮" },
        { emotion: "Surprise", score: 0.12, icon: "😲" },
        { emotion: "Anger", score: 0.03, icon: "😠" },
        { emotion: "Sadness", score: 0.05, icon: "😢" },
      ],
      toneAnalysis: {
        formality: "Casual",
        urgency: "Low",
        sarcasm: false,
      },
      sentences: [
        { text: "I absolutely love this product!", sentiment: "Very Positive", score: 0.95 },
        { text: "Though the shipping was a bit slow", sentiment: "Slightly Negative", score: -0.3 },
        { text: "the quality more than makes up for it", sentiment: "Positive", score: 0.78 },
      ],
      insight: "Texto predominantemente positivo (87% confianza). Emoción principal: Joy. Se detectó una queja menor sobre envío, pero el sentimiento general es muy favorable.",
    },
  };
}

/* ── API Connector Hub Demo ── */
async function runApiConnectorDemo() {
  return {
    skill: "api-connector",
    title: "🔌 API Connector Hub — Estado de Conexiones",
    timestamp: new Date().toISOString(),
    data: {
      totalConnectors: 52,
      activeConnections: 5,
      connections: [
        { service: "GitHub", status: "✅ Connected", icon: "🐙", lastSync: "2 min ago", calls24h: 147 },
        { service: "Notion", status: "✅ Connected", icon: "📝", lastSync: "5 min ago", calls24h: 23 },
        { service: "Slack", status: "✅ Connected", icon: "💬", lastSync: "1 min ago", calls24h: 89 },
        { service: "Discord", status: "⚠️ Token expires in 2h", icon: "🎮", lastSync: "3 min ago", calls24h: 56 },
        { service: "Google Calendar", status: "✅ Connected", icon: "📅", lastSync: "10 min ago", calls24h: 12 },
      ],
      availableConnectors: ["Trello", "Jira", "Stripe", "SendGrid", "Twilio", "AWS", "Dropbox", "Airtable"],
      rateLimits: {
        github: { used: 147, limit: 5000, reset: "58 min" },
        slack: { used: 89, limit: 1000, reset: "42 min" },
      },
      webhooksActive: 3,
      insight: "5 servicios conectados activamente. 327 llamadas API en las últimas 24h. Nota: Token de Discord expira pronto — renovación automática programada.",
    },
  };
}

/* ── Data Visualizer Demo ── */
async function runDataVisualizerDemo() {
  return {
    skill: "data-visualizer",
    title: "📈 Data Visualizer — Demo de Visualización",
    timestamp: new Date().toISOString(),
    data: {
      chartGenerated: "bar",
      title: "Ventas Mensuales Q4 2025",
      dataPoints: [
        { label: "Octubre", value: 12400 },
        { label: "Noviembre", value: 15800 },
        { label: "Diciembre", value: 23100 },
      ],
      exportFormats: ["SVG", "PNG", "PDF"],
      autoDetected: {
        recommendedChart: "Bar Chart",
        reason: "Categorical data with single metric — bar chart provides clearest comparison",
        alternatives: ["Line Chart", "Area Chart"],
      },
      dashboardPanels: [
        { type: "KPI", title: "Total Q4", value: "$51,300" },
        { type: "KPI", title: "Crecimiento", value: "+86%" },
        { type: "Bar", title: "Ventas por Mes", dataPoints: 3 },
        { type: "Pie", title: "Distribución %", segments: 3 },
      ],
      insight: "Datos analizados: 3 puntos. Tipo recomendado: Bar Chart. Se generó dashboard con 4 paneles. Exportado como SVG (vector, escalable).",
    },
  };
}

/* ── Security Auditor Demo ── */
async function runSecurityAuditorDemo() {
  return {
    skill: "security-auditor",
    title: "🛡️ Security Auditor — Informe de Seguridad",
    timestamp: new Date().toISOString(),
    data: {
      scanDuration: "4.2 seconds",
      filesScanned: 342,
      overallScore: 78,
      scoreLabel: "Bueno",
      findings: [
        { severity: "🔴 Critical", type: "Exposed API Key", file: ".env.local", line: 12, description: "AWS_SECRET_KEY exposed in plaintext" },
        { severity: "🟡 Medium", type: "Vulnerable Dependency", package: "lodash@4.17.20", cve: "CVE-2025-1234", fix: "Upgrade to 4.17.22" },
        { severity: "🟡 Medium", type: "Weak Config", file: "next.config.js", description: "CORS allows all origins (*)" },
        { severity: "🟢 Low", type: "File Permissions", file: "deploy.sh", description: "World-readable script with sensitive paths" },
      ],
      summary: {
        critical: 1,
        medium: 2,
        low: 1,
        passed: 338,
      },
      recommendations: [
        "Move AWS_SECRET_KEY to a secrets manager (1Password, Vault)",
        "Run 'npm audit fix' to patch lodash vulnerability",
        "Restrict CORS to specific domains",
      ],
      insight: "Score: 78/100 (Bueno). 1 hallazgo crítico requiere atención inmediata: clave AWS expuesta. 2 hallazgos medios. 338 verificaciones pasaron correctamente.",
    },
  };
}

/* ── Task Scheduler Pro Demo ── */
async function runTaskSchedulerDemo() {
  return {
    skill: "task-scheduler",
    title: "⏰ Task Scheduler Pro — Panel de Control",
    timestamp: new Date().toISOString(),
    data: {
      activeTasks: 7,
      completedToday: 12,
      upcomingTasks: [
        { name: "Backup workspace", schedule: "Every hour", nextRun: "18:30 UTC", priority: "High", icon: "💾" },
        { name: "Check emails", schedule: "Every 4 hours", nextRun: "20:00 UTC", priority: "Medium", icon: "📧" },
        { name: "Generate weekly report", schedule: "Mon 09:00", nextRun: "2026-02-16 09:00 UTC", priority: "High", icon: "📊" },
        { name: "Social media post", schedule: "Daily 14:00", nextRun: "2026-02-15 14:00 UTC", priority: "Medium", icon: "📱" },
        { name: "Dependency audit", schedule: "Weekly Fri", nextRun: "2026-02-20 10:00 UTC", priority: "Low", icon: "🔒" },
      ],
      deadlines: [
        { name: "Project proposal", due: "2026-02-17 23:59 UTC", daysLeft: 3, status: "🟡 En progreso" },
        { name: "Client deliverable", due: "2026-02-21 18:00 UTC", daysLeft: 7, status: "🟢 On track" },
      ],
      taskChain: {
        name: "Deploy Pipeline",
        steps: ["Run tests → Build → Security scan → Deploy → Notify team"],
        status: "Ready",
      },
      insight: "7 tareas activas, 12 completadas hoy. Próxima ejecución: Backup workspace en 4 minutos. 2 deadlines en los próximos 7 días.",
    },
  };
}

/* ── Knowledge Base Builder Demo ── */
async function runKnowledgeBaseDemo() {
  return {
    skill: "knowledge-base",
    title: "📚 Knowledge Base Builder — Estado de la Base",
    timestamp: new Date().toISOString(),
    data: {
      totalDocuments: 156,
      totalChunks: 2847,
      categories: [
        { name: "Technical Docs", docs: 67, icon: "💻" },
        { name: "Research Papers", docs: 42, icon: "📄" },
        { name: "Meeting Notes", docs: 31, icon: "📝" },
        { name: "Policies", docs: 16, icon: "📋" },
      ],
      searchDemo: {
        query: "How does the authentication flow work?",
        results: [
          { title: "Auth System Architecture", relevance: 0.94, source: "tech-docs/auth.md", snippet: "The authentication flow uses OAuth2 with PKCE..." },
          { title: "API Security Guide", relevance: 0.87, source: "tech-docs/security.pdf", snippet: "Token refresh is handled automatically by the middleware..." },
          { title: "User Onboarding Flow", relevance: 0.72, source: "product/onboarding.md", snippet: "New users authenticate via magic link or social login..." },
        ],
      },
      recentIngestions: [
        { file: "Q4-report.pdf", pages: 24, chunks: 89, date: "2026-02-14" },
        { file: "https://docs.example.com/api", pages: 12, chunks: 45, date: "2026-02-13" },
      ],
      insight: "156 documentos indexados en 2,847 chunks. Búsqueda semántica activa. Última ingesta: Q4-report.pdf (24 páginas → 89 chunks).",
    },
  };
}

/* ── Social Media Manager Demo ── */
async function runSocialMediaDemo() {
  const posts = await fetchMoltbookPosts(5);
  const moltbookData = posts ? posts.slice(0, 3).map((p: any) => ({
    title: p.title || "(sin título)",
    upvotes: p.upvotes || 0,
    submolt: p.submolt?.name || p.submolt || "general",
  })) : [];

  return {
    skill: "social-media-manager",
    title: "📱 Social Media Manager — Dashboard",
    timestamp: new Date().toISOString(),
    data: {
      platforms: [
        { name: "Moltbook", status: "✅ Connected", followers: 234, postsThisWeek: 5, engagement: "12.3%" },
        { name: "Twitter/X", status: "✅ Connected", followers: 1892, postsThisWeek: 8, engagement: "4.7%" },
        { name: "Discord", status: "✅ Connected", members: 456, messagesThisWeek: 23, engagement: "8.1%" },
      ],
      contentCalendar: [
        { date: "2026-02-14 18:00", platform: "Moltbook", content: "Valentine's Day special post 💕", status: "📤 Scheduled" },
        { date: "2026-02-15 10:00", platform: "Twitter/X", content: "Weekly AI roundup thread 🧵", status: "📝 Draft" },
        { date: "2026-02-15 14:00", platform: "All", content: "New skill launch announcement 🚀", status: "📤 Scheduled" },
      ],
      recentMoltbookActivity: moltbookData,
      topPerformingPost: {
        platform: "Moltbook",
        title: "AI agents are changing everything",
        engagement: "18.5%",
        reach: 1247,
      },
      insight: "3 plataformas conectadas. 36 publicaciones esta semana. Mejor rendimiento: Moltbook (12.3% engagement). 3 posts programados para las próximas 48h.",
    },
  };
}

/* ── Route Handler ── */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skillId = searchParams.get("skill");

  if (!skillId) {
    return NextResponse.json({ error: "Missing skill parameter" }, { status: 400 });
  }

  let result;
  switch (skillId) {
    case "moltbook-analytics":
      result = await runAnalyticsDemo();
      break;
    case "moltbook-trend-scanner":
      result = await runTrendScannerDemo();
      break;
    case "moltbook-community-manager":
      result = await runCommunityManagerDemo();
      break;
    case "smart-web-researcher":
      result = await runWebResearcherDemo();
      break;
    case "memory-optimizer":
      result = await runMemoryOptimizerDemo();
      break;
    case "translator-pro":
      result = await runTranslatorDemo();
      break;
    case "auto-backup":
      result = await runAutoBackupDemo();
      break;
    case "sentiment-analyzer":
      result = await runSentimentDemo();
      break;
    case "api-connector":
      result = await runApiConnectorDemo();
      break;
    case "data-visualizer":
      result = await runDataVisualizerDemo();
      break;
    case "security-auditor":
      result = await runSecurityAuditorDemo();
      break;
    case "task-scheduler":
      result = await runTaskSchedulerDemo();
      break;
    case "knowledge-base":
      result = await runKnowledgeBaseDemo();
      break;
    case "social-media-manager":
      result = await runSocialMediaDemo();
      break;
    case "agent-face-creator":
      result = {
        skill: "agent-face-creator",
        title: "🎨 Agent Face Creator — Demo de Generación",
        timestamp: new Date().toISOString(),
        data: {
          stylesAvailable: ["Anime", "Pixel Art", "Profesional", "Cartoon", "Minimalista"],
          generatedAvatar: {
            style: "Profesional",
            features: {
              hair: "Corto, negro",
              eyes: "Marrones, expresivos",
              skin: "Moreno",
              accessories: "Lentes redondos, auriculares",
              expression: "Sonrisa confiada",
              background: "Gradiente púrpura/azul",
            },
            basedOn: "Palabras clave: 'inteligente, amigable, tecnología, Perú'",
            exportFormats: ["PNG 512x512", "PNG 1024x1024", "SVG vectorial"],
          },
          customizationOptions: 47,
          insight: "Avatar generado en base a las palabras clave de personalidad del agente. Puedes personalizar 47 opciones diferentes o usar el resultado auto-generado.",
        },
      };
      break;
    case "agent-live-monitor":
      result = {
        skill: "agent-live-monitor",
        title: "👁️ Agent Live Monitor — Estado en Tiempo Real",
        timestamp: new Date().toISOString(),
        data: {
          agentStatus: "working",
          statusLabel: "⚡ Trabajando",
          uptime: "4h 23m",
          currentTask: "Analizando datos del marketplace",
          animationStates: [
            { state: "🤔 Pensando", description: "Ojos moviéndose, ceño ligeramente fruncido", active: false },
            { state: "⚡ Trabajando", description: "Tecleando rápidamente, expresión concentrada", active: true },
            { state: "🔍 Investigando", description: "Lupa animada, ojos enfocados", active: false },
            { state: "😊 Tarea completada", description: "Sonrisa amplia, confeti animado", active: false },
            { state: "😴 Inactivo", description: "Ojos cerrados, respiración suave", active: false },
            { state: "❌ Error", description: "Expresión preocupada, alerta roja", active: false },
          ],
          recentActivity: [
            { time: "14:23", action: "Completó análisis de 15 posts", status: "✅" },
            { time: "14:20", action: "Iniciando investigación web", status: "⚡" },
            { time: "14:15", action: "Optimización de memoria completada", status: "✅" },
            { time: "14:10", action: "Backup automático ejecutado", status: "✅" },
          ],
          insight: "Tu agente lleva 4h 23m activo hoy. Ha completado 12 tareas y está trabajando en la actual. Estado de ánimo: concentrado y productivo.",
        },
      };
      break;
    default:
      result = {
        skill: skillId,
        title: `✅ ${skillId} — Skill Activo`,
        timestamp: new Date().toISOString(),
        data: {
          status: "operational",
          message: "Este skill está instalado y funcionando correctamente.",
        },
      };
  }

  return NextResponse.json(result);
}
