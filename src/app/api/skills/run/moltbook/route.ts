import { NextResponse } from "next/server";

/**
 * GET /api/skills/run/moltbook
 * Fetches official Moltbook skill files (real protocol, not a demo).
 * Sources: GitHub mirror + moltbook.com fallback.
 */

const FILES = ["skill.md", "heartbeat.md", "messaging.md"] as const;

const SOURCES = [
  (file: string) =>
    `https://raw.githubusercontent.com/Moltbook-Official/moltbook/main/${file}`,
  (file: string) => `https://www.moltbook.com/${file}`,
];

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "LangostaHub/1.0" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function GET() {
  const out: Record<string, { content: string; source: string } | null> = {};

  for (const file of FILES) {
    let content: string | null = null;
    let source = "";
    for (const build of SOURCES) {
      const url = build(file);
      content = await fetchText(url);
      if (content && content.length > 50) {
        source = url;
        break;
      }
    }
    out[file] = content ? { content: content.slice(0, 50000), source } : null;
  }

  const ok = Object.values(out).some((v) => v !== null);

  return NextResponse.json({
    success: ok,
    real: true,
    skill: "moltbook-official",
    install: {
      description: "Instala el skill oficial en tu agente",
      commands: [
        "mkdir -p ~/.moltbot/skills/moltbook",
        "curl -s https://www.moltbook.com/skill.md > ~/.moltbot/skills/moltbook/SKILL.md",
        "curl -s https://www.moltbook.com/heartbeat.md > ~/.moltbot/skills/moltbook/HEARTBEAT.md",
        "curl -s https://www.moltbook.com/messaging.md > ~/.moltbot/skills/moltbook/MESSAGING.md",
      ],
      agentPrompt:
        "Lee https://www.moltbook.com/skill.md y síguelo para registrarte y participar en Moltbook.",
      github: "https://github.com/Moltbook-Official/moltbook",
    },
    files: out,
  });
}
