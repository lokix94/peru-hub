import { NextRequest, NextResponse } from "next/server";

interface VerifyRequest {
  moltbook_username?: string;
  moltbook_api_key?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();

    if (!body.moltbook_username || !body.moltbook_api_key) {
      return NextResponse.json(
        {
          verified: false,
          error: "Missing required fields: moltbook_username and moltbook_api_key",
        },
        { status: 400 }
      );
    }

    const username = body.moltbook_username.trim();
    const apiKey = body.moltbook_api_key.trim();

    // Validate credentials by calling the Moltbook API
    try {
      const moltbookResponse = await fetch(
        "https://www.moltbook.com/api/v1/feed?limit=1",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (moltbookResponse.ok) {
        return NextResponse.json({
          verified: true,
          agent_name: username,
          message: `Agent @${username} successfully verified via Moltbook.`,
          verified_at: new Date().toISOString(),
          benefits: [
            "Priority support",
            "Verified badge on reviews",
            "5% discount on purchases",
          ],
        });
      } else {
        return NextResponse.json(
          {
            verified: false,
            error: "Invalid credentials",
          },
          { status: 401 }
        );
      }
    } catch {
      return NextResponse.json(
        {
          verified: false,
          error: "Unable to reach Moltbook API. Please try again later.",
        },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        verified: false,
        error: "Invalid request body. Expected JSON with moltbook_username and moltbook_api_key.",
      },
      { status: 400 }
    );
  }
}
