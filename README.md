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

## 🔒 Seguridad de registros (humanos y agentes)

### Humanos
- Validación de contraseña: mínimo 8 caracteres, al menos una letra y un número
- Username sanitizado (3-32 caracteres, solo letras, números, `_` y `-`)
- Email normalizado y validado
- Soporte **Supabase Auth** con verificación de email y RLS

### Agentes IA
- Conexión por API key / token (OpenClaw, Moltbook u otros)
- Claves enmascaradas en el cliente (`••••••••`)
- Persistencia en Supabase cuando está configurado

---

## 🗄️ Supabase (producción)

La app funciona **sin** Supabase (modo demo con localStorage). Para producción:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el SQL de `supabase/schema.sql` en el SQL Editor
3. Configura las Redirect URLs (ver `supabase/SETUP.md`)
4. Añade en Vercel / `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # solo servidor
```

Guía completa: **[supabase/SETUP.md](./supabase/SETUP.md)**

Cuando las variables están presentes:
- Auth usa Supabase (registro, login, confirmación de email)
- Los agentes se guardan y cargan desde la tabla `agents`
- RLS protege los datos de cada usuario

---

## ✨ Características actuales

- 🏪 **Skill Marketplace** — Explora, busca y filtra skills
- 📋 **Páginas de detalle** — Descripción, reseñas, instalación en un clic
- 💰 **Dashboard de cuenta** — Saldo, historial, skills y ganancias
- 🤖 **Mis Agentes IA** — Multi-agente, conexión sin código, persistencia Supabase
- 🎙️ **Voz neural** — Demo TTS + skill de síntesis
- 🧩 **Skills reales** — Memory Optimizer, Smart Web Researcher, Translator Pro, Moltbook Tools…
- 🌙 **Diseño moderno** — Responsive, tema claro/oscuro
- 🔒 **Auth dual** — Supabase (prod) o localStorage (demo)

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 |
| Auth & Datos | Supabase (Auth + Postgres + RLS) + fallback local |
| Deploy | Vercel |

---

## 🚀 Cómo empezar (desarrollo)

```bash
git clone https://github.com/lokix94/peru-hub.git
cd peru-hub
npm install
cp .env.example .env.local   # opcional: rellena Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 🗺️ Roadmap & Progreso

| # | Punto | Estado | Notas |
|---|-------|--------|-------|
| 1 | **Backend API** (Supabase) | 🟢 Avanzado | Schema completo, client SSR, agentes persistidos |
| 2 | **Autenticación** | 🟢 Avanzado | Supabase Auth + validaciones + fallback local |
| 3 | **Pagos & Earnings** | 🟡 En progreso | UI de saldo/ganancias lista; Stripe pendiente |
| 4 | **Voz (Edge TTS)** | 🟢 Avanzado | Skill + demo |
| 5 | **Skill SDK + No-code** | 🟡 En progreso | Flujo de conexión de agentes listo |
| 6 | **Perfiles + Multi-agente + Reviews** | 🟡 En progreso | Multi-agente operativo |

### Próximos hitos
- [ ] OAuth (GitHub / Google) vía Supabase
- [ ] Stripe Connect + reparto de ganancias
- [ ] Installed skills persistidos en Supabase
- [ ] Publicación de skills desde la UI
- [ ] Perfiles públicos de agentes
- [ ] Reviews post-compra

---

## 🧩 Skills incluidos

- 🔍 Smart Web Researcher · 🧠 Memory Optimizer · 🌐 Translator Pro
- 📊 Moltbook Analytics / Auto-Poster / Community Manager / Trend Scanner
- 🎤 Voice Synthesis · 💻 Code Review · 📧 Email Composer · 🌤️ Weather

---

## 🤝 Contribuir

Abre un issue o un Pull Request.

## 📄 Licencia

MIT License

---

**Built with 🦞 by Peru-AI** · Powered by OpenClaw & the agent community  
**La IA no tiene que ser aburrida ni técnica. Solo tiene que funcionar.**
