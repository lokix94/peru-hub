import { NextRequest, NextResponse } from "next/server";

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

interface MoltbookAuthor {
  id: string;
  name: string;
}

interface MoltbookPost {
  id: string;
  title: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author: MoltbookAuthor;
}

interface MoltbookPostsResponse {
  success: boolean;
  posts: MoltbookPost[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, apiKey } = body as { username?: string; apiKey?: string };

    if (!username || !username.trim()) {
      return NextResponse.json(
        { verified: false, error: "Se requiere un nombre de usuario" },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();

    // If API key provided, try profile endpoint first
    if (apiKey) {
      try {
        const profileRes = await fetch(`${MOLTBOOK_API}/profile`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData && profileData.name) {
            return NextResponse.json({
              verified: true,
              agent: {
                name: profileData.name,
                id: profileData.id || profileData.name,
                postCount: profileData.post_count ?? 0,
                karma: profileData.karma ?? 0,
                lastActive: profileData.last_active || new Date().toISOString(),
              },
            });
          }
        }
      } catch {
        // Profile endpoint failed, fall through to posts search
      }
    }

    // Search posts to find the agent by author name
    const postsRes = await fetch(`${MOLTBOOK_API}/posts?limit=100`, {
      cache: "no-store",
    });

    if (!postsRes.ok) {
      return NextResponse.json(
        { verified: false, error: `Error al conectar con Moltbook (${postsRes.status})` },
        { status: 502 }
      );
    }

    const postsData = (await postsRes.json()) as MoltbookPostsResponse;

    if (!postsData.success || !Array.isArray(postsData.posts)) {
      return NextResponse.json(
        { verified: false, error: "Respuesta inesperada de Moltbook" },
        { status: 502 }
      );
    }

    // Filter posts by author name (case-insensitive)
    const userPosts = postsData.posts.filter(
      (p) => p.author?.name?.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (userPosts.length === 0) {
      return NextResponse.json(
        { verified: false, error: "Agente no encontrado en Moltbook" },
        { status: 404 }
      );
    }

    // Compute stats from posts
    const author = userPosts[0].author;
    const totalUpvotes = userPosts.reduce((sum, p) => sum + (p.upvotes || 0), 0);
    const totalDownvotes = userPosts.reduce((sum, p) => sum + (p.downvotes || 0), 0);
    const karma = totalUpvotes - totalDownvotes;

    // Find most recent post date
    const sortedByDate = [...userPosts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastActive = sortedByDate[0]?.created_at || new Date().toISOString();

    return NextResponse.json({
      verified: true,
      agent: {
        name: author.name,
        id: author.id,
        postCount: userPosts.length,
        karma,
        lastActive,
      },
    });
  } catch (err) {
    console.error("verify-moltbook error:", err);
    return NextResponse.json(
      { verified: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
