/**
 * Real skill runtimes available on Langosta Hub.
 * These are not demos: they call free/open providers or official protocols.
 */

export type SkillRuntime = {
  skillId: string;
  endpoint: string;
  method: "GET" | "POST";
  description: string;
  provider: string;
  license: string;
  sourceUrl: string;
  installCommand?: string;
};

export const REAL_SKILL_RUNTIMES: SkillRuntime[] = [
  {
    skillId: "smart-web-researcher",
    endpoint: "/api/skills/run/web-search",
    method: "POST",
    description: "Búsqueda web real (DuckDuckGo; Serper opcional)",
    provider: "DuckDuckGo / Serper",
    license: "Uso libre (API pública DDG)",
    sourceUrl: "https://github.com/deedy/duckduckgo-search",
    installCommand:
      "curl -X POST https://langosta-hub.vercel.app/api/skills/run/web-search -H 'Content-Type: application/json' -d '{\"query\":\"IA en Perú\"}'",
  },
  {
    skillId: "voice-synthesis",
    endpoint: "/api/skills/run/tts",
    method: "POST",
    description: "Síntesis de voz neural (Edge TTS, sin API key)",
    provider: "Microsoft Edge TTS (community protocol)",
    license: "Protocolo público; ver edge-tts OSS",
    sourceUrl: "https://github.com/rany2/edge-tts",
    installCommand:
      "curl -X POST https://langosta-hub.vercel.app/api/skills/run/tts -H 'Content-Type: application/json' -d '{\"text\":\"Hola Perú\",\"voice\":\"camila\"}' --output voz.mp3",
  },
  {
    skillId: "weather-intelligence",
    endpoint: "/api/skills/run/weather",
    method: "POST",
    description: "Clima en tiempo real (Open-Meteo)",
    provider: "Open-Meteo",
    license: "CC BY 4.0 / free non-commercial API",
    sourceUrl: "https://open-meteo.com",
    installCommand:
      "curl -X POST https://langosta-hub.vercel.app/api/skills/run/weather -H 'Content-Type: application/json' -d '{\"city\":\"Lima\"}'",
  },
  {
    skillId: "moltbook-analytics",
    endpoint: "/api/skills/run/moltbook",
    method: "GET",
    description: "Protocolo oficial Moltbook (skill.md + heartbeat)",
    provider: "Moltbook Official",
    license: "Documentación pública oficial",
    sourceUrl: "https://github.com/Moltbook-Official/moltbook",
    installCommand: "curl -s https://www.moltbook.com/skill.md > SKILL.md",
  },
  {
    skillId: "moltbook-auto-poster",
    endpoint: "/api/skills/run/moltbook",
    method: "GET",
    description: "Basado en el skill oficial Moltbook",
    provider: "Moltbook Official",
    license: "Documentación pública oficial",
    sourceUrl: "https://github.com/Moltbook-Official/moltbook",
  },
  {
    skillId: "moltbook-community-manager",
    endpoint: "/api/skills/run/moltbook",
    method: "GET",
    description: "Basado en messaging.md oficial",
    provider: "Moltbook Official",
    license: "Documentación pública oficial",
    sourceUrl: "https://github.com/Moltbook-Official/moltbook",
  },
  {
    skillId: "moltbook-trend-scanner",
    endpoint: "/api/skills/run/moltbook",
    method: "GET",
    description: "Basado en el protocolo oficial Moltbook",
    provider: "Moltbook Official",
    license: "Documentación pública oficial",
    sourceUrl: "https://github.com/Moltbook-Official/moltbook",
  },
  // —— Nuevas herramientas distintas ——
  {
    skillId: "crypto-price-radar",
    endpoint: "/api/skills/run/crypto-price",
    method: "POST",
    description: "Precios crypto en vivo (BTC, ETH, SOL…)",
    provider: "CoinGecko",
    license: "API pública gratuita",
    sourceUrl: "https://www.coingecko.com/en/api",
    installCommand:
      "curl -X POST https://langosta-hub.vercel.app/api/skills/run/crypto-price -H 'Content-Type: application/json' -d '{\"ids\":\"bitcoin,ethereum\",\"vs\":\"usd\"}'",
  },
  {
    skillId: "fx-converter",
    endpoint: "/api/skills/run/fx-rates",
    method: "POST",
    description: "Conversión de divisas (tasas ECB vía Frankfurter)",
    provider: "Frankfurter.app",
    license: "Datos BCE / uso libre",
    sourceUrl: "https://www.frankfurter.app",
    installCommand:
      "curl -X POST https://langosta-hub.vercel.app/api/skills/run/fx-rates -H 'Content-Type: application/json' -d '{\"from\":\"USD\",\"to\":\"EUR\",\"amount\":100}'",
  },
  {
    skillId: "network-scout",
    endpoint: "/api/skills/run/public-ip",
    method: "POST",
    description: "IP pública + geo/org aproximada",
    provider: "ipify + ipapi.co",
    license: "APIs públicas",
    sourceUrl: "https://www.ipify.org",
    installCommand:
      "curl -X POST https://langosta-hub.vercel.app/api/skills/run/public-ip -H 'Content-Type: application/json' -d '{\"ip\":\"8.8.8.8\"}'",
  },
  {
    skillId: "asm-explainer",
    endpoint: "/api/skills/run/asm-explain",
    method: "POST",
    description: "Explica snippets de ensamblador x86/ARM (educativo)",
    provider: "Langosta Hub (diccionario local)",
    license: "Educativo — no ejecuta código",
    sourceUrl: "https://langosta-hub.vercel.app",
    installCommand:
      "curl -X POST https://langosta-hub.vercel.app/api/skills/run/asm-explain -H 'Content-Type: application/json' -d '{\"arch\":\"x86\",\"code\":\"mov eax, 1\\nxor ebx, ebx\\nret\"}'",
  },
];

export function getRuntimeForSkill(skillId: string): SkillRuntime | undefined {
  return REAL_SKILL_RUNTIMES.find((r) => r.skillId === skillId);
}

export function isRealRuntimeSkill(skillId: string): boolean {
  return REAL_SKILL_RUNTIMES.some((r) => r.skillId === skillId);
}
