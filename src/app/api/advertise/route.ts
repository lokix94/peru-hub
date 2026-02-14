import { NextRequest, NextResponse } from "next/server";

interface AdvertiseInquiry {
  company_name: string;
  email: string;
  message: string;
  budget?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AdvertiseInquiry = await req.json();

    // Validate required fields
    const { company_name, email, message } = body;
    if (!company_name || !email || !message) {
      return NextResponse.json(
        { error: "Campos requeridos: company_name, email, message" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // TODO: Store in database, send notification email, etc.
    console.log("[Advertise Inquiry]", {
      company_name,
      email,
      message,
      budget: body.budget ?? "not specified",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "¡Gracias por tu interés! Nos pondremos en contacto pronto.",
    });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
