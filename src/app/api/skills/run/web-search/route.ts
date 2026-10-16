import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/web-search
 * Real web search for Smart Web Researcher — free, no API key.
 * Primary: DuckDuckGo Instant Answer + HTML lite results.
 * Optional: Serper if SERPER_API_KEY is set.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const maxResults = Math.min(Number(body.maxResults) || 6, 10);

    if (query.length < 2) {
      return NextResponse.json(
        { success: false, error: "La consulta debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }

    // Prefer Serper if configured (higher quality)
    const serperKey = process.env.SERPER_API_KEY;
    if (serperKey) {
      try {
        const res = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-Key": serperKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: query, num: maxResults, hl: "es", gl: "pe" }),
        });
        if (res.ok) {
          const data = await res.json();
          const results = (data.organic || []).map(
            (r: { title: string; link: string; snippet: string }, i: number) => ({
              title: r.title,
              url: r.link,
              snippet: r.snippet,
              position: i + 1,
              source: "serper",
            })
          );
          return NextResponse.json({
            success: true,
            query,
            results,
            count: results.length,
            engine: "serper",
            skill: "smart-web-researcher",
            real: true,
          });
        }
      } catch {
        // fall through to DuckDuckGo
      }
    }

    // Free path: DuckDuckGo Instant Answer API
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl, {
      headers: { "User-Agent": "LangostaHub/1.0 (AI agent skill; +https://langosta-hub.vercel.app)" },
      next: { revalidate: 0 },
    });

    const results: {
      title: string;
      url: string;
      snippet: string;
      position: number;
      source: string;
    }[] = [];

    if (ddgRes.ok) {
      const data = await ddgRes.json();

      if (data.AbstractText && data.AbstractURL) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL,
          snippet: data.AbstractText,
          position: 1,
          source: "duckduckgo-abstract",
        });
      }

      const related = Array.isArray(data.RelatedTopics) ? data.RelatedTopics : [];
      for (const item of related) {
        if (results.length >= maxResults) break;
        // Nested topics
        if (item.Topics && Array.isArray(item.Topics)) {
          for (const sub of item.Topics) {
            if (results.length >= maxResults) break;
            if (sub.FirstURL && sub.Text) {
              results.push({
                title: sub.Text.split(" - ")[0] || sub.Text.slice(0, 80),
                url: sub.FirstURL,
                snippet: sub.Text,
                position: results.length + 1,
                source: "duckduckgo",
              });
            }
          }
        } else if (item.FirstURL && item.Text) {
          results.push({
            title: item.Text.split(" - ")[0] || item.Text.slice(0, 80),
            url: item.FirstURL,
            snippet: item.Text,
            position: results.length + 1,
            source: "duckduckgo",
          });
        }
      }
    }

    // Supplement with DuckDuckGo lite HTML if few results
    if (results.length < 3) {
      try {
        const liteUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
        const liteRes = await fetch(liteUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; LangostaHub/1.0; +https://langosta-hub.vercel.app)",
          },
        });
        if (liteRes.ok) {
          const html = await liteRes.text();
          const linkRegex =
            /<a[^>]+rel="nofollow"[^>]+href="(https?:\/\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
          let match;
          const seen = new Set(results.map((r) => r.url));
          while ((match = linkRegex.exec(html)) !== null && results.length < maxResults) {
            const url = match[1];
            const title = match[2].trim();
            if (
              !url.includes("duckduckgo.com") &&
              !seen.has(url) &&
              title.length > 2
            ) {
              seen.add(url);
              results.push({
                title,
                url,
                snippet: title,
                position: results.length + 1,
                source: "duckduckgo-lite",
              });
            }
          }
        }
      } catch {
        // ignore lite failures
      }
    }

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
      engine: "duckduckgo",
      skill: "smart-web-researcher",
      real: true,
      note:
        results.length === 0
          ? "Sin resultados. Intenta otra consulta."
          : undefined,
    });
  } catch (error) {
    console.error("[web-search]", error);
    return NextResponse.json(
      { success: false, error: "Error al buscar en la web" },
      { status: 500 }
    );
  }
}
