import { NextRequest, NextResponse } from "next/server";

/**
 * Langosta Hub — Developers / Creators API
 * Structured cleanly (like a Java controller)
 * Handles developer profile registration and skill submissions.
 * Falls back to localStorage-friendly responses when Supabase is not configured.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "profile";

  // Placeholder for future Supabase queries
  // When Supabase is connected this will return real data from developer_profiles & skill_submissions

  return NextResponse.json({
    success: true,
    service: "Langosta Hub Developers API",
    version: "1.0.0",
    action,
    message: "API ready. Connect Supabase and run the updated schema.sql to enable persistence.",
    endpoints: {
      "GET ?action=profile": "Get current developer profile",
      "GET ?action=skills": "List own skill submissions",
      "GET ?action=royalties": "List royalties / payouts",
      "POST": "Create or update developer profile / submit skill",
    },
    schema_tables: [
      "developer_profiles",
      "skill_submissions",
      "royalties",
    ],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body; // "profile" | "skill"

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing 'type' field. Use 'profile' or 'skill'.",
        },
        { status: 400 }
      );
    }

    if (type === "profile") {
      // Validate required fields for developer profile
      const required = ["full_name", "email", "wallet_bep20"];
      const missing = required.filter((f) => !body[f] || String(body[f]).trim() === "");
      if (missing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields",
            missing_fields: missing,
          },
          { status: 400 }
        );
      }

      // Basic wallet validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(body.wallet_bep20.trim())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid BEP20 wallet address",
          },
          { status: 400 }
        );
      }

      // TODO: Insert into developer_profiles when Supabase is ready
      // For now return success so frontend can continue using localStorage + this API

      return NextResponse.json(
        {
          success: true,
          type: "profile",
          message: "Developer profile accepted. Persistence will be enabled after schema is applied.",
          data: {
            full_name: body.full_name.trim(),
            email: body.email.trim().toLowerCase(),
            wallet_bep20: body.wallet_bep20.trim(),
            moltbook_profile: body.moltbook_profile?.trim() || null,
          },
        },
        { status: 201 }
      );
    }

    if (type === "skill") {
      // Validate skill submission
      const required = ["skill_name", "description", "category", "price", "repo_url"];
      const missing = required.filter((f) => body[f] == null || String(body[f]).trim() === "");
      if (missing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields",
            missing_fields: missing,
          },
          { status: 400 }
        );
      }

      const price = Number(body.price);
      if (isNaN(price) || price < 0.99) {
        return NextResponse.json(
          {
            success: false,
            error: "Price must be at least 0.99 USD",
          },
          { status: 400 }
        );
      }

      if (!/^https?:\/\/(github\.com|gitlab\.com)\//.test(body.repo_url.trim())) {
        return NextResponse.json(
          {
            success: false,
            error: "Repository URL must be from GitHub or GitLab",
          },
          { status: 400 }
        );
      }

      if (String(body.description).trim().length < 100) {
        return NextResponse.json(
          {
            success: false,
            error: "Description must be at least 100 characters",
          },
          { status: 400 }
        );
      }

      // Calculate shares
      const platformFee = Number((price * 0.03).toFixed(2));
      const developerShare = Number((price * 0.97).toFixed(2));

      // TODO: Insert into skill_submissions when Supabase is ready

      return NextResponse.json(
        {
          success: true,
          type: "skill",
          message: "Skill submitted for review (24-48h). Persistence ready after schema apply.",
          data: {
            skill_name: body.skill_name.trim(),
            category: body.category,
            price,
            platform_fee: platformFee,
            developer_share: developerShare,
            status: "pending",
            repo_url: body.repo_url.trim(),
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown type. Use 'profile' or 'skill'.",
      },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON body",
      },
      { status: 400 }
    );
  }
}
