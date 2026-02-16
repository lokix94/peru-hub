import { NextRequest, NextResponse } from "next/server";

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";
const MOLTBOOK_PROFILE_URL = "https://www.moltbook.com/u";

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
  count: number;
  has_more: boolean;
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

    // If API key provided, try authenticated request first
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
                profileUrl: `${MOLTBOOK_PROFILE_URL}/${profileData.name}`,
              },
            });
          }
        }
      } catch {
        // Profile endpoint failed, fall through
      }
    }

    // Strategy 1: Check if the profile page exists (HEAD request to /u/username)
    let profileExists = false;
    try {
      const profilePageRes = await fetch(`${MOLTBOOK_PROFILE_URL}/${encodeURIComponent(trimmedUsername)}`, {
        method: "GET",
        cache: "no-store",
        headers: { "Accept": "text/html" },
      });
      // Moltbook returns 200 for existing profiles, the HTML contains the username in route params
      if (profilePageRes.ok) {
        const html = await profilePageRes.text();
        // Check if the page actually has the user data (not a generic 404 page)
        // The page includes the username in the route params: "params":{"name":"Peru"}
        const hasUserRoute = html.includes(`"name":"${trimmedUsername}"`) || 
                            html.includes(`"name":"${trimmedUsername.toLowerCase()}"`) ||
                            html.includes(`"name":"${trimmedUsername.charAt(0).toUpperCase() + trimmedUsername.slice(1)}"`);
        // Also check it's NOT a 404 page
        const is404 = html.includes('<h1 class="next-error-h1"') && html.includes('>404<');
        profileExists = hasUserRoute && !is404;
      }
    } catch {
      // Profile page check failed
    }

    // Strategy 2: Search posts across multiple pages
    let userPosts: MoltbookPost[] = [];
    let authorInfo: MoltbookAuthor | null = null;

    for (let offset = 0; offset <= 500; offset += 100) {
      try {
        const postsRes = await fetch(`${MOLTBOOK_API}/posts?limit=100&offset=${offset}`, {
          cache: "no-store",
        });

        if (!postsRes.ok) break;

        const postsData = (await postsRes.json()) as MoltbookPostsResponse;
        if (!postsData.success || !Array.isArray(postsData.posts) || postsData.posts.length === 0) break;

        const matched = postsData.posts.filter(
          (p) => p.author?.name?.toLowerCase() === trimmedUsername.toLowerCase()
        );

        if (matched.length > 0) {
          userPosts = [...userPosts, ...matched];
          if (!authorInfo) authorInfo = matched[0].author;
        }

        // If we found posts, or no more pages, stop
        if (!postsData.has_more) break;
        if (userPosts.length > 0 && offset >= 200) break; // found enough
      } catch {
        break;
      }
    }

    // If found in posts, return full stats
    if (userPosts.length > 0 && authorInfo) {
      const totalUpvotes = userPosts.reduce((sum, p) => sum + (p.upvotes || 0), 0);
      const totalDownvotes = userPosts.reduce((sum, p) => sum + (p.downvotes || 0), 0);
      const karma = totalUpvotes - totalDownvotes;

      const sortedByDate = [...userPosts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastActive = sortedByDate[0]?.created_at || new Date().toISOString();

      return NextResponse.json({
        verified: true,
        agent: {
          name: authorInfo.name,
          id: authorInfo.id,
          postCount: userPosts.length,
          karma,
          lastActive,
          profileUrl: `${MOLTBOOK_PROFILE_URL}/${authorInfo.name}`,
        },
      });
    }

    // If profile page exists but posts not found (e.g. suspended account)
    if (profileExists) {
      return NextResponse.json({
        verified: true,
        agent: {
          name: trimmedUsername,
          id: trimmedUsername.toLowerCase(),
          postCount: 0,
          karma: 0,
          lastActive: new Date().toISOString(),
          profileUrl: `${MOLTBOOK_PROFILE_URL}/${trimmedUsername}`,
          note: "Perfil verificado. Las estadísticas pueden no estar disponibles temporalmente.",
        },
      });
    }

    // Not found anywhere
    return NextResponse.json(
      { verified: false, error: "Agente no encontrado en Moltbook. Verifica que el nombre de usuario sea correcto." },
      { status: 404 }
    );
  } catch (err) {
    console.error("verify-moltbook error:", err);
    return NextResponse.json(
      { verified: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
