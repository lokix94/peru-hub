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
      "# Runtime en Langosta Hub\ncurl -X POST https://langosta-hub.vercel.app/api/skills/run/web-search -H 'Content-Type: application/json' -d '{\"query\":\"IA en Perú\"}'",
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
      "# Runtime en Langosta Hub\ncurl -X POST https://langosta-hub.vercel.app/api/skills/run/tts -H 'Content-Type: application/json' -d '{\"text\":\"Hola Perú\",\"voice\":\"camila\"}' --output voz.mp3",
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
    installCommand:
      "curl -s https://www.moltbook.com/skill.md > SKILL.md",
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
];

export function getRuntimeForSkill(skillId: string): SkillRuntime | undefined {
  return REAL_SKILL_RUNTIMES.find((r) => r.skillId === skillId);
}

export function isRealRuntimeSkill(skillId: string): boolean {
  return REAL_SKILL_RUNTIMES.some((r) => r.skillId === skillId);
}
