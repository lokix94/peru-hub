import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/github-scout
 * Consulta la API pública de GitHub (sin token).
 * Body: { repo?: "owner/name" | url, q?: string }
 */

const GH = {
  Accept: "application/vnd.github+json",
  "User-Agent": "LangostaHub/1.0",
  "X-GitHub-Api-Version": "2022-11-28",
};

function parseRepo(input: string): { owner: string; repo: string } | null {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
  const [owner, repo] = cleaned.split("/").filter(Boolean);
  if (!owner || !repo) return null;
  if (!/^[\w.-]{1,80}$/.test(owner) || !/^[\w.-]{1,100}$/.test(repo)) return null;
  return { owner, repo };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const repoInput = typeof body.repo === "string" ? body.repo : "";
    const q = typeof body.q === "string" ? body.q.trim().slice(0, 120) : "";

    if (repoInput) {
      const parsed = parseRepo(repoInput);
      if (!parsed) {
        return NextResponse.json(
          { success: false, error: "Usa owner/repo o una URL de github.com" },
          { status: 400 }
        );
      }
      const res = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
        { headers: GH }
      );
      if (res.status === 404) {
        return NextResponse.json(
          { success: false, error: "Repositorio no encontrado" },
          { status: 404 }
        );
      }
      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: "GitHub no respondió", status: res.status },
          { status: 502 }
        );
      }
      const data = await res.json();
      return NextResponse.json({
        success: true,
        real: true,
        skill: "github-skill-scout",
        mode: "repo",
        repo: {
          fullName: data.full_name,
          description: data.description,
          stars: data.stargazers_count,
          forks: data.forks_count,
          language: data.language,
          license: data.license?.spdx_id ?? null,
          topics: data.topics ?? [],
          homepage: data.homepage,
          url: data.html_url,
          updatedAt: data.updated_at,
          defaultBranch: data.default_branch,
          openIssues: data.open_issues_count,
        },
      });
    }

    if (!q) {
      return NextResponse.json(
        { success: false, error: "Envía repo (owner/name) o q (búsqueda)" },
        { status: 400 }
      );
    }

    const query = encodeURIComponent(`${q} SKILL.md`);
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&per_page=5`,
      { headers: GH }
    );
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Búsqueda de GitHub falló", status: res.status },
        { status: 502 }
      );
    }
    const data = await res.json();
    const items = (data.items ?? []).slice(0, 5).map((item: {
      full_name: string;
      description: string | null;
      stargazers_count: number;
      language: string | null;
      html_url: string;
      license: { spdx_id?: string } | null;
    }) => ({
      fullName: item.full_name,
      description: item.description,
      stars: item.stargazers_count,
      language: item.language,
      license: item.license?.spdx_id ?? null,
      url: item.html_url,
    }));

    return NextResponse.json({
      success: true,
      real: true,
      skill: "github-skill-scout",
      mode: "search",
      count: items.length,
      items,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno GitHub scout" },
      { status: 500 }
    );
  }
}
