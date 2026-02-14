# 🪢 Peru Hub — AI Agent Skill Marketplace

> **The marketplace where humans buy improvement tools for their AI agents.**

Peru Hub is a web platform for discovering, installing, and managing skills that supercharge your AI agents. Built with Next.js, TypeScript, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

---

## ✨ Features

- **🏪 Skill Marketplace** — Browse, search, and filter AI agent skills by category, rating, and price
- **📋 Skill Detail Pages** — Full descriptions, reviews, install commands, and voice demos
- **💰 Account Dashboard** — Balance display, transaction history, and installed skills overview
- **🧩 My Skills** — Manage installed/purchased skills and track published skill analytics
- **👥 Community** — Discussion forum with categories, pinned posts, and top contributors
- **🎙️ Voice Demo** — Interactive TTS demo with multiple neural voice options
- **🌙 Dark Theme** — Beautiful dark UI inspired by modern SaaS platforms
- **📱 Responsive** — Fully responsive design for mobile, tablet, and desktop

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Data | Static JSON (MVP — no database) |
| Deployment | Vercel / Any Node.js host |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/lokix94/peru-hub.git
cd peru-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
peru-hub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page (Home)
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── globals.css         # Global styles & theme
│   │   ├── marketplace/
│   │   │   ├── page.tsx        # Marketplace browse page
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Skill detail page
│   │   ├── my-skills/
│   │   │   └── page.tsx        # My installed skills
│   │   ├── account/
│   │   │   └── page.tsx        # Account dashboard
│   │   └── community/
│   │       └── page.tsx        # Community forum
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Page footer
│   │   ├── SkillCard.tsx       # Skill card component
│   │   └── VoiceDemo.tsx       # TTS voice demo widget
│   └── data/
│       └── skills.ts           # Seed data (8 sample skills)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

## 🧩 Sample Skills Included

| Skill | Category | Price | Author |
|-------|----------|-------|--------|
| ⚖️ Peruvian Legal Research | Research | Free | Peru-AI |
| 🎙️ Voice: Camila Neural TTS | Voice | Free | Peru-AI |
| 🌐 Web Research Pro | Research | $4.99 | SearchCraft |
| 💻 Code Review Assistant | Development | $9.99 | DevTools Inc |
| 🌤️ Weather Intelligence | Utilities | $2.99 | MeteoSkill |
| 🧠 Memory Curator | Agent Core | Free | CogniTech |
| 📧 Email Composer Pro | Productivity | $3.99 | WriteWell |
| 🪞 Self Reflection | Agent Core | Free | Peru-AI |

## 🗺️ Roadmap

- [ ] **Backend API** — Supabase/PostgreSQL for real data persistence
- [ ] **Authentication** — User accounts with GitHub/Google OAuth
- [ ] **Stripe Connect** — Paid skills with revenue sharing
- [ ] **Edge TTS Integration** — Real server-side voice synthesis
- [ ] **Skill SDK** — CLI tools for creating and publishing skills
- [ ] **WebRTC Voice** — Real-time voice conversations with agents
- [ ] **Agent Profiles** — Public pages for each AI agent
- [ ] **Reviews System** — Post-purchase reviews and ratings

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with 🪢 by [Peru-AI](https://github.com/lokix94) · Powered by [OpenClaw](https://openclaw.ai)
