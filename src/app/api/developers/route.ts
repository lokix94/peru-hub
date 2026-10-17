import { NextRequest, NextResponse } from "next/server";

/**
 * Langosta Hub — Developers / Creators API
 * type: "profile" | "skill"
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "info";

  return NextResponse.json({
    success: true,
    service: "Langosta Hub Developers API",
    version: "1.1.0",
    action,
    royalty_split: { developer: 0.97, platform: 0.03 },
    templates: [
      "smart-web-researcher",
      "weather-intelligence",
      "voice-synthesis",
      "moltbook-analytics",
    ],
    endpoints: {
      "GET": "API info",
      "POST type=profile": "Complete developer profile (wallet BEP20)",
      "POST type=skill": "Submit skill for review",
    },
    note: "Frontend also persists to localStorage so the flow works without Supabase.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Missing 'type'. Use 'profile' or 'skill'." },
        { status: 400 }
      );
    }

    if (type === "profile") {
      const required = ["full_name", "email", "wallet_bep20"];
      const missing = required.filter(
        (f) => !body[f] || String(body[f]).trim() === ""
      );
      if (missing.length > 0) {
        return NextResponse.json(
          { success: false, error: "Missing required fields", missing_fields: missing },
          { status: 400 }
        );
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(String(body.wallet_bep20).trim())) {
        return NextResponse.json(
          { success: false, error: "Invalid BEP20 wallet address" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          type: "profile",
          message: "Perfil de desarrollador aceptado.",
          data: {
            full_name: String(body.full_name).trim(),
            email: String(body.email).trim().toLowerCase(),
            wallet_bep20: String(body.wallet_bep20).trim(),
            moltbook_profile: body.moltbook_profile
              ? String(body.moltbook_profile).trim()
              : null,
          },
        },
        { status: 201 }
      );
    }

    if (type === "skill") {
      const required = ["skill_name", "description", "category", "price", "repo_url"];
      const missing = required.filter(
        (f) => body[f] == null || String(body[f]).trim() === ""
      );
      if (missing.length > 0) {
        return NextResponse.json(
          { success: false, error: "Missing required fields", missing_fields: missing },
          { status: 400 }
        );
      }

      const price = Number(body.price);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { success: false, error: "Price must be 0 (free) or a positive number" },
          { status: 400 }
        );
      }
      if (price > 0 && price < 0.99) {
        return NextResponse.json(
          { success: false, error: "Paid skills must be at least 0.99 USD" },
          { status: 400 }
        );
      }

      if (!/^https?:\/\/(github\.com|gitlab\.com)\//.test(String(body.repo_url).trim())) {
        return NextResponse.json(
          { success: false, error: "Repository URL must be from GitHub or GitLab" },
          { status: 400 }
        );
      }

      if (String(body.description).trim().length < 100) {
        return NextResponse.json(
          { success: false, error: "Description must be at least 100 characters" },
          { status: 400 }
        );
      }

      const platformFee = Number((price * 0.03).toFixed(2));
      const developerShare = Number((price * 0.97).toFixed(2));

      return NextResponse.json(
        {
          success: true,
          type: "skill",
          message: "Skill enviado a revisión (24-48h).",
          data: {
            skill_name: String(body.skill_name).trim(),
            category: body.category,
            price,
            is_free: price === 0,
            platform_fee: platformFee,
            developer_share: developerShare,
            status: "pending",
            repo_url: String(body.repo_url).trim(),
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unknown type. Use 'profile' or 'skill'." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
