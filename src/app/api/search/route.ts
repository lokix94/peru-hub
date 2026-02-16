import { NextRequest, NextResponse } from "next/server";

const SERPER_API_KEY = process.env.SERPER_API_KEY || "b3fc89e2a5c01e9c588af451efa7f4885d8174a4";

interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  position?: number;
}

interface SerperResponse {
  organic?: SerperResult[];
  searchParameters?: { q: string };
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Enhance query for AI agent skill context
    const enhancedQuery = `${query.trim()} AI agent skill tool`;

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-Key": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: enhancedQuery,
        num: 6,
        gl: "us",
        hl: "es",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Serper API error:", response.status, errorText);
      return NextResponse.json(
        { success: false, error: "Error en búsqueda web" },
        { status: 502 }
      );
    }

    const data: SerperResponse = await response.json();

    const results = (data.organic || []).map((r) => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet,
    }));

    return NextResponse.json({
      success: true,
      query: query.trim(),
      results,
      count: results.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
