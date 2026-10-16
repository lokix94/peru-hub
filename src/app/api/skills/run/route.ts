import { NextResponse } from "next/server";
import { REAL_SKILL_RUNTIMES } from "@/lib/skill-runtime";

/**
 * GET /api/skills/run — list all real skill runtimes on this hub
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Runtimes reales de Langosta Hub (no demos)",
    count: REAL_SKILL_RUNTIMES.length,
    runtimes: REAL_SKILL_RUNTIMES,
    examples: {
      webSearch: {
        method: "POST",
        url: "/api/skills/run/web-search",
        body: { query: "inteligencia artificial Perú", maxResults: 5 },
      },
      tts: {
        method: "POST",
        url: "/api/skills/run/tts",
        body: { text: "Hola, soy tu agente con voz real.", voice: "camila" },
      },
      weather: {
        method: "POST",
        url: "/api/skills/run/weather",
        body: { city: "Lima" },
      },
      moltbook: {
        method: "GET",
        url: "/api/skills/run/moltbook",
      },
    },
  });
}
