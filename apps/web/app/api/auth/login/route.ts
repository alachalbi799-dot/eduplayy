import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === "student" && password === "eduplay123") {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "eduplay_session",
        value: "student",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json(
      { success: false, message: "Identifiants invalides. Veuillez réessayer." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue lors de la connexion." },
      { status: 500 }
    );
  }
}

