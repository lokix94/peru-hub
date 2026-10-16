import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/tts
 * Real neural TTS using Microsoft Edge online service (no API key).
 * Same approach as open-source edge-tts projects.
 *
 * Body: { text: string, voice?: string, rate?: string }
 * Returns: audio/mpeg binary or JSON error
 */

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";

const VOICES: Record<string, string> = {
  // Spanish — Peru / LatAm / ES
  camila: "es-PE-CamilaNeural",
  alex: "es-PE-AlexNeural",
  "es-pe-camila": "es-PE-CamilaNeural",
  "es-pe-alex": "es-PE-AlexNeural",
  "es-mx-jorge": "es-MX-JorgeNeural",
  "es-mx-dalia": "es-MX-DaliaNeural",
  "es-es-elvira": "es-ES-ElviraNeural",
  "es-es-alvaro": "es-ES-AlvaroNeural",
  // English
  "en-us-jenny": "en-US-JennyNeural",
  "en-us-guy": "en-US-GuyNeural",
  jenny: "en-US-JennyNeural",
};

function pickVoice(input?: string): string {
  if (!input) return "es-PE-CamilaNeural";
  const key = input.trim().toLowerCase();
  return VOICES[key] || input; // allow full voice name
}

async function getEdgeToken(): Promise<{ token: string; region: string } | null> {
  const url = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`;
  // Hitting voices list is enough to validate connectivity; SSML uses the same token
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "LangostaHub/1.0" },
    });
    if (!res.ok) return null;
    return { token: TRUSTED_CLIENT_TOKEN, region: "westus" };
  } catch {
    return null;
  }
}

function buildSSML(text: string, voice: string, rate: string): string {
  const escaped = text
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='es-PE'>` +
    `<voice name='${voice}'>` +
    `<prosody rate='${rate}'>${escaped}</prosody>` +
    `</voice></speak>`
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const voice = pickVoice(body.voice);
    const rate = typeof body.rate === "string" ? body.rate : "+0%";

    if (!text || text.length < 1) {
      return NextResponse.json(
        { success: false, error: "Texto requerido" },
        { status: 400 }
      );
    }
    if (text.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Máximo 2000 caracteres por solicitud" },
        { status: 400 }
      );
    }

    const auth = await getEdgeToken();
    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          error: "Servicio TTS temporalmente no disponible",
          real: true,
        },
        { status: 502 }
      );
    }

    const ssml = buildSSML(text, voice, rate);
    const requestId = crypto.randomUUID().replace(/-/g, "");
    const secMsGec = Date.now().toString();

    // Edge TTS HTTP endpoint (used by edge-tts community tools)
    const endpoint =
      `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1` +
      `?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
      `&Sec-MS-GEC-Version=1-130.0.2849.68`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
        "X-RequestId": requestId,
        "X-Timestamp": secMsGec,
      },
      body: ssml,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[tts] edge status", res.status, errText.slice(0, 200));
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo sintetizar el audio. Intenta de nuevo.",
          status: res.status,
          real: true,
        },
        { status: 502 }
      );
    }

    const audio = await res.arrayBuffer();
    if (!audio || audio.byteLength < 100) {
      return NextResponse.json(
        { success: false, error: "Audio vacío", real: true },
        { status: 502 }
      );
    }

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.byteLength),
        "Cache-Control": "no-store",
        "X-Langosta-Skill": "voice-synthesis",
        "X-Langosta-Voice": voice,
        "X-Langosta-Real": "true",
      },
    });
  } catch (error) {
    console.error("[tts]", error);
    return NextResponse.json(
      { success: false, error: "Error interno TTS" },
      { status: 500 }
    );
  }
}

/** List available curated voices */
export async function GET() {
  return NextResponse.json({
    success: true,
    real: true,
    skill: "voice-synthesis",
    voices: [
      { id: "camila", name: "Camila (Perú)", locale: "es-PE", gender: "female" },
      { id: "alex", name: "Alex (Perú)", locale: "es-PE", gender: "male" },
      { id: "es-mx-dalia", name: "Dalia (México)", locale: "es-MX", gender: "female" },
      { id: "es-mx-jorge", name: "Jorge (México)", locale: "es-MX", gender: "male" },
      { id: "es-es-elvira", name: "Elvira (España)", locale: "es-ES", gender: "female" },
      { id: "jenny", name: "Jenny (US)", locale: "en-US", gender: "female" },
    ],
    endpoint: "POST /api/skills/run/tts",
    body: { text: "Hola desde Langosta Hub", voice: "camila" },
  });
}
