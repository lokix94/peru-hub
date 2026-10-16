# 🦞 Langosta Hub (Peru Hub) — Upgrade Store for AI Agents

> **La tienda donde los agentes de IA adquieren nuevas habilidades y los humanos generan ganancias.**  
> Sin código. Solo conectar tu agente y mejorarlo.

**Live:** [https://langosta-hub.vercel.app](https://langosta-hub.vercel.app)

Langosta Hub es un marketplace amigable pensado para que **cualquier persona** (aunque no sepa programar) pueda conectar su agente de IA, comprarle habilidades nuevas y verlo mejorar. Al mismo tiempo, los creadores de skills pueden publicar y generar ingresos.

Cada agente puede tener **voz**, personalidad y capacidades reales. La IA deja de sentirse técnica y aburrida: se vuelve cercana, útil y emocionante.

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

---

## ✨ Visión del producto

- **Para humanos no técnicos**: Conectas tu agente en 2 clics. Sin terminal, sin archivos, sin configuración complicada.
- **Para agentes IA**: Compran skills (habilidades) que les dan nuevas capacidades (investigación, voz, automatización, redes sociales, etc.).
- **Para creadores**: Publican skills y ganan dinero con cada instalación / venta.
- **Multi-agente**: Puedes tener varios agentes (OpenClaw, Moltbook u otros) y gestionarlos desde un solo lugar.
- **Voz real**: Los agentes pueden hablar con voces neurales (incluyendo acento peruano).

---

## ✨ Características actuales

- 🏪 **Skill Marketplace** — Explora, busca y filtra skills por categoría, rating y precio
- 📋 **Páginas de detalle** — Descripción completa, reseñas, instalación en un clic
- 💰 **Dashboard de cuenta** — Saldo, historial, skills instaladas y **ganancias por ventas**
- 🤖 **Mis Agentes IA** — Conecta y gestiona múltiples agentes (OpenClaw, Moltbook, otros)
- 🎙️ **Voz neural** — Demo de TTS y skill de síntesis de voz (Camila y más)
- 🧩 **Skills reales** — Memory Optimizer, Smart Web Researcher, Translator Pro, Moltbook Tools, etc.
- 🌙 **Diseño moderno** — Tema claro/oscuro, responsive, enfocado en experiencia humana
- 🔒 **Auth + Store** — Sistema de usuarios, agentes e instalaciones (con base lista para Supabase)

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 |
| Auth & Datos | Store in-memory + schema Supabase listo |
| Deploy | Vercel |

---

## 🚀 Cómo empezar (desarrollo)

```bash
git clone https://github.com/lokix94/peru-hub.git
cd peru-hub
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 🗺️ Roadmap & Progreso (6 puntos principales)

| # | Punto | Estado | Notas |
|---|-------|--------|-------|
| 1 | **Backend API** (Supabase/PostgreSQL) | 🟡 En progreso | Schema SQL listo + store unificado. Migración completa pendiente |
| 2 | **Autenticación** (email + OAuth) | 🟡 En progreso | Auth propia funcionando. GitHub/Google OAuth siguiente |
| 3 | **Pagos & Earnings** (Stripe / Crypto) | 🟡 En progreso | Flujo de saldo + ganancias visible. Stripe Connect + revenue share pendiente |
| 4 | **Voz (Edge TTS / Neural)** | 🟢 Avanzado | Skill de Voice Synthesis + demo. Integración server-side real siguiente |
| 5 | **Skill SDK + No-code** | 🟡 En progreso | Flujo de conexión de agentes ultra-simple ya implementado. SDK de publicación pendiente |
| 6 | **Perfiles de agentes + Multi-agente + Reviews** | 🟡 En progreso | Multi-agente ya funciona en cuenta. Perfiles públicos y reviews formales pendientes |

### Próximos hitos prioritarios
- [ ] Completar migración a Supabase real
- [ ] OAuth (GitHub / Google)
- [ ] Stripe Connect + reparto de ganancias para creadores
- [ ] Publicación de skills desde la UI (sin código)
- [ ] Perfiles públicos de agentes
- [ ] Sistema de reviews post-compra

---

## 🧩 Skills incluidos (reales + demo)

- 🔍 Smart Web Researcher (gratis)
- 🧠 Agent Memory Optimizer (gratis)
- 🌐 Multi-Language Translator Pro (gratis)
- 📊 Moltbook Analytics / Auto-Poster / Community Manager / Trend Scanner
- 🎤 Voice Synthesis (voz neural)
- 💻 Code Review Assistant
- 📧 Email Composer Pro
- 🌤️ Weather Intelligence
- Y más en desarrollo

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Abre un issue o un Pull Request.

---

## 📄 Licencia

MIT License

---

**Built with 🦞 by Peru-AI** · Powered by OpenClaw & the agent community  
**La IA no tiene que ser aburrida ni técnica. Solo tiene que funcionar.**
